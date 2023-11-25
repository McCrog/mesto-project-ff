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

modalTypeEdit.addEventListener('click', handleModalOverlayClick);
modalTypeNewCard.addEventListener('click', handleModalOverlayClick);
modalTypeImage.addEventListener('click', handleModalOverlayClick);

modalTypeEditClose.addEventListener('click', () => {
  closeModal(modalTypeEdit);
});
modalTypeNewCardClose.addEventListener('click', () => {
  closeModal(modalTypeNewCard);
});
modalTypeImageClose.addEventListener('click', () => {
  closeModal(modalTypeImage);
});

function showImageModal(title, src, alt) {
  modalTypeImageImage.src = src;
  modalTypeImageImage.alt = alt;
  modalTypeImageName.textContent = title;

  openModal(modalTypeImage);
}

profileEditButton.addEventListener('click', () => {
  modalTypeEditNameInput.value = profileTitle.textContent;
  modalTypeEditJobInput.value = profileDescription.textContent;

  openModal(modalTypeEdit);
});

profileAddButton.addEventListener('click', () => {
  openModal(modalTypeNewCard);
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

    closeModal(modalElement);
  }
}

function handleModalOverlayClick(evt) {
  if (evt.target.classList.contains(POPUP_IS_OPENED_CLASS)) {
    closeModal(evt.target);
  }
}
