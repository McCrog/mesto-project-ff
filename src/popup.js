const POPUP_IS_OPENED_CLASS = 'popup_is-opened';

const popup = (function () {
  return {
    show: function (popupElement) {
      popupElement.classList.add(POPUP_IS_OPENED_CLASS);

      const popupClose = popupElement.querySelector('.popup__close');
      popupClose.addEventListener('click', handlePopupCloseClick);
      document.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleEscapeKeyDown);

      function handlePopupCloseClick() {
        popupClose.removeEventListener('click', handlePopupCloseClick);
        document.removeEventListener('click', handleOverlayClick);
        document.removeEventListener('keydown', handleEscapeKeyDown);
        popupElement.classList.remove(POPUP_IS_OPENED_CLASS);
      }

      function handleEscapeKeyDown(evt) {
        if (evt.key === 'Escape') {
          handlePopupCloseClick();
        }
      }

      function handleOverlayClick(evt) {
        if (evt.target.classList.contains(POPUP_IS_OPENED_CLASS)) {
          handlePopupCloseClick();
        }
      }
    },
    showImage: function (popupElement, name, link, alt) {
      const popupImage = popupElement.querySelector('.popup__image');
      const popupImageName = popupElement.querySelector('.popup__caption');

      popupImage.src = link;
      popupImage.alt = alt;
      popupImageName.textContent = name;

      this.show(popupElement);
    },
  };
})();

export { popup };
