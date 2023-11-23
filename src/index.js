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
const modalTypeEditClose = modalTypeEdit.querySelector(POPUP_CLOSE_SELECTOR);

const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeNewCardNameInput = modalTypeNewCard.querySelector(
  '.popup__input_type_card-name',
);
const modalTypeNewCardLinkInput = modalTypeNewCard.querySelector(
  '.popup__input_type_url',
);
const modalTypeNewCardClose =
  modalTypeNewCard.querySelector(POPUP_CLOSE_SELECTOR);

const modalTypeImage = document.querySelector('.popup_type_image');
const modalTypeImageImage = modalTypeImage.querySelector('.popup__image');
const modalTypeImageName = modalTypeImage.querySelector('.popup__caption');
const modalTypeImageClose = modalTypeImage.querySelector(POPUP_CLOSE_SELECTOR);

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

modalTypeEdit.addEventListener('click', (evt) => {
  handleModalOverlayClick(evt, modalTypeEdit);
});
modalTypeNewCard.addEventListener('click', (evt) => {
  handleModalOverlayClick(evt, modalTypeNewCard);
});
modalTypeImage.addEventListener('click', (evt) => {
  handleModalOverlayClick(evt, modalTypeImage);
});

modalTypeEditClose.addEventListener('click', () => {
  closeModal(modalTypeEdit, handleModalEscapeKeyDown);
});
modalTypeNewCardClose.addEventListener('click', () => {
  closeModal(modalTypeNewCard, handleModalEscapeKeyDown);
});
modalTypeImageClose.addEventListener('click', () => {
  closeModal(modalTypeImage, handleModalEscapeKeyDown);
});

function showImageModal(title, src, alt) {
  modalTypeImageImage.src = src;
  modalTypeImageImage.alt = alt;
  modalTypeImageName.textContent = title;

  openModal(modalTypeImage, handleModalEscapeKeyDown);
}

profileEditButton.addEventListener('click', () => {
  modalTypeEditNameInput.value = profileTitle.textContent;
  modalTypeEditJobInput.value = profileDescription.textContent;

  openModal(modalTypeEdit, handleModalEscapeKeyDown);
});

profileAddButton.addEventListener('click', () => {
  openModal(modalTypeNewCard, handleModalEscapeKeyDown);
});

setupModalSubmitForm(
  modalTypeEdit,
  modalTypeEditNameInput,
  modalTypeEditJobInput,
  (newData) => {
    profileTitle.textContent = newData.firstValue;
    profileDescription.textContent = newData.secondValue;
  },
);

setupModalSubmitForm(
  modalTypeNewCard,
  modalTypeNewCardNameInput,
  modalTypeNewCardLinkInput,
  (newData) => {
    addCard({ name: newData.firstValue, link: newData.secondValue }, true);
  },
);

function setupModalSubmitForm(
  modalElement,
  firstInput,
  secondInput,
  updateDataCallback,
) {
  const formElement = modalElement.querySelector('.popup__form');
  formElement.addEventListener('submit', handleFormSubmit);

  function handleFormSubmit(evt) {
    evt.preventDefault();

    updateDataCallback({
      firstValue: firstInput.value,
      secondValue: secondInput.value,
    });

    formElement.reset();

    closeModal(modalElement, handleModalEscapeKeyDown);
  }
}

function handleModalEscapeKeyDown(evt) {
  if (evt.key === 'Escape') {
    const modalElement = document.querySelector(`.${POPUP_IS_OPENED_CLASS}`);
    closeModal(modalElement, handleModalEscapeKeyDown);
  }
}

function handleModalOverlayClick(evt, modalElement) {
  if (evt.target.classList.contains(POPUP_IS_OPENED_CLASS)) {
    closeModal(modalElement, handleModalEscapeKeyDown);
  }
}
