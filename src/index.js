import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';




async function getCards() {
    let response;
    try {
        response = await fetch(`https://api.magicthegathering.io/v1/cards?set=MMA&page=3`);
    } catch (err) {
        alert(err);
    }

    const cardData = await response.json();

    console.log(cardData)
}

getCards();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


