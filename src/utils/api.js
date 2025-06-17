class Api {
  constructor({ baseUrl, headers, cardID }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    // this.about = about;
    // this.avatar = avatar;
    // this.name = name;
    // this._id = _id;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    // if the server returns an error, reject the promise
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  // getUserInfo() {
  //   return fetch(`${this._baseUrl}/users/me`, {
  //     method: "GET",
  //     headers: this._headers,
  //   }).then(this._checkResponse);
  // }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    });
  }

  // getInitialCards() {
  //   return fetch(`${this._baseUrl}/cards`, {
  //     method: "GET",
  //     headers: this._headers,
  //   }).then(this._checkResponse);
  // }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    });
  }

  // addNewCard({ name, link }) {
  //   return fetch(`${this._baseUrl}/cards`, {
  //     method: "POST",
  //     headers: { ...this._headers, "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       name,
  //       link,
  //     }),
  //   }).then(this._checkResponse);
  // }

  addNewCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: { ...this._headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  deleteCard(id) {
    return this._request(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: { ...this._headers, "Content-Type": "application/json" },
    });
  }

  // deleteCard(id) {
  //   return fetch(`${this._baseUrl}/cards/${id}`, {
  //     method: "DELETE",
  //     headers: { ...this._headers, "Content-Type": "application/json" },
  //   }).then(this._checkResponse);
  // }

  changeLike(id, isLiked) {
    return this._request(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: { ...this._headers, "Content-Type": "application/json" },
    });
  }

  // changeLike(id, isLiked) {
  //   return fetch(`${this._baseUrl}/cards/${id}/likes`, {
  //     method: isLiked ? "DELETE" : "PUT",
  //     headers: { ...this._headers, "Content-Type": "application/json" },
  //   }).then(this._checkResponse);
  // }

  editUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: { ...this._headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  // editUserInfo({ name, about }) {
  //   return fetch(`${this._baseUrl}/users/me`, {
  //     method: "PATCH",
  //     headers: { ...this._headers, "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       name,
  //       about,
  //     }),
  //   }).then(this._checkResponse);
  // }

  // changeProfilePicture({ avatar }) {
  //   return fetch(`${this._baseUrl}/users/me/avatar`, {
  //     method: "PATCH",
  //     headers: { ...this._headers, "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       avatar,
  //     }),
  //   }).then(this._checkResponse);
  // }

  changeProfilePicture({ avatar }) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: { ...this._headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        avatar,
      }),
    });
  }
}

export default Api;
