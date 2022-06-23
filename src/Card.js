import { useEffect, useState } from "react";

function Card(props) {


    //Display card on load.
    const showImage = (e) => {
        e.target.classList.add('shown');
    }



    return (
        <div className="Card">
            <img 
                src={props.info.imageUrl} 
                alt='A magic card'
                onLoad={showImage}
                onClick={(e) => {
            
                    
                    if (props.shuffleCards !== undefined) {
                        props.updateScore(props.info, e.target, e.target.getBoundingClientRect());
                        props.toggleCover();
                        setTimeout(() => {
                            props.shuffleCards();
                        }, 100);
                        
                    }
                    
                }}
            ></img>
        </div>
    );
}

export default Card;