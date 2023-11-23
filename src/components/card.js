import { initialCards } from './cards.js';
import { popup } from './popup.js';

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');
const popupTypeImage = document.querySelector('.popup_type_image');

function createCard(
  cardItem,
  deleteCardCallback,
  likeCardCallback,
  showImagePopupCallback,
) {
  const card = cardTemplate.cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardImageAlt = `Изображение ${cardItem.name}`;
  const cardTitle = card.querySelector('.card__title');
  const cardDeleteButton = card.querySelector('.card__delete-button');
  const cardLikeButton = card.querySelector('.card__like-button');

  cardImage.title = cardItem.name;
  cardImage.src = cardItem.link;
  cardImage.alt = cardImageAlt;
  cardImage.addEventListener('click', showImagePopupCallback);

  cardTitle.textContent = cardItem.name;

  cardDeleteButton.addEventListener('click', deleteCardCallback);
  cardLikeButton.addEventListener('click', likeCardCallback);

  return card;
}

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

function deleteCard(event) {
  event.target.closest('.card').remove();
}

function likeCard(event) {
  event.target.classList.toggle('card__like-button_is-active');
}

function showImagePopup(evt) {
  popup.showImage(
    popupTypeImage,
    evt.target.title,
    evt.target.src,
    evt.target.alt,
  );
}

export { showCards, addCard };
