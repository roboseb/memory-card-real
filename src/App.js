import { useState, useEffect } from "react";
import Card from "./Card";
import uniqid from "uniqid";
import dustGif from "./images/dust.gif";
import landingGif from "./images/landing.gif";
import pierreGif from "./images/pierre.gif";

function App() {

    const [chosenCards, setChosenCards] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [clickedCards, setClickedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [updater, setUpdater] = useState(0);
    const [lastCard, setLastCard] = useState(null);
    const [lastTarget, setLastTarget] = useState(null);
    const [lastRect, setLastRect] = useState(null);
    const [clickedCounter, setClickedCounter] = useState(0);
    const [highScore, setHighScore] = useState(0);


    const generateCards = () => {
        //Reset card data.
        setLoaded(false);
        setClickedCards([]);
        setChosenCards([]);
        setClickedCounter(0);

        async function getCards() {
            try {
                let response = await fetch(`https://api.magicthegathering.io/v1/cards?set=MMA&page=1`);
                let data = await response.json();

                let response2 = await fetch(`https://api.magicthegathering.io/v1/cards?set=MMA&page=2`);
                let data2 = await response2.json();

                let response3 = await fetch(`https://api.magicthegathering.io/v1/cards?set=MMA&page=3`);
                let data3 = await response3.json();

                return [data.cards, data2.cards, data3.cards];
            } catch (err) {
                alert(err);
            }
        }

        getCards().then((response) => {

            //Combine all set cards into one array.
            const setCards = response[0].concat(response[1], response[2]);
            let tempCards = [];
            for (let i = 0; i < 9; i++) {

                let randIndex = Math.floor(Math.random() * setCards.length);


                //Prevent reusing cards.
                while (tempCards.includes(setCards[randIndex])) {
                    randIndex = Math.floor(Math.random() * setCards.length);
                }

                tempCards.push(setCards[randIndex]);
                setChosenCards(tempCards);
            }
            setLoaded(true);
        });
    }



    //Update player score based on previously clicked cards.
    const updateScore = (card, target, cardRect) => {
        if (clickedCards.includes(card)) {
            setScore(0);
            launchOcto(cardRect);
        } else {
            setClickedCards(clickedCards => clickedCards.concat(card));
            setLastCard(card);
            setLastRect(cardRect);
            setLastTarget(target);
            setScore(score + 1);
        }
    }

    //Update highscore if current score is higher than last highscore.
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
        }
    }, [score]);

    //Generate new cards one all have been clicked once.
    useEffect(() => {
        setTimeout(() => {
            if (clickedCards.length >= 9) {
                alert('Generating new cards');
    
                //Generate new set of 9 cards.
                generateCards();
            }
        }, 1500);

    }, [clickedCards]);

    //Generate initial cards on load.
    useEffect(() => {
        generateCards();
    }, []);

    //Shuffle chosen cards into a new order.
    const shuffleCards = () => {

        let currentIndex = chosenCards.length, randomIndex;
        let tempCards = chosenCards;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [tempCards[currentIndex], tempCards[randomIndex]] = [
                tempCards[randomIndex], tempCards[currentIndex]];
        }

        setChosenCards(tempCards);

        //Force a rerender, because shuffling array order doesn't
        //do this on its own.
        setUpdater(updater + 1);
    }

    const moveCard = (card, target) => {
        
        const rect = lastRect;

        //Create the animated dust effect.
        const dust = document.querySelector('.dust');
        dust.style.filter = 'opacity(0.6)';
        dust.src = dustGif;



        dust.style.left = `${rect.left}px`;
        dust.style.top = `${rect.top}px`;


        //Remove the dust after it's done playing.
        setTimeout(() => {
            dust.style.filter = 'opacity(0)';
        }, 400)

        //Create a copy of the last clicked card.
        const cardCopy = document.createElement('img');
        cardCopy.src = target.src;
        cardCopy.classList.add('cardCopy');


        //Set the card copy position and dimensions to the clicked card.

        cardCopy.style.height = `${rect.height}px`;
        cardCopy.style.width = `${rect.width}px`;

        //Update CSS variables for animation using current position.
        const root = document.querySelector(':root');
        root.style.setProperty('--previousTop', `${rect.top}px`);
        root.style.setProperty('--previousLeft', `${rect.left}px`);
        root.style.setProperty('--previousWidth', `${rect.width}px`);

        //Set CSS variables for animations targets based on card
        //location in collection.

        const col = document.getElementById('collection');
        const collection = Array.from(col.children);
        const targetCard = collection[clickedCounter];

        //On target image load, show card and its animation.
        setTimeout(() => {
            const targetRect = targetCard.getBoundingClientRect()

            root.style.setProperty('--targetTop', `${targetRect.top}px`);
            root.style.setProperty('--targetLeft', `${targetRect.left}px`);


            cardCopy.style.left = `${targetRect.left}px`;
            cardCopy.style.top = `${targetRect.top}px`;

            const App = document.getElementById('App');
            App.appendChild(cardCopy);

            setClickedCounter(clickedCounter => clickedCounter + 1);
        }, 0);

        //Animate landing dust.
        setTimeout(() => {
            const targetRect = targetCard.getBoundingClientRect()
            const landing = document.querySelector('.landing');
            landing.src = landingGif;
            landing.style.filter = 'opacity(0.7)';

            //Set animation location to newest clicked card.
            landing.style.left = `${targetRect.left}px`;
            landing.style.top = `${targetRect.top}px`;

            //Hide the gif after animation.
            setTimeout(() => {
                landing.style.filter = 'opacity(0)';
            }, 350);
        }, 900);
    }

    //Animate Pierre launching off screen.
    const launchOcto = (rect) => {

        //Create the octopus and add it to the DOM
        const pierre = document.createElement('img');
        pierre.src = pierreGif;
        pierre.id = 'pierre';
        const App = document.getElementById('App');
        App.appendChild(pierre);

        //Choose a random trajectory for Pierre.
        const angle = Math.floor(Math.random() * 135);

        //Set the start point for Pierre,
        pierre.style.left = `${rect.left}px`;
        pierre.style.top = `${rect.top}px`;
        pierre.style.transform = `rotate(${angle}deg)`;

        //Set the end point for Pierre, and then delete him.
        setTimeout(() => {
            pierre.style.transform = `rotate(${angle}deg) translateY(-3000px)`;
            setTimeout(() => {
                pierre.remove();
            }, 1000)
        }, 0);

        //Create the wrong text element.
        const wrongText = document.createElement('div');
        wrongText.classList.add('wrongtext');
        wrongText.innerText = 'WRONG';

        //Set the position of the wrong text and append it.
        wrongText.style.left = `${rect.left}px`;
        wrongText.style.top = `${rect.top}px`;
        App.appendChild(wrongText);

        //Remove the wrong text.
        setTimeout(() => {
            wrongText.remove();
        }, 400);

    }

    useEffect(() => {
        if (lastCard === null) return;
        moveCard(lastCard, lastTarget);
    }, [lastTarget]);

    const toggleCover = () => {
        const cover = document.getElementById('cover');
        const coverBox = document.getElementById('coverbox');

        cover.classList.toggle('opencover');
        coverBox.classList.toggle('opencoverbox');

        setTimeout(() => {
            cover.classList.toggle('opencover');
            coverBox.classList.toggle('opencoverbox');
        }, 400);
    }

    if (loaded) {
        return (
            <div id="App">
                <img id='pierre' src={pierreGif} alt='A gif of dust'></img>
                <img className='dust' src={dustGif} alt='A gif of dust'></img>
                <img className='landing' src={landingGif} alt='A gif of dust'></img>
                <div id='header'>
                    <h1>Seb's Memory Card</h1>
                    <div id='score'>Score: {score}</div>
                    <div id='highscore'>Highscore: {highScore}</div>
                </div>

                <div id='binder'>

                    {chosenCards.map((item, index) => {
                        return <Card
                            info={chosenCards[index]}
                            key={uniqid()}
                            index={index}
                            updateScore={updateScore}
                            shuffleCards={shuffleCards}
                            toggleCover={toggleCover}
                        />
                    })}



                    <div id='coverbox' className='opencoverbox'>
                        <div id='cover' className='opencover'>
                            <h1>Ultra-Pro</h1>
                        </div>
                    </div>

                </div>

                <div id='collection'>
                    {/* {clickedCards.map((item, index) => {
                        return <Card
                            info={clickedCards[index]}
                            key={uniqid()}
                            index={index}
                            updateScore={updateScore}
                        />
                    })} */}
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                    <div className='cardShadow'></div>
                </div>


                <button id='resetbtn' onClick={generateCards}>
                    <div>Generate New Cards</div>
                    </button>
                 
            </div>
        );
    } else {
        return (
            <div id="App">
                PLEASE WAIT LOADING
            </div>
        );
    }


}

export default App;
