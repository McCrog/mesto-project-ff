// #region imports

import './pages/index.css';
import {
  CARD_LIKE_BUTTON_ACTIVE_CLASS,
  createCard,
  updateLikeButton,
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
  getInitialProfileRequest,
  updateProfileRequest,
  updateProfileAvatarRequest,
  getInitialCardsRequest,
  addCardRequest,
  deleteCardRequest,
  updateCardLikeRequest,
  handleError,
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

const modalDeleteCard = document.querySelector('.popup_type_delete-card');
const modalDeleteCardForm = modalDeleteCard.querySelector(POPUP_FORM_SELECTOR);

const modalImage = document.querySelector('.popup_type_image');
const modalImageImage = modalImage.querySelector('.popup__image');
const modalImageName = modalImage.querySelector('.popup__caption');

const profileData = {
  id: '',
  avatarLink: '',
  name: '',
  about: '',
};

const cardToDelete = {
  id: null,
  element: null,
};

// #endregion variables

// #region init data

Promise.all([getInitialProfileRequest(), getInitialCardsRequest()])
  .then(([profileResponse, cardsResponse]) => {
    init(profileResponse, cardsResponse);
  })
  .catch(handleError);

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

function deleteCardCallback(cardId, cardElement) {
  cardToDelete.id = cardId;
  cardToDelete.element = cardElement;

  openModal(modalDeleteCard);
}

function likeCardCallback(cardId, likeButton, likesCountElement) {
  const isLiked = likeButton.classList.contains(CARD_LIKE_BUTTON_ACTIVE_CLASS);

  updateCardLikeRequest(cardId, isLiked)
    .then((response) => {
      updateLikeButton(likeButton, likesCountElement, response.likes.length);
    })
    .catch(handleError);
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
modalDeleteCardForm.addEventListener('submit', handleDeleteCardFormSubmit);

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

function handleDeleteCardFormSubmit(evt) {
  function makeRequest() {
    return deleteCardRequest(cardToDelete.id)
      .then(() => {
        cardToDelete.element.remove();
        cardToDelete.id = null;
        cardToDelete.element = null;

        closeModal(modalDeleteCard);
      })
      .catch(handleError);
  }

  handleFormSubmit(makeRequest, evt, 'Удаление...');
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
    .catch(handleError)
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
