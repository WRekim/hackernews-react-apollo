const { APP_SECRET, getUserId, getTokenPayload } = require('../utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function signup(parent, args, context) {

    const password = await bcrypt.hash(args.password, 10);

    const newUser = await context.prisma.user.create({
        data: {
            ...args,
            password
        }
    });

    const token = jwt.sign({ userId: newUser.id }, APP_SECRET);

    return {
        token,
        newUser
    };
}

async function login(parent, args, context) {

    const user = await context.prisma.user.findUnique({ where: { email: args.email } });
    if (!user) throw new Error('No such user found');

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user
    }
}

async function post(parent, { description, url }, context) {

    const { userId } = context;

    const newLink = await context.prisma.link.create({
        data: {
            url,
            description,
            postedBy: { connect: { id: userId } }
        }
    })

    context.pubsub.publish("NEW_LINK", newLink);

    return newLink;
}

async function vote(parent, { linkId }, context) {
    const { userId } = context;
    const vote = await context.prisma.vote.findUnique({
        where: {
            linkId_userId: {
                linkId: Number(linkId),
                userId: userId
            }
        }
    })

    if (Boolean(vote)) {
        throw new Error(`Already voted for link ${Number(linkId)}`)
    }

    const newVote = await context.prisma.vote.create({
        data: {
            user: { connect: { id: userId }},
            link: { connect: { id: Number(linkId)}}
        }
    })

    context.pubsub.publish("NEW_VOTE", newVote);
    return newVote; 
}

module.exports = {
    signup,
    login,
    post,
    vote
}