const cardTemplate = document.querySelector('#card-template').content;

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

  cardImage.src = cardItem.link;
  cardImage.alt = cardImageAlt;
  cardImage.addEventListener('click', () => {
    showImagePopupCallback(cardItem.name, cardItem.link, cardImageAlt);
  });

  cardTitle.textContent = cardItem.name;

  cardDeleteButton.addEventListener('click', deleteCardCallback);
  cardLikeButton.addEventListener('click', likeCardCallback);

  return card;
}

function deleteCard(event) {
  event.target.closest('.card').remove();
}

function likeCard(event) {
  event.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, likeCard };
