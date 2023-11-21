import '../pages/index.css';
import { initialCards } from './cards.js';

import avatarImage from '../images/avatar.jpg';
import cardOneImage from '../images/card_1.jpg';
import cardTwoImage from '../images/card_2.jpg';
import cardThreeImage from '../images/card_3.jpg';

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

function createCard(cardItem, deleteCardCallback) {
  const card = cardTemplate.cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  cardImage.src = cardItem.link;
  cardImage.alt = `Изображение ${cardItem.name}`;
  card.querySelector('.card__title').textContent = cardItem.name;
  card
    .querySelector('.card__delete-button')
    .addEventListener('click', deleteCardCallback);
  return card;
}

function deleteCard(event) {
  event.target.closest('.card').remove();
}

function showCards() {
  initialCards.forEach((cardItem) => {
    placesList.append(createCard(cardItem, deleteCard));
  });
}

showCards();
