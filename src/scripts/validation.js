const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

function enableValidation(validationConfig) {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector),
  );

  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, validationConfig);
  });
}

function clearValidation(formElement, validationConfig, isButtonActive) {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector),
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
  });

  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector,
  );

  if (isButtonActive) {
    activateButton(buttonElement, validationConfig);
  } else {
    disableButton(buttonElement, validationConfig);
  }
}

function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector),
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector,
  );

  toggleButtonState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
}

function toggleButtonState(inputList, buttonElement, validationConfig) {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, validationConfig);
  } else {
    activateButton(buttonElement, validationConfig);
  }
}

function disableButton(buttonElement, validationConfig) {
  buttonElement.disabled = true;
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
}

function activateButton(buttonElement, validationConfig) {
  buttonElement.disabled = false;
  buttonElement.classList.remove(validationConfig.inactiveButtonClass);
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function checkInputValidity(formElement, inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig,
    );
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

function showInputError(
  formElement,
  inputElement,
  errorMessage,
  validationConfig,
) {
  inputElement.classList.add(validationConfig.inputErrorClass);
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
}

function hideInputError(formElement, inputElement, validationConfig) {
  inputElement.classList.remove(validationConfig.inputErrorClass);
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = '';
}

export { validationConfig, enableValidation, clearValidation };
