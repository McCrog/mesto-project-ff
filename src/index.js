import './pages/index.css';
import { showCards, addCard } from './components/card.js';
import { popup } from './components/popup.js';

import cardOneImage from './images/card_1.jpg';
import cardTwoImage from './images/card_2.jpg';
import cardThreeImage from './images/card_3.jpg';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');

showCards();

profileEditButton.addEventListener('click', () => {
  popup.showEdit(
    popupTypeEdit,
    profileTitle.textContent,
    profileDescription.textContent,
    (newData) => {
      profileTitle.textContent = newData.firstValue;
      profileDescription.textContent = newData.secondValue;
    },
  );
});

profileAddButton.addEventListener('click', () => {
  popup.showAdd(popupTypeNewCard, (newData) => {
    addCard({ name: newData.firstValue, link: newData.secondValue }, true);
  });
});
