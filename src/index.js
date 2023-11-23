import './pages/index.css';
import { initialCards } from './cards.js';

import cardOneImage from './images/card_1.jpg';
import cardTwoImage from './images/card_2.jpg';
import cardThreeImage from './images/card_3.jpg';

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const POPUP_IS_OPENED_CLASS = 'popup_is-opened';

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

profileEditButton.addEventListener('click', () => {
  showPopup(popupTypeEdit);
});

profileAddButton.addEventListener('click', () => {
  showPopup(popupTypeNewCard);
});

function showPopup(popupElement) {
  popupElement.classList.add(POPUP_IS_OPENED_CLASS);

  const popupClose = popupElement.querySelector('.popup__close');
  popupClose.addEventListener('click', handlePopupCloseClick);
  document.addEventListener('click', handleOverlayClick);
  document.addEventListener('keydown', handleEscapeKeyDown);

  function handlePopupCloseClick() {
    popupClose.removeEventListener('click', handlePopupCloseClick);
    document.removeEventListener('click', handleOverlayClick);
    document.removeEventListener('keydown', handleEscapeKeyDown);
    popupElement.classList.remove(POPUP_IS_OPENED_CLASS);
  }

  function handleEscapeKeyDown(evt) {
    if (evt.key === 'Escape') {
      handlePopupCloseClick();
    }
  }

  function handleOverlayClick(evt) {
    if (evt.target.classList.contains(POPUP_IS_OPENED_CLASS)) {
      handlePopupCloseClick();
    }
  }
}
