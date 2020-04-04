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

export const updatePoints = points => ({
    type: 'UPDATE_POINTS',
    points
})

export const toggleCheckWinner = checkWinner => ({
    type: 'CHECK_WINNER',
    checkWinner
})

export const increaseScore = score => ({
    type: 'INCREASE_SCORE',
    score
})