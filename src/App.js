import { useState, useEffect } from "react";
import Card from "./Card";
import uniqid from "uniqid";

function App() {

    const [chosenCards, setChosenCards] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [clickedCards, setClickedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [updater, setUpdater] = useState(0);

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
                console.log(chosenCards);
                let randIndex = Math.floor(Math.random() * setCards.length);
                

                //Prevent reusing cards.
                while (chosenCards.includes(setCards[randIndex])) {
                    randIndex = Math.floor(Math.random() * setCards.length);
                }

                
                tempCards.push(setCards[randIndex]);
                setChosenCards(tempCards);
                console.log(chosenCards);
                
        
            }
            setLoaded(true);
        });
    }

    

    //Update player score based on previously clicked cards.
    const updateScore = (card) => {
        if (clickedCards.includes(card)) {
            setScore(0);
        } else {
            setScore(score + 1);
            setClickedCards(clickedCards.concat(card));
        }    
        if (clickedCards.length >= 9) {
            alert('Generating new cards');

            //Generate new set of 9 cards.
            generateCards();
            
        } else {
            shuffleCards();
        }
    }

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

    if (loaded) {
        return (
            <div className="App">
                <div 
                    id='score'
                    >Score: {score}
                </div>
                <div id='binder'>
                    {chosenCards.map((item, index) => {
                        return <Card 
                            info={chosenCards[index]}
                            key={uniqid()}
                            index={index}
                            updateScore={updateScore}
                        />
                    })}
                </div>      


            </div>
        );
    } else {
        return (
            <div className="App">
                PLEASE WAIT LOADING
            </div>
        );
    }


}

export default App;
