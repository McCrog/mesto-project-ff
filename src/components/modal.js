const POPUP_IS_OPENED_CLASS = 'popup_is-opened';

function openModal(modalElement) {
  document.addEventListener('keydown', handleModalEscapeKeyDown);
  modalElement.classList.add(POPUP_IS_OPENED_CLASS);
}

function closeModal(modalElement) {
  document.removeEventListener('keydown', handleModalEscapeKeyDown);
  modalElement.classList.remove(POPUP_IS_OPENED_CLASS);
}

function handleModalEscapeKeyDown(evt) {
  if (evt.key === 'Escape') {
    const modalElement = document.querySelector(`.${POPUP_IS_OPENED_CLASS}`);
    closeModal(modalElement);
  }
}

export { POPUP_IS_OPENED_CLASS, openModal, closeModal };
