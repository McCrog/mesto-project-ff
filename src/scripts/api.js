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

export const getInitialProfileRequest = () => {
  return request(config.profileUrl(), {
    headers: config.headers,
  });
};

export const updateProfileAvatarRequest = (avatar) => {
  return request(`${config.profileUrl()}/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatar,
    }),
  });
};

export const updateProfileRequest = (name, about) => {
  return request(config.profileUrl(), {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about,
    }),
  });
};

export const getInitialCardsRequest = () => {
  return request(config.cardsUrl(), {
    headers: config.headers,
  });
};

export const addCardRequest = (name, link) => {
  return request(config.cardsUrl(), {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link,
    }),
  });
};

export const deleteCardRequest = (cardId) => {
  return request(`${config.cardsUrl()}/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  });
};

export const updateCardLikeRequest = (cardId, isLiked) => {
  return request(`${config.cardsLikeUrl()}/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: config.headers,
  });
};

function request(url, options) {
  return fetch(url, options).then(handleResponse);
}

function handleResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response.status);
  }
}

export function handleError(error) {
  console.error(`Ошибка: ${error}`);
}
