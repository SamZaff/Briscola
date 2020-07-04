import React, { useRef } from 'react'
import { connect } from 'react-redux';
import '../App.css'

const About = () => {
    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

    const summaryRef = useRef(null)
    const tutorialRef = useRef(null)
    const aboutRef = useRef(null)
    const cardsRef = useRef(null)

    return (
        <div>
            <h1>What is Briscola?</h1>
            <div className="table-of-contents">
                <h3>Table of Contents</h3>
                <ol>
                    <li onClick={() => scrollToRef(summaryRef)}>Summary</li>
                    <li onClick={() => scrollToRef(tutorialRef)}>How to Play
                    
                    </li>
                    <ul id = "sub">
                        <li onClick={() => scrollToRef(tutorialRef)}>Set up</li>
                        <li onClick={() => scrollToRef(tutorialRef)}>Rules</li>
                        <li onClick={() => scrollToRef(cardsRef)}>Know the cards</li>
                    </ul>
                    <li onClick={() => scrollToRef(aboutRef)}>About this Site</li>
                </ol>
            </div>
            <div className='content' ref={summaryRef}>
                <h2>Summary</h2>
                <p>Briscola is a popular, often competitively played, Italian card game that consists of 2-4 players.
                The objective of the game is to score as many points as possible, which is done through winning certain
                cards that are worth varying amounts of points each. A typical match will take about 5 to 10 minutes to complete.</p>
            </div>
            <div className='content' ref={tutorialRef}>
                <h2>How to play</h2>
                <h3>Set Up</h3>
                <p>Before the match begins, the top card of the deck is drawn and then placed underneath the deck facing upward.
                    Afterwards, each player draws until they have 3 cards in their hand, in clockwise order starting with the host.
                    The host will also be the first person to play a card from his/her hand in the first round.
                </p>
                <h3>Rules</h3>
                <p>Each person plays one of any of the three cards from his/her hand during their respective turns. The card that the round was
                    lead with, or rather the first card played that round, has the leading suit. To win a round, you must either play a higher
                    ranked card of the same suit, or play any card from the trump/briscola suit. The trump suit is what the suit of the card underneath
                    the deck is. The card ranking in ascending order goes 2 4 5 6 7 Jack (2 points) Queen (3 points) King (4 points) 3
                     (10 points) Ace (11 points). Players should focus on winning hands with cards that are worth points. With 2 players, there
                     are three possible outcomes. In the example below, the briscola card/suit is 4 of clubs:
                </p>
                <div className = 'example'>
                    <img src={require('../ItalianCards/2 of Cups.jpg')} className='card-face' alt='2 of Cups' />
                    <p>A plays</p>
                </div>
                <p style = {{display: 'inline-block', fontSize: 'xx-large', margin: '0px 7px 0px 7px'}}>→</p>
                <div className = 'example'>
                    <img src={require('../ItalianCards/6 of Gold.jpg')} className='card-face' alt='2 of Cups' />
                    <p>B plays</p>
                </div>
                <p style = {{display: 'inline-block', fontSize: 'large', margin: '0px 7px 0px 7px'}}>= A wins the hand</p>
                <br/>

                <div className = 'example'>
                    <img src={require('../ItalianCards/2 of Cups.jpg')} className='card-face' alt='2 of Cups' />
                    <p>A plays</p>
                </div>
                <p style = {{display: 'inline-block', fontSize: 'xx-large', margin: '0px 7px 0px 7px'}}>→</p>
                <div className = 'example'>
                    <img src={require('../ItalianCards/5 of Cups.jpg')} className='card-face' alt='2 of Cups' />
                    <p>B plays</p>
                </div>
                <p style = {{display: 'inline-block', fontSize: 'large', margin: '0px 7px 0px 7px'}}>= B wins the hand</p>
                <br/>

                <div className = 'example'>
                    <img src={require('../ItalianCards/2 of Cups.jpg')} className='card-face' alt='2 of Cups' />
                    <p>A plays</p>
                </div>
                <p style = {{display: 'inline-block', fontSize: 'xx-large', margin: '0px 7px 0px 7px'}}>→</p>
                <div className = 'example'>
                    <img src={require('../ItalianCards/7 of Clubs.jpg')} className='card-face' alt='2 of Cups' />
                    <p>B plays</p>
                </div>
                <p style = {{display: 'inline-block', fontSize: 'large', margin: '0px 7px 0px 7px'}}>= B wins the hand</p>
            <p>
                Who ever wins the hand gets to be the first to draw a card as well as the first to play a card the next hand. 
                The game ends when there are no cards left in the deck (including the briscola card placed on the bottom) and 
                each player's hands are empty. Who ever has the most points out of 120 points total wins the game.
            </p>
            <h3 ref={cardsRef}>Know the cards</h3>
            <p>
                Not familiar with Italian cards? Don't worry, you will quickly learn that an Italian deck of cards is similar to a
                standard deck of Bicycle cards. There are however 3 distinct differences: the types of suits, the number of cards, and
                 the face cards. While decks from other regions typically have 52 cards (not including jokers), Italian cards have 40, 
                 with all the same cards except 8s 9s and 10s. There are still 4 suits just like a Bicycle deck, but they are different. 
                 Usually, the suits are gold/coins, swords, clubs (literally!), and cups. Lastly are the face cards. While technically 
                 the proper names of these cards aren't Jack, Queen, and King, I use these names for simplicity's sake. To tell which is 
                 which, each type has a theme to it. Queens are always riding horses, Kings are always wearing crowns, and Jacks are 
                 shown with neither of these things.
            </p>
            <div className = 'example'>
                    <img src={require('../ItalianCards/Jack of Swords.jpg')} className='card-face' alt='2 of Cups' />
                    <p>Jack</p>
                </div>
                <div className = 'example'>
                    <img src={require('../ItalianCards/Queen of Swords.jpg')} className='card-face' alt='2 of Cups' />
                    <p>Queen</p>
                </div>
                <div className = 'example'>
                    <img src={require('../ItalianCards/King of Swords.jpg')} className='card-face' alt='2 of Cups' />
                    <p>King</p>
                </div>
            </div>
            <div className='content' ref={aboutRef}>
                <h2>About this site</h2>
                <p>This was a project made during Covid-19 to give my family a way to play one of our favorite card games without having to be
                    in person. Node.js, Express, MongoDB, CSS, and React.js are the frameworks used to create this website. 
                  JavaScript libraries such as md5 for passwords, axios for transfering client-server data, and socket.io for 
                  real-time player actions. Supported browsers include Google Chrome, Safari, Edge, and Firefox. NOTE: some devices might not
                  display things properly in the game room. Typically the solution is just to zoom out your browser, because some divs may be
                  overlapping.</p>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(About);