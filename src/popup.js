const POPUP_IS_OPENED_CLASS = 'popup_is-opened';

const popup = (function () {
  let _popupElement;

  function handlePopupClose() {
    const popupClose = _popupElement.querySelector('.popup__close');
    popupClose.removeEventListener('click', handlePopupClose);
    document.removeEventListener('click', handleOverlayClick);
    document.removeEventListener('keydown', handleEscapeKeyDown);
    _popupElement.classList.remove(POPUP_IS_OPENED_CLASS);
  }

  function handleEscapeKeyDown(evt) {
    if (evt.key === 'Escape') {
      handlePopupClose();
    }
  }

  function handleOverlayClick(evt) {
    if (evt.target.classList.contains(POPUP_IS_OPENED_CLASS)) {
      handlePopupClose();
    }
  }

  return {
    show: function (popupElement) {
      _popupElement = popupElement;
      popupElement.classList.add(POPUP_IS_OPENED_CLASS);

      const popupClose = _popupElement.querySelector('.popup__close');
      popupClose.addEventListener('click', handlePopupClose);
      document.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleEscapeKeyDown);
    },
    showImage: function (popupElement, name, link, alt) {
      _popupElement = popupElement;
      const popupImage = _popupElement.querySelector('.popup__image');
      const popupImageName = _popupElement.querySelector('.popup__caption');

      popupImage.src = link;
      popupImage.alt = alt;
      popupImageName.textContent = name;

      this.show(_popupElement);
    },
    showEdit: function (popupElement, name, job, updateDataCallback) {
      _popupElement = popupElement;
      const formElement = _popupElement.querySelector('.popup__form');
      const nameInput = _popupElement.querySelector('.popup__input_type_name');
      const jobInput = _popupElement.querySelector(
        '.popup__input_type_description',
      );
      nameInput.value = name;
      jobInput.value = job;
      formElement.addEventListener('submit', handleFormSubmit);

      function handleFormSubmit(evt) {
        evt.preventDefault();
        updateDataCallback({ name: nameInput.value, job: jobInput.value });
        formElement.removeEventListener('submit', handleFormSubmit);
        handlePopupClose();
      }

      this.show(_popupElement);
    },
  };
})();

export { popup };
