const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

function createCard(cardItem, deleteCardCallback) {
  const card = cardTemplate.cloneNode(true);
  card.querySelector('.card__image').src = cardItem.link;
  card.querySelector('.card__title').textContent = cardItem.name;
  card
    .querySelector('.card__delete-button')
    .addEventListener('click', deleteCardCallback);
  return card;
}

function deleteCard(event) {
  event.target.parentNode.remove();
}

function showCards() {
  initialCards.forEach((cardItem) => {
    placesList.append(createCard(cardItem, deleteCard));
  });
}

showCards();
