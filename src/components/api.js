const config = {
  baseUrl: 'https://nomoreparties.co/v1/cohort-magistr-2',
  profileUrl: function () {
    return `${this.baseUrl}/users/me`;
  },
  cardsUrl: function () {
    return `${this.baseUrl}/cards`;
  },
  cardsLikeUrl: function () {
    return `${this.cardsUrl()}/likes`;
  },
  headers: {
    authorization: 'd027b334-5ba5-4a8a-8919-6f5910e128ac',
    'Content-Type': 'application/json',
  },
};

const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(`Ошибка: ${response.status}`);
  }
};

export const getInitialProfileRequest = () => {
  return fetch(config.profileUrl(), {
    headers: config.headers,
  }).then(handleResponse);
};

export const updateProfileAvatarRequest = (avatar) => {
  return fetch(`${config.profileUrl()}/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatar,
    }),
  }).then(handleResponse);
};

export const updateProfileRequest = (name, about) => {
  return fetch(config.profileUrl(), {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about,
    }),
  }).then(handleResponse);
};

export const getInitialCardsRequest = () => {
  return fetch(config.cardsUrl(), {
    headers: config.headers,
  }).then(handleResponse);
};

export const addCardRequest = (name, link) => {
  return fetch(config.cardsUrl(), {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link,
    }),
  }).then(handleResponse);
};

export const deleteCardRequest = (cardId) => {
  return fetch(`${config.cardsUrl()}/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(handleResponse);
};

export const addCardLikeRequest = (cardId) => {
  return fetch(`${config.cardsLikeUrl()}/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  }).then(handleResponse);
};

export const removeCardLikeRequest = (cardId) => {
  return fetch(`${config.cardsLikeUrl()}/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(handleResponse);
};
