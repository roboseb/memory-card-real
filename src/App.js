import { useState, useEffect } from "react";
import Card from "./Card";
import uniqid from "uniqid";

function App() {

    const [chosenCards, setChosenCards] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [clickedCards, setClickedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [updater, setUpdater] = useState(0);
    const [lastCard, setLastCard] = useState(null);
    const [lastTarget, setLastTarget] = useState(null);
    const [lastRect, setLastRect] = useState(null);

    const generateCards = () => {
        //Reset card data.
        setLoaded(false);
        setClickedCards([]);
        setChosenCards([]);

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
        } else {     
            setClickedCards(clickedCards => clickedCards.concat(card));
            setLastCard(card);
            setLastRect(cardRect);
            setLastTarget(target)
            setScore(score + 1);
        } 
    }

    //Generate new cards one all have been clicked once.
    useEffect(() => {

        if (clickedCards.length >= 9) {
            alert('Generating new cards');

            //Generate new set of 9 cards.
            generateCards();
            
        }
    }, [clickedCards]);

    //Generate initial cards on load.
    useEffect(() => {
        generateCards();
    }, []);

    //Shuffle chosen cards into a new order.
    const shuffleCards = () => {

        let currentIndex = chosenCards.length,  randomIndex;
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
        console.log('moving');
        const rect = lastRect;

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
        const index = clickedCards.indexOf(card);
        const collection = document.getElementById('collection');
        const colCards = Array.from(collection.children);

        const targetCard = colCards[index].firstChild;
        
        //On target image load, show card and its animation.
        targetCard.onload = () => {
            setTimeout(() => {
                console.log(targetCard, targetCard.getBoundingClientRect().left);


                const targetRect = targetCard.getBoundingClientRect()


                root.style.setProperty('--targetTop', `${targetRect.top}px`);
                root.style.setProperty('--targetLeft', `${targetRect.left}px`);


                cardCopy.style.left = `${targetRect.left}px`;
                cardCopy.style.top = `${targetRect.top}px`;

                const App = document.getElementById('App');
                App.appendChild(cardCopy);
            }, 0);
        }
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
                <div 
                    id='score'
                    >Score: {score}
                </div>
                <div id='collection'>
                    {clickedCards.map((item, index) => {
                        return <Card
                            info={clickedCards[index]}
                            key={uniqid()}
                            index={index}
                            updateScore={updateScore}
                        />
                    })}
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

                </div>      
                <div id='coverbox' className='opencoverbox'
                        >
                        <div id='cover' className='opencover'></div>
                </div>



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
