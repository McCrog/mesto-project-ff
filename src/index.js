import './pages/index.css';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import {
  POPUP_IS_OPENED_CLASS,
  openModal,
  closeModal,
} from './components/modal.js';

const POPUP_CLOSE_SELECTOR = '.popup__close';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const modalTypeEdit = document.querySelector('.popup_type_edit');
const modalTypeEditNameInput = modalTypeEdit.querySelector(
  '.popup__input_type_name',
);
const modalTypeEditJobInput = modalTypeEdit.querySelector(
  '.popup__input_type_description',
);

const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeNewCardNameInput = modalTypeNewCard.querySelector(
  '.popup__input_type_card-name',
);
const modalTypeNewCardLinkInput = modalTypeNewCard.querySelector(
  '.popup__input_type_url',
);

const modalTypeImage = document.querySelector('.popup_type_image');
const modalTypeImageImage = modalTypeImage.querySelector('.popup__image');
const modalTypeImageName = modalTypeImage.querySelector('.popup__caption');

showCards();

function showCards() {
  initialCards.forEach((cardItem) => {
    addCard(cardItem, false);
  });
}

function addCard(cardItem, isPrepend) {
  if (isPrepend) {
    placesList.prepend(
      createCard(cardItem, deleteCard, likeCard, showImageModal),
    );
  } else {
    placesList.append(
      createCard(cardItem, deleteCard, likeCard, showImageModal),
    );
  }
}

function showImageModal(title, src, alt) {
  modalTypeImageImage.src = src;
  modalTypeImageImage.alt = alt;
  modalTypeImageName.textContent = title;

  openModal(modalTypeImage);
}

[modalTypeEdit, modalTypeNewCard, modalTypeImage].forEach((modal) => {
  modal.addEventListener('click', handleModalOverlayClick);

  const modalButtonClose = modal.querySelector(POPUP_CLOSE_SELECTOR);
  modalButtonClose.addEventListener('click', () => {
    closeModal(modal);
  });
});

function handleModalOverlayClick(evt) {
  if (evt.target.classList.contains(POPUP_IS_OPENED_CLASS)) {
    closeModal(evt.target);
  }
}

profileEditButton.addEventListener('click', () => {
  modalTypeEditNameInput.value = profileTitle.textContent;
  modalTypeEditJobInput.value = profileDescription.textContent;

  openModal(modalTypeEdit);
});

profileAddButton.addEventListener('click', () => {
  openModal(modalTypeNewCard);
});

setupModalSubmitForm(modalTypeEdit, () => {
  profileTitle.textContent = modalTypeEditNameInput.value;
  profileDescription.textContent = modalTypeEditJobInput.value;
});

setupModalSubmitForm(modalTypeNewCard, () => {
  addCard(
    {
      name: modalTypeNewCardNameInput.value,
      link: modalTypeNewCardLinkInput.value,
    },
    true,
  );
});

function setupModalSubmitForm(modalElement, isFormSubmitedCallback) {
  const formElement = modalElement.querySelector('.popup__form');
  formElement.addEventListener('submit', handleFormSubmit);

  function handleFormSubmit(evt) {
    evt.preventDefault();

    isFormSubmitedCallback();

    formElement.reset();

    closeModal(modalElement);
  }
}
