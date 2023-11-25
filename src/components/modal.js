const POPUP_IS_OPENED_CLASS = 'popup_is-opened';

function openModal(modalElement) {
  document.addEventListener('keydown', handleModalEscapeEvent);
  modalElement.classList.add(POPUP_IS_OPENED_CLASS);
}

function closeModal(modalElement) {
  document.removeEventListener('keydown', handleModalEscapeEvent);
  modalElement.classList.remove(POPUP_IS_OPENED_CLASS);
}

function handleModalEscapeEvent(evt) {
  if (evt.key === 'Escape') {
    const modalElement = document.querySelector(`.${POPUP_IS_OPENED_CLASS}`);
    closeModal(modalElement);
  }
}

export { POPUP_IS_OPENED_CLASS, openModal, closeModal };
