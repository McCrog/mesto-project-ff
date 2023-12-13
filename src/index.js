// #region imports

import './pages/index.css';
import {
  CARD_SELECTOR,
  CARD_LIKES_COUNT_SELECTOR,
  CARD_LIKE_BUTTON_ACTIVE_CLASS,
  createCard,
} from './components/card.js';
import {
  POPUP_IS_OPENED_CLASS,
  openModal,
  closeModal,
} from './components/modal.js';
import {
  validationConfig,
  enableValidation,
  clearValidation,
} from './components/validation.js';
import {
  getInitialCardsRequest,
  addCardRequest,
  deleteCardRequest,
  addCardLikeRequest,
  removeCardLikeRequest,
  getInitialProfileRequest,
  updateProfileRequest,
  updateProfileAvatarRequest,
} from './components/api.js';

// #endregion imports

// #region variables

const POPUP_CLOSE_SELECTOR = '.popup__close';
const POPUP_FORM_SELECTOR = '.popup__form';
const POPUP_INPUT_TYPE_URL_SELECTOR = '.popup__input_type_url';
const POPUP_BUTTON_SELECTOR = '.popup__button';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const modalTypeEditAvatar = document.querySelector('.popup_type_edit-avatar');
const modalTypeEditAvatarForm =
  modalTypeEditAvatar.querySelector(POPUP_FORM_SELECTOR);
const modalTypeEditAvatarLinkInput = modalTypeEditAvatar.querySelector(
  POPUP_INPUT_TYPE_URL_SELECTOR,
);
const modalTypeEditAvatarSubmitButton = modalTypeEditAvatar.querySelector(
  POPUP_BUTTON_SELECTOR,
);

const modalTypeEditProfile = document.querySelector('.popup_type_edit');
const modalTypeEditProfileForm =
  modalTypeEditProfile.querySelector(POPUP_FORM_SELECTOR);
const modalTypeEditProfileNameInput = modalTypeEditProfile.querySelector(
  '.popup__input_type_name',
);
const modalTypeEditProfileJobInput = modalTypeEditProfile.querySelector(
  '.popup__input_type_description',
);
const modalTypeEditProfileSubmitButton = modalTypeEditProfile.querySelector(
  POPUP_BUTTON_SELECTOR,
);

const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeNewCardForm =
  modalTypeNewCard.querySelector(POPUP_FORM_SELECTOR);
const modalTypeNewCardNameInput = modalTypeNewCard.querySelector(
  '.popup__input_type_card-name',
);
const modalTypeNewCardLinkInput = modalTypeNewCard.querySelector(
  POPUP_INPUT_TYPE_URL_SELECTOR,
);
const modalTypeNewCardSubmitButton = modalTypeNewCard.querySelector(
  POPUP_BUTTON_SELECTOR,
);

const modalTypeImage = document.querySelector('.popup_type_image');
const modalTypeImageImage = modalTypeImage.querySelector('.popup__image');
const modalTypeImageName = modalTypeImage.querySelector('.popup__caption');

let userId = '';
let profileAvatarLink = '';
let profileTitleText = '';
let profileDescriptionText = '';

// #endregion variables

// #region init data

Promise.all([getInitialProfileRequest(), getInitialCardsRequest()])
  .then(([profileResponse, cardsResponse]) => {
    init(profileResponse, cardsResponse);
  })
  .catch((err) => {
    console.log(err);
  });

function init(profileResponse, cardsResponse) {
  userId = profileResponse._id;
  initProfile(profileResponse);
  initCards(cardsResponse);
  enableValidation(validationConfig);
}

// #endregion init data

// #region profile

function initProfile(initialProfileResponse) {
  updateProfileAvatarData(initialProfileResponse.avatar);
  updateProfileData(initialProfileResponse.name, initialProfileResponse.about);
}

function updateProfileAvatarData(link) {
  profileAvatarLink = link;

  updateProfileAvatarContent();
}

function updateProfileAvatarContent() {
  profileImage.style.backgroundImage = `url(${profileAvatarLink})`;
}

function updateProfileData(title, description) {
  profileTitleText = title;
  profileDescriptionText = description;

  updateProfileContent();
}

function updateProfileContent() {
  profileTitle.textContent = profileTitleText;
  profileDescription.textContent = profileDescriptionText;
}

// #endregion profile

// #region cards

function initCards(initialCards) {
  initialCards.forEach((cardItem) => {
    addCard(cardItem, false);
  });
}

