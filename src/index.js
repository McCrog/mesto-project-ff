import './pages/index.css';
import { initialCards } from './cards.js';
import { popup } from './popup.js';

import cardOneImage from './images/card_1.jpg';
import cardTwoImage from './images/card_2.jpg';
import cardThreeImage from './images/card_3.jpg';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');

function createCard(cardItem, deleteCardCallback) {
  const card = cardTemplate.cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardImageAlt = `Изображение ${cardItem.name}`;

  cardImage.src = cardItem.link;
  cardImage.alt = cardImageAlt;
  cardImage.addEventListener('click', () => {
    popup.showImage(popupTypeImage, cardItem.name, cardItem.link, cardImageAlt);
  });

  card.querySelector('.card__title').textContent = cardItem.name;
  card
    .querySelector('.card__delete-button')
    .addEventListener('click', deleteCardCallback);

  return card;
}

function deleteCard(event) {
  event.target.closest('.card').remove();
}

function addCard(cardItem, isPrepend) {
  if (isPrepend) {
    placesList.prepend(createCard(cardItem, deleteCard));
  } else {
    placesList.append(createCard(cardItem, deleteCard));
  }
}

function showCards() {
  initialCards.forEach((cardItem) => {
    addCard(cardItem, false);
  });
}

showCards();

profileEditButton.addEventListener('click', () => {
  popup.showEdit(
    popupTypeEdit,
    profileTitle.textContent,
    profileDescription.textContent,
    (newData) => {
      profileTitle.textContent = newData.firstValue;
      profileDescription.textContent = newData.secondValue;
    },
  );
});

profileAddButton.addEventListener('click', () => {
  popup.showAdd(popupTypeNewCard, (newData) => {
    addCard({ name: newData.firstValue, link: newData.secondValue }, true);
  });
});
