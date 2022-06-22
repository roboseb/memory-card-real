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
                onClick={() => props.updateScore(props.info)}
            ></img>
        </div>
    );
}

export default Card;