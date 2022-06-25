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
        setScore(0);

        //Animate the cover to hide cards loading.
        toggleCover(1100);

        //Remove card copies from DOM.
        if (Array.from(document.querySelectorAll('.cardCopy')).length !== 0) {
            const cardCopies = Array.from(document.querySelectorAll('.cardCopy'));
            cardCopies.forEach(card => {
                
                card.classList.add('killedcard');

                setTimeout(() => {
                    card.remove();
                }, 500);
            });
        }




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
                console.log(err);
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
                showMessage();
                
                //Generate new set of 9 cards.
                generateCards();
            }
        }, 1500);

    }, [clickedCards]);

    //Show a message congratulating the player and telling them
    //that it will generate new cards.
    const showMessage = () => {
        const message = document.createElement('div');
        message.id = 'winmessage';
        message.innerText = 'Congrats, new cards for you!';

        const App = document.getElementById('App');
        App.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 500);

        const newRect = {left: window.innerWidth/2,
                        top: window.innerHeight/2};

        for (let i = 0; i < 360; i += 30) {
            launchOcto(newRect, i);
        }
    }

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

            const rootEl = document.getElementById('root');
            rootEl.appendChild(cardCopy);

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
    const launchOcto = (rect, newAngle) => {

        //Create the octopus and add it to the DOM
        const pierre = document.createElement('img');
        pierre.src = pierreGif;
        pierre.id = 'pierre';
        const App = document.getElementById('App');
        App.appendChild(pierre);

        //Choose a random trajectory for Pierre.
        let angle = Math.floor(Math.random() * 180);

        //Use a custom angle if passed.
        if (newAngle !== undefined) {
            angle = newAngle;
        }

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

    const toggleCover = (timer) => {
        const cover = document.getElementById('cover');
        const coverBox = document.getElementById('coverbox');

        cover.classList.toggle('opencover');
        coverBox.classList.toggle('opencoverbox');

        setTimeout(() => {
            cover.classList.toggle('opencover');
            coverBox.classList.toggle('opencoverbox');
        }, timer);
    }

    //Toggle visibility of the info box.
    const toggleInfo = () => {
        const infoBox = document.getElementById('info');
        infoBox.classList.toggle('infoshown');
    }

   
    return (
        <div id="App">
            <img id='pierremain' src={pierreGif} alt='A spinning octopus named Pierre'></img>
            <img className='dust' src={dustGif} alt='A gif of dust'></img>
            <img className='landing' src={landingGif} alt='A gif of dust'></img>

            <div id='infobtn' onClick={toggleInfo}><div>?</div></div>
            <div id='info'>
                "What in the name of Aunt Pierrita is going on?", you might ask.
                Well friend, it's very simple. Our crimson molluscan pal Pierre here
                is interested in giving away his Modern Masters collection! However,
                he will only allow you to use them in building a commander deck.
                As you can imagine, this means you can only choose each card once.
                If you happen to choose the same card twice from a page, you get
                nothing! How cruel is that? Very cruel indeed, for you see, Pierre
                has had a very tiresome and challenging past. There was a time before
                the Intersection of Planes when mankind knew not of sapient species outside
                themselves. Such was a time of relative peace. But men in that time
                had grown disinterested with women of their species. With so many advancements
                in technology, money had no meaning, and with that, it came to be that
                women had also lost their interest in men. One woman, by the most fitting
                name of Dorothy, had grown particularly fond a blue-ringed octopus named
                Gerard with which she was performing research. Men had lost their drive 
                for money, and therefore their drive to exceed in life. But Gerard seemed
                motivated by something entirely foreign to Dorothy, and she demanded to know
                what. Over the course of her life, she dedicated herself to finding a method
                to communicate with Octopi in the common tongues of the land. And she was
                succesful! A happy ending it was, for Dorothy. She and Gerard were soon married
                after her discovery. She learned that even those considered lower creatures were
                capable of grand ideas, and even, as was revealed, love. For the rest
                of the world, this discovery had incredibly far reaching implications.
                As you may already know, Octopi are among the most intelligent creatures 
                of God's design. Perhaps it was intentional, then, that God did not grant
                this species the ability of human-like speech. Over the next centuries, 
                man would learn quite a lot about the desires of the molluscans. As with
                humanity, most were content to simply live day to day, foraging for snails
                and slugs and playing tricks on researchers with their abilites to camouflage
                condense to the size of their beaks. However, again as with the humans,
                there were outliers who had much grander plans. Once they were fully capable
                of communications, leaders rapidly rose from the ranks below the sea.
                They immediately demanded an audience with the world leaders of the most 
                powerful and influential groups of Earth. Among them, some were apprehensive.
                After all, the outcome of such a conference had never before been seen,
                and the world leaders were fearful of the potential outcomes. The United 
                Continent of America and its territory Mexicanada saw a large potential in 
                using the both the unique mechanical skills and intelligence of the Octopi
                to bolster the efficacy of their stock market. President Greta Thumberger 
                didn't waste time mentioning the importance of immediately having as large
                a population of the new arrivals be taken in as immigrants of her country. 
                Her motivations for this eluded leaders and economists at the time, and this
                confusion remains today. Japan commented that it would indeed be comical
                to witness an Octopus making four pieces of takoyaki simultaneously. 
                Historians remind us often to learn from the mistakes of our past. Year after
                year, decade after decade, century after century and millenium after millenium
                mankind seemed to regularly forget this simple piece of advice. But the
                molluscans happened to be just a bit different. After all, it only took
                two tentacles, three at most, to hunt their required nourishment each day.
                This left them with plenty of time and energy to plot their course of action
                once they joined man on land and in his cities. They came to their conclusion
                rather quickly, in fact. In 255 BC they had congregated and decided that 
                the simplest most effective choice would be to simply assimilate. And so,
                in the years following the marital joining of Dorothy and Gerard, that is what
                happened. The Octopi of all seven seas joined humanity on dry land across the
                entire globe. They had much valuable information to learn from humans, 
                and in return they shared their own vast wealth of knowledge. Recipes,
                songs, art, games, sports, tales and histories were all shared willingly
                and with joy between the two groups. And the same content congregation continued
                in the same way to the present day, as it is predicted to continue well into
                the future. That brings us back to our little friend Pierre. Why did his life
                not reflect the incredible peace and prosperity of the rest of the world?
                Well, it was rather simple. He had recently played against a land-hate deck
                in a game of Magic: The Gathering. That was it. That was all. And now it was time
                to depart with his collection. That's where you came in! Remember the rules?
                Well, let's go!
            </div>


            <div id='header'>
                <h1>Seb's Memory Card</h1>
                <div id='scorebox'>
                    <div id='score'>Score: {score}</div>
                    <div id='highscore'>Highscore: {highScore}</div>
                </div>

            </div>
            <div id='binder'>
                {loaded ?

                    
                        chosenCards.map((item, index) => {
                            return <Card
                                info={chosenCards[index]}
                                key={uniqid()}
                                index={index}
                                updateScore={updateScore}
                                shuffleCards={shuffleCards}
                                toggleCover={() => toggleCover(400)}
                            />
                        })
                    



                    :
                    <div id='loadmessage'>Please wait, loading...</div>
                }
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
}

export default App;
