export const updateCards = cards => ({
    type: 'UPDATE_CARDS',
    cards
})

export const updateCardField = cardField => ({
    type: 'UPDATE_CURRENT_CARD',
    cardField
})

export const updateHand = hand => ({
    type: 'UPDATE_HAND',
    hand
})

export const updateTurn = turn => ({
    type: 'UPDATE_TURN',
    turn
})

export const increaseScore = score => ({
    type: 'INCREASE_SCORE',
    score
})

export const toggleCheckOverallWinner = checkOverallWinner => ({
    type: 'CHECK_OVERALL_WINNER',
    checkOverallWinner
})

export const setTrumpSuit = trump => ({
    type: 'SET_TRUMP_SUIT',
    trump
})

export const toggleJoinRequest = joinRequest => ({
    type: 'TOGGLE_JOIN_REQUEST',
    joinRequest
})