import './pages/index.css';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import { popup } from './components/modal.js';

import cardOneImage from './images/card_1.jpg';
import cardTwoImage from './images/card_2.jpg';
import cardThreeImage from './images/card_3.jpg';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');

showCards();

function showCards() {
  initialCards.forEach((cardItem) => {
    addCard(cardItem, false);
  });
}

function addCard(cardItem, isPrepend) {
  if (isPrepend) {
    placesList.prepend(
      createCard(cardItem, deleteCard, likeCard, showImagePopup),
    );
  } else {
    placesList.append(
      createCard(cardItem, deleteCard, likeCard, showImagePopup),
    );
  }
}

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

function showImagePopup(evt) {
  popup.showImage(
    popupTypeImage,
    evt.target.title,
    evt.target.src,
    evt.target.alt,
  );
}
