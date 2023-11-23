const POPUP_IS_OPENED_CLASS = 'popup_is-opened';

function openModal(modalElement, escapeKeyDownCallBack) {
  document.addEventListener('keydown', escapeKeyDownCallBack);
  modalElement.classList.add(POPUP_IS_OPENED_CLASS);
}

function closeModal(modalElement, escapeKeyDownCallBack) {
  document.removeEventListener('keydown', escapeKeyDownCallBack);
  modalElement.classList.remove(POPUP_IS_OPENED_CLASS);
}

export { POPUP_IS_OPENED_CLASS, openModal, closeModal };
