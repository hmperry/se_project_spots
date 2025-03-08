const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },

  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },

  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },

  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },

  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },

  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const cardsList = document.querySelector("#cards_list");

const profileEditButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-profile-modal");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__title");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
// const editFormElement = editModal.querySelector(".modal__form");
const editFormElement = document.forms["profile-form"];

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, [
    editModalNameInput,
    editModalDescriptionInput,
  ]);
  openModal(editModal);
});

//How could I use a forEach loop to do this? I'm a little confused here.

const handleClickOutside = (evt) => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (evt.target === modal && modal.classList.contains("modal_opened")) {
      closeModal(modal);
    }
  });
};

const handleEscapeModal = (evt) => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (evt.key === "Escape" && modal.classList.contains("modal_opened")) {
      closeModal(modal);
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

const closeButtons = document.querySelectorAll(".modal__close-button");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

function profileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

// Connect the handler to the form, so it will watch for the submit event.
editFormElement.addEventListener("submit", profileFormSubmit);

//Rendering Cards
const cardTemplate = document.querySelector("#card-template");
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

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
  cardLike.addEventListener("click", () => {
    cardLike.classList.toggle("card__like-button_liked");
  });

  const cardDelete = cardElement.querySelector(".card__delete-button");
  cardDelete.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// const previewModalCloseButton = previewModal.querySelector(
//   ".modal__close-button_type_preview"
// );
// previewModalCloseButton.addEventListener("click", () => {
//   closeModal(previewModal);
// });

// for (let i = 0; i < initialCards.length; i++) {
//   const cardElement = getCardElement(initialCards[i]);
//   cards_list.prepend(cardElement);
// }

initialCards.forEach((item) => {
  // console.log(item);
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});

// New post modal

const cardModalButton = document.querySelector(".profile__new-post-button");
const cardModal = document.querySelector("#add-card-modal");
// const cardModalCloseButton = cardModal.querySelector(".modal__close-button");

const cardModalImageLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalCaptionInput = cardModal.querySelector("#add-card-name-input");
const cardModalFormElement = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

// cardModalCloseButton.addEventListener("click", () => {
//   closeModal(cardModal);
// });

//Save New Post

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardModalCaptionInput.value,
    link: cardModalImageLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
}

cardModalFormElement.addEventListener("submit", handleNewPostFormSubmit);
