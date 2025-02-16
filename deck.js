

var methods = {
  getDeck: function () {

    deck = [{
      name: 'Ace of Gold',
      suit: 'Gold',
      value: 11,
      number: 1,
    },
    {
      name: '2 of Gold',
      suit: 'Gold',
      value: 0,
      number: 2,
    },
    {
      name: '3 of Gold',
      suit: 'Gold',
      value: 10,
      number: 3,
    },
    {
      name: '4 of Gold',
      suit: 'Gold',
      value: 0,
      number: 4,
    },
    {
      name: '5 of Gold',
      suit: 'Gold',
      value: 0,
      number: 5,
    },
    {
      name: '6 of Gold',
      suit: 'Gold',
      value: 0,
      number: 6,
    },
    {
      name: '7 of Gold',
      suit: 'Gold',
      value: 0,
      number: 7,
    },
    {
      name: 'Jack of Gold',
      suit: 'Gold',
      value: 2,
      number: 8,
    },
    {
      name: 'Queen of Gold',
      suit: 'Gold',
      value: 3,
      number: 9,
    },
    {
      name: 'King of Gold',
      suit: 'Gold',
      value: 4,
      number: 10,
    },
    {
      name: 'Ace of Swords',
      suit: 'Swords',
      value: 11,
      number: 1,
    },
    {
      name: '2 of Swords',
      suit: 'Swords',
      value: 0,
      number: 2,
    },
    {
      name: '3 of Swords',
      suit: 'Swords',
      value: 10,
      number: 3,
    },
    {
      name: '4 of Swords',
      suit: 'Swords',
      value: 0,
      number: 4,
    },
    {
      name: '5 of Swords',
      suit: 'Swords',
      value: 0,
      number: 5,
    },
    {
      name: '6 of Swords',
      suit: 'Swords',
      value: 0,
      number: 6,
    },
    {
      name: '7 of Swords',
      suit: 'Swords',
      value: 0,
      number: 7,
    },
    {
      name: 'Jack of Swords',
      suit: 'Swords',
      value: 2,
      number: 8,
    },
    {
      name: 'Queen of Swords',
      suit: 'Swords',
      value: 3,
      number: 9,
    }, {
      name: 'King of Swords',
      suit: 'Swords',
      value: 4,
      number: 10,
    },
    {
      name: 'Ace of Cups',
      suit: 'Cups',
      value: 11,
      number: 1,
    },
    {
      name: '2 of Cups',
      suit: 'Cups',
      value: 0,
      number: 2,
    },
    {
      name: '3 of Cups',
      suit: 'Cups',
      value: 10,
      number: 3,
    },
    {
      name: '4 of Cups',
      suit: 'Cups',
      value: 0,
      number: 4,
    },
    {
      name: '5 of Cups',
      suit: 'Cups',
      value: 0,
      number: 5,
    },
    {
      name: '6 of Cups',
      suit: 'Cups',
      value: 0,
      number: 6,
    },
    {
      name: '7 of Cups',
      suit: 'Cups',
      value: 0,
      number: 7,
    },
    {
      name: 'Jack of Cups',
      suit: 'Cups',
      value: 2,
      number: 8,
    },
    {
      name: 'Queen of Cups',
      suit: 'Cups',
      value: 3,
      number: 9,
    },
    {
      name: 'King of Cups',
      suit: 'Cups',
      value: 4,
      number: 10,
    },
    {
      name: 'Ace of Clubs',
      suit: 'Clubs',
      value: 11,
      number: 1,
    },
    {
      name: '2 of Clubs',
      suit: 'Clubs',
      value: 0,
      number: 2,
    },
    {
      name: '3 of Clubs',
      suit: 'Clubs',
      value: 10,
      number: 3,
    },
    {
      name: '4 of Clubs',
      suit: 'Clubs',
      value: 0,
      number: 4,
    },
    {
      name: '5 of Clubs',
      suit: 'Clubs',
      value: 0,
      number: 5,
    },
    {
      name: '6 of Clubs',
      suit: 'Clubs',
      value: 0,
      number: 6,
    },
    {
      name: '7 of Clubs',
      suit: 'Clubs',
      value: 0,
      number: 7,
    },
    {
      name: 'Jack of Clubs',
      suit: 'Clubs',
      value: 2,
      number: 8,
    },
    {
      name: 'Queen of Clubs',
      suit: 'Clubs',
      value: 3,
      number: 9,
    },
    {
      name: 'King of Clubs',
      suit: 'Clubs',
      value: 4,
      number: 10,
    }]

    return deck;
  },

  shuffle: function (deck) {
    var temp, pos;
    for (var i = deck.length - 1; i > 0; i--) {
      pos = Math.floor(Math.random() * (i + 1))
      temp = deck[i]
      deck[i] = deck[pos]
      deck[pos] = temp
    }
    return deck;
  }
}


exports.data = methods
