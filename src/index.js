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
} from './scripts/validation.js';
import {
  getInitialCardsRequest,
  addCardRequest,
  deleteCardRequest,
  addCardLikeRequest,
  removeCardLikeRequest,
  getInitialProfileRequest,
  updateProfileRequest,
  updateProfileAvatarRequest,
} from './scripts/api.js';

// #endregion imports

// #region variables

const POPUP_CLOSE_SELECTOR = '.popup__close';
const POPUP_FORM_SELECTOR = '.popup__form';
const POPUP_INPUT_TYPE_URL_SELECTOR = '.popup__input_type_url';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const modalEditAvatar = document.querySelector('.popup_type_edit-avatar');
const modalEditAvatarForm = modalEditAvatar.querySelector(POPUP_FORM_SELECTOR);
const modalEditAvatarLinkInput = modalEditAvatar.querySelector(
  POPUP_INPUT_TYPE_URL_SELECTOR,
);

const modalEditProfile = document.querySelector('.popup_type_edit');
const modalEditProfileForm =
  modalEditProfile.querySelector(POPUP_FORM_SELECTOR);
const modalEditProfileNameInput = modalEditProfile.querySelector(
  '.popup__input_type_name',
);
const modalEditProfileAboutInput = modalEditProfile.querySelector(
  '.popup__input_type_description',
);

const modalNewCard = document.querySelector('.popup_type_new-card');
const modalNewCardForm = modalNewCard.querySelector(POPUP_FORM_SELECTOR);
const modalNewCardNameInput = modalNewCard.querySelector(
  '.popup__input_type_card-name',
);
const modalNewCardLinkInput = modalNewCard.querySelector(
  POPUP_INPUT_TYPE_URL_SELECTOR,
);

const modalImage = document.querySelector('.popup_type_image');
const modalImageImage = modalImage.querySelector('.popup__image');
const modalImageName = modalImage.querySelector('.popup__caption');

const profileData = {
  id: '',
  avatarLink: '',
  name: '',
  about: '',
};

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
  profileData.id = profileResponse._id;
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
  profileData.avatarLink = link;

  updateProfileAvatarContent();
}

function updateProfileAvatarContent() {
  profileImage.style.backgroundImage = `url(${profileData.avatarLink})`;
}

function updateProfileData(name, about) {
  profileData.name = name;
  profileData.about = about;

  updateProfileContent();
}

function updateProfileContent() {
  profileTitle.textContent = profileData.name;
  profileDescription.textContent = profileData.about;
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
    profileData.id,
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

function deleteCardCallback(evt) {
  const card = evt.target.closest(CARD_SELECTOR);

  deleteCardRequest(card.id)
    .then(() => {
      card.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}

function likeCardCallback(evt) {
  const cardLikeButton = evt.target;
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
  modalImageImage.src = src;
  modalImageImage.alt = alt;
  modalImageName.textContent = title;

  openModal(modalImage);
}

// #endregion cards

// #region init open modals

profileImage.addEventListener('click', () => {
  modalEditAvatarLinkInput.value = profileData.avatarLink;

  clearValidation(modalEditAvatarForm, validationConfig, true);
  openModal(modalEditAvatar);
});

profileEditButton.addEventListener('click', () => {
  modalEditProfileNameInput.value = profileData.name;
  modalEditProfileAboutInput.value = profileData.about;

  clearValidation(modalEditProfileForm, validationConfig, true);
  openModal(modalEditProfile);
});

profileAddButton.addEventListener('click', () => {
  modalNewCardForm.reset();
  clearValidation(modalNewCardForm, validationConfig, false);
  openModal(modalNewCard);
});

// #endregion init open modals

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

// #region forms submit

modalEditAvatarForm.addEventListener(
  'submit',
  handleEditProfileAvatarFormSubmit,
);
modalEditProfileForm.addEventListener('submit', handleEditProfileFormSubmit);
modalNewCardForm.addEventListener('submit', handleAddCardFormSubmit);

function handleEditProfileAvatarFormSubmit(evt) {
  function makeRequest() {
    return updateProfileAvatarRequest(modalEditAvatarLinkInput.value).then(
      (response) => {
        updateProfileAvatarData(response.avatar);
        closeModal(modalEditAvatar);
      },
    );
  }

  handleFormSubmit(makeRequest, evt);
}

function handleEditProfileFormSubmit(evt) {
  function makeRequest() {
    return updateProfileRequest(
      modalEditProfileNameInput.value,
      modalEditProfileAboutInput.value,
    ).then((response) => {
      updateProfileData(response.name, response.about);
      closeModal(modalEditProfile);
    });
  }

  handleFormSubmit(makeRequest, evt);
}

function handleAddCardFormSubmit(evt) {
  function makeRequest() {
    return addCardRequest(
      modalNewCardNameInput.value,
      modalNewCardLinkInput.value,
    ).then((response) => {
      closeModal(modalNewCard);
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

// #endregion forms submit
