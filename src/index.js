import '../pages/index.css';

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
