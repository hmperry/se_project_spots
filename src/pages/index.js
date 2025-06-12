import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";

import "./index.css";

import Api from "../utils/api.js";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },

//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },

//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },

//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },

//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },

//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },

//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

//Instantiate Api class

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3865b531-c637-4f08-82ee-36af95a41c77",
    "Content-Type": "application/json",
  },
});

//SELECTING ELEMENTS

//Profile Elements
const profileImage = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__title");
const editFormElement = document.forms["profile-form"];
const profileEditButton = document.querySelector(".profile__edit-button");

//Avatar Elements
const changeProfPic = document.querySelector(".image__container");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.querySelector("#avatar-form");
const avatarModalSubmit = avatarModal.querySelector(".modal__submit-button");
const avatarPicLink = document.querySelector("#avatar-link-input");

//Profile Edit Modal Elements
const editModal = document.querySelector("#edit-profile-modal");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const profileEditSubmitButton = editModal.querySelector(
  ".modal__submit-button"
);

//New Post Elements
const cardModalButton = document.querySelector(".profile__new-post-button");
const cardModal = document.querySelector("#add-card-modal");
const cardModalImageLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalCaptionInput = cardModal.querySelector("#add-card-name-input");
const cardModalFormElement = document.forms["add-card-form"];
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");

//Card Gallery Elements
const cardsList = document.querySelector("#cards_list");
const cardTemplate = document.querySelector("#card-template");
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

//Delete Modal Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteButton = deleteModal.querySelector(".modal__delete-button");
const cancelButton = document.querySelector(".modal__cancel-button");
let selectedCard;
let selectedCardId;

//Global Elements
const closeButtons = document.querySelectorAll(".modal__close-button");
const modals = document.querySelectorAll(".modal");

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileImage.src = user.avatar;
    console.log(user);

    profileDescription.textContent = user.about;
    profileName.textContent = user.name;
  })
  .catch((err) => {
    console.error(err);
  });

//EVENT LISTENERS
editFormElement.addEventListener("submit", handleProfileFormSubmit);
deleteButton.addEventListener("click", handleDeleteSubmit);
cancelButton.addEventListener("click", () => closeModal(deleteModal));
cardModalFormElement.addEventListener("submit", handleNewPostFormSubmit);
changeProfPic.addEventListener("click", () => {
  openModal(avatarModal);
});
cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
avatarModalSubmit.addEventListener("click", handleAvatarSubmit);
profileEditButton.addEventListener(
  "click",
  handleProfileEdit

  // () => {
  // editModalNameInput.value = profileName.textContent;
  // editModalDescriptionInput.value = profileDescription.textContent;
  // resetValidation(
  //   editFormElement,
  //   [editModalNameInput, editModalDescriptionInput],
  //   settings
  // );
  // openModal(editModal);}
);

//EVENT HANDLERS

//Global Functionality
const handleClickOutside = (evt) => {
  modals.forEach((modal) => {
    if (evt.target === modal && modal.classList.contains("modal_opened")) {
      closeModal(modal);
    }
  });
};

const handleEscapeModal = (evt) => {
  modals.forEach((modal) => {
    if (evt.key === "Escape") {
      modals.forEach(closeModal);
    }
  });
};

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscapeModal);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("keydown", handleEscapeModal);
}

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

//Cards and Card Gallery
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardName = cardElement.querySelector(".card__title");
  cardName.textContent = data.name;

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = data.link;
  cardImage.alt = data.name;

  const cardLike = cardElement.querySelector(".card__like-button");
  if (data.isLiked === true) {
    cardLike.classList.add("card__like-button_liked");
  }
  cardLike.addEventListener("click", (evt) => handleLikeCard(evt, data));

  const cardDelete = cardElement.querySelector(".card__delete-button");
  cardDelete.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data)
  );

  cardImage.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}
function handleDeleteSubmit() {
  // evt.preventDefault();
  deleteButton.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      deleteButton.textContent = "Delete";
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(() => {
      deleteButton.textContent = "Delete failed. Try again.";
      console.error();
      setTimeout(() => {
        deleteButton.textContent = "Delete";
      }, 2000);
    });
}
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleLikeCard(evt, data) {
  console.log(data);
  selectedCardId = data._id;
  const isLiked = evt.target.classList.contains("card__like-button_liked")
    ? true
    : false;

  api
    .changeLike(data._id, isLiked)
    .then(() => {
      if (isLiked === true) {
        evt.target.classList.remove("card__like-button_liked");
      } else {
        evt.target.classList.add("card__like-button_liked");
      }
    })
    .catch(console.error);
}

//Create New Post
function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  cardSubmitButton.textContent = "Saving...";

  const inputValues = {
    name: cardModalCaptionInput.value,
    link: cardModalImageLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);

  api
    .addNewCard(inputValues)
    .then((data) => {
      cardSubmitButton.textContent = "Save";
      data.name = cardModalCaptionInput.value;
      data.link = cardModalImageLinkInput.value;
      closeModal(cardModal);
      evt.target.reset();
      cardsList.prepend(cardElement);
    })
    .catch(() => {
      cardSubmitButton.textContent = "Save failed. Try again.";
      console.error();
      setTimeout(() => {
        cardSubmitButton.textContent = "Save";
      }, 2000);
    });

  //

  //
  // // disableButton(cardSubmitButton, settings);
  //
}
//Update Profile Photo
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  avatarModalSubmit.textContent = "Saving...";

  const inputValues = {
    avatar: avatarPicLink.value,
  };
  // const cardElement = getCardElement(inputValues);

  api
    .changeProfilePicture(inputValues)
    .then((data) => {
      avatarModalSubmit.textContent = "Save";
      data.avatar = avatarPicLink.value;
      closeModal(avatarModal);
      avatarForm.reset();
      profileImage.src = data.avatar;
    })
    .catch(() => {
      avatarModalSubmit.textContent = "Save failed. Try again.";
      console.error();
      setTimeout(() => {
        avatarModalSubmit.textContent = "Save";
      }, 2000);
    });
}

//Edit Profile Information
function handleProfileEdit() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
}

//Update Profile Name and Description
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileEditSubmitButton.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileEditSubmitButton.textContent = "Save";
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(() => {
      profileEditSubmitButton.textContent = "Save failed. Try again.";
      console.error();
      setTimeout(() => {
        deleteButton.textContent = "Save";
      }, 2000);
    });
}

enableValidation(settings);
