function newLinkSubscribe(parent, args, context) {
    return context.pubsub.asyncIterator("NEW_LINK"); //This function is used to resolve the subscription and push the event data 
}

const newLink = {
    subscribe: newLinkSubscribe,
    resolve: (payload) => payload
}

function newVoteSubscribe(parent, args, context) {
    return context.pubsub.asyncIterator("NEW_VOTE");
}

const newVote = {
    subscribe: newVoteSubscribe,
    resolve: (payload) => payload
}

module.exports = {
    newLink,
    newVote
}