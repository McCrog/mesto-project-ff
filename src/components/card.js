const CARD_SELECTOR = '.card';
const CARD_LIKES_COUNT_SELECTOR = '.card__likes-count';
const CARD_LIKE_BUTTON_ACTIVE_CLASS = 'card__like-button_is-active';

const cardTemplate = document.querySelector('#card-template').content;

function createCard(
  userId,
  cardItem,
  deleteCardCallback,
  likeCardCallback,
  onCardImageClickCallback,
) {
  const card = cardTemplate.cloneNode(true);
  const cardElement = card.querySelector(CARD_SELECTOR);
  const cardImage = card.querySelector('.card__image');
  const cardImageAlt = `Изображение ${cardItem.name}`;
  const cardTitle = card.querySelector('.card__title');
  const cardDeleteButton = card.querySelector('.card__delete-button');
  const cardLikeButton = card.querySelector('.card__like-button');

  cardElement.id = cardItem._id;

  cardImage.src = cardItem.link;
  cardImage.alt = cardImageAlt;
  cardImage.addEventListener('click', () => {
    onCardImageClickCallback(cardItem.name, cardItem.link, cardImageAlt);
  });

  cardTitle.textContent = cardItem.name;

  if (userId === cardItem.owner._id) {
    cardDeleteButton.addEventListener('click', deleteCardCallback);
  } else {
    cardDeleteButton.style.display = 'none';
  }

  if (cardItem.likes.length > 0) {
    const cardLikesCountElement = card.querySelector(CARD_LIKES_COUNT_SELECTOR);
    cardLikesCountElement.textContent = cardItem.likes.length;

    if (cardItem.likes.some((user) => user._id === userId)) {
      cardLikeButton.classList.add(CARD_LIKE_BUTTON_ACTIVE_CLASS);
    }
  }

  cardLikeButton.addEventListener('click', likeCardCallback);

  return card;
}

export {
  CARD_SELECTOR,
  CARD_LIKES_COUNT_SELECTOR,
  CARD_LIKE_BUTTON_ACTIVE_CLASS,
  createCard,
};