function addCard(cardItem, isPrepend) {
  const newCard = createCard(
    userId,
    cardItem,
    deleteCardCallback,
    likeCardCallback,
    onCardImageClickCallback,
  );

  if (isPrepend) {
    placesList.prepend(newCard);
  } else {
    placesList.append(newCard);
  }
}

function deleteCardCallback(event) {
  const card = event.target.closest(CARD_SELECTOR);

  deleteCardRequest(card.id)
    .then(() => {
      card.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}

function likeCardCallback(event) {
  const cardLikeButton = event.target;
  const card = cardLikeButton.closest(CARD_SELECTOR);
  const cardLikesCountElement = card.querySelector(CARD_LIKES_COUNT_SELECTOR);
  const likeRequest = cardLikeButton.classList.contains(
    CARD_LIKE_BUTTON_ACTIVE_CLASS,
  )
    ? removeCardLikeRequest(card.id)
    : addCardLikeRequest(card.id);

  likeRequest
    .then((response) => {
      cardLikeButton.classList.toggle(CARD_LIKE_BUTTON_ACTIVE_CLASS);
      cardLikesCountElement.textContent =
        response.likes.length > 0 ? response.likes.length : '';
    })
    .catch((err) => {
      console.log(err);
    });
}

function onCardImageClickCallback(title, src, alt) {
  modalTypeImageImage.src = src;
  modalTypeImageImage.alt = alt;
  modalTypeImageName.textContent = title;

  openModal(modalTypeImage);
}

// #endregion cards

// #region init close modals

document.querySelectorAll('.popup').forEach((modal) => {
  modal.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains(POPUP_IS_OPENED_CLASS)) {
      closeModal(evt.target);
    }
  });

  const modalButtonClose = modal.querySelector(POPUP_CLOSE_SELECTOR);
  modalButtonClose.addEventListener('click', () => {
    closeModal(modal);
  });
});

// #endregion init close modals

// #region open modal

profileImage.addEventListener('click', () => {
  modalTypeEditAvatarLinkInput.value = profileAvatarLink;

  clearValidation(modalTypeEditAvatarForm, validationConfig, true);
  openModal(modalTypeEditAvatar);
});

profileEditButton.addEventListener('click', () => {
  modalTypeEditProfileNameInput.value = profileTitleText;
  modalTypeEditProfileJobInput.value = profileDescriptionText;

  clearValidation(modalTypeEditProfileForm, validationConfig, true);
  openModal(modalTypeEditProfile);
});

profileAddButton.addEventListener('click', () => {
  modalTypeNewCardForm.reset();
  clearValidation(modalTypeNewCardForm, validationConfig, false);
  openModal(modalTypeNewCard);
});

// #endregion open modal

// #region form submit

modalTypeEditAvatarForm.addEventListener(
  'submit',
  handleEditProfileAvatarFormSubmit,
);
modalTypeEditProfileForm.addEventListener(
  'submit',
  handleEditProfileFormSubmit,
);
modalTypeNewCardForm.addEventListener('submit', handleAddCardFormSubmit);

function handleEditProfileAvatarFormSubmit(evt) {
  function makeRequest() {
    return updateProfileAvatarRequest(modalTypeEditAvatarLinkInput.value).then(
      (response) => {
        updateProfileAvatarData(response.avatar);
        closeModal(modalTypeEditAvatar);
      },
    );
  }

  handleFormSubmit(makeRequest, evt);
}

function handleEditProfileFormSubmit(evt) {
  function makeRequest() {
    return updateProfileRequest(
      modalTypeEditProfileNameInput.value,
      modalTypeEditProfileJobInput.value,
    ).then((response) => {
      updateProfileData(response.name, response.about);
      closeModal(modalTypeEditProfile);
    });
  }

  handleFormSubmit(makeRequest, evt);
}

function handleAddCardFormSubmit(evt) {
  function makeRequest() {
    return addCardRequest(
      modalTypeNewCardNameInput.value,
      modalTypeNewCardLinkInput.value,
    ).then((response) => {
      closeModal(modalTypeNewCard);
      addCard(response, true);
    });
  }

  handleFormSubmit(makeRequest, evt);
}

function handleFormSubmit(request, evt, loadingText = 'Сохранение...') {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  renderLoadingButton(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    })
    .finally(() => {
      renderLoadingButton(false, submitButton, initialText);
    });
}

function renderLoadingButton(
  isLoading,
  buttonElement,
  initialText = 'Сохранить',
  loadingText = 'Сохранение...',
) {
  if (isLoading) {
    buttonElement.textContent = loadingText;
  } else {
    buttonElement.textContent = initialText;
  }
}

// #endregion form submit
