document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const logInLink = document.getElementById("login-link");
  const logOutLink = document.getElementById("logout-link");
  const loginModifierButton = document.getElementById("login-edit-button");
  const modeEditionContainer = document.getElementById(
    "mode-edition-container"
  );
  const filters = document.getElementById("filters");

  if (token != null) {
    logInLink.style.display = "none";
    logOutLink.style.display = "block";
    if (loginModifierButton && modeEditionContainer) {
      loginModifierButton.style.display = "block";
      modeEditionContainer.style.display = "flex";
    }
    if (filters) {
      filters.style.display = "none";
    }

    logOutLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      logInLink.style.display = "block";
      logOutLink.style.display = "none";
      if (loginModifierButton && modeEditionContainer) {
        loginModifierButton.style.display = "none";
        modeEditionContainer.style.display = "none";
      }
      if (filters) {
        filters.style.display = "flex";
      }
    });
  } else {
    logInLink.style.display = "block";
    logOutLink.style.display = "none";
    if (loginModifierButton && modeEditionContainer) {
      loginModifierButton.style.display = "none";
      modeEditionContainer.style.display = "none";
    }
    if (filters) {
      filters.style.display = "flex";
    }
  }

  getCategories();
  getWorks();
});

let globalWorks = [];
const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const worksData = await response.json();
  globalWorks = worksData;
  displayWorks(worksData);
}

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  //add button "tous"
  displayFilterButton(null, "Tous", true);

  //add other filter button
  categories.forEach(function (category) {
    displayFilterButton(category.id, category.name);
  });
}

function displayFilterButton(id, name, active = false) {
  const button = document.createElement("button");
  button.innerText = name;
  button.classList.add("filter-button");
  if (active) {
    button.classList.add("active");
  }
  button.addEventListener("click", function (event) {
    let buttons = document.getElementsByClassName("filter-button");

    Array.from(buttons).forEach((button) => button.classList.remove("active"));
    event.target.classList.add("active");
    filterWorks(id);
  });
  filters.appendChild(button);
}

function filterWorks(categoryId = null) {
  let filteredWorks = globalWorks.filter(function (workData) {
    if (categoryId === null) {
      return true;
    }
    return workData.categoryId == categoryId;
  });
  displayWorks(filteredWorks);
}

function displayWorks(worksData) {
  gallery.innerHTML = "";
  worksData.forEach((workData) => {
    const figure = document.createElement("figure");
    figure.setAttribute("data-category-id", workData.categoryId);
    figure.innerHTML = `
      <img src="${workData.imageUrl}" alt="${workData.title}" />
      <figcaption>${workData.title}</figcaption>
    `;
    gallery.appendChild(figure);
  });
}

let modal = null;

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.querySelectorAll(".close-cross").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
  modal.addEventListener("click", closeModalOnBackgroundClick);
};

const closeModalOnBackgroundClick = function (e) {
  if (e.target === modal) {
    closeModal(e);
  }
};

const closeModal = function (e) {
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.querySelectorAll(".close-cross").forEach((button) => {
    button.removeEventListener("click", closeModal);
  });
  modal.removeEventListener("click", closeModalOnBackgroundClick);
  showBaseView();
  modal = null;
};

const showAddPhotoView = function () {
  document.getElementById("modal-view-base").style.display = "none";
  document.getElementById("modal-view-add-photo").style.display = "flex";

  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      const select = document.getElementById("photo-category");
      select.innerHTML = "";

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });

      checkFormValidity();
    });
};

const showBaseView = function () {
  document.getElementById("modal-view-base").style.display = "flex";
  document.getElementById("modal-view-add-photo").style.display = "none";
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

document
  .getElementById("add-photo-button")
  .addEventListener("click", showAddPhotoView);
document.querySelector(".return-arrow").addEventListener("click", showBaseView);

let modalGlobalWorks = [];

async function modalGetWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const worksData = await response.json();
  modalGlobalWorks = worksData;
  displayModalWorks(worksData);
}

function displayModalWorks(works) {
  const container = document.getElementById("work-cards-container");
  container.innerHTML = "";
  works.forEach((work) => {
    const card = document.createElement("div");
    card.className = "work-card";

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const removeIcon = document.createElement("img");
    removeIcon.className = "remove-icon";
    removeIcon.src = "./assets/icons/bin.png";
    removeIcon.alt = "Remove";
    removeIcon.addEventListener("click", () => removeWorkCard(card, work.id));

    card.appendChild(img);
    card.appendChild(removeIcon);

    container.appendChild(card);
  });
}

function removeWorkCard(card, workId) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (response.ok) {
        globalWorks = globalWorks.filter((work) => work.id !== workId);
        displayWorks(globalWorks);
        modalGetWorks();
      } else {
        console.error("Erreur lors de la suppression");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression", error);
    });
}

function checkFormValidity() {
  const title = document.getElementById("photo-title").value;
  const fileInput = document.getElementById("photo-upload").files.length;
  const submitButton = document.querySelector(
    "#form-add-picture .modal-button"
  );

  if (title && fileInput > 0) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

document
  .getElementById("photo-title")
  .addEventListener("input", checkFormValidity);

document
  .getElementById("photo-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const errorMessage = document.getElementById("photo-error-message");
    errorMessage.textContent = "";
    if (file) {
      const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
      const allowedTypes = ["image/jpeg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        errorMessage.textContent =
          "Veuillez sélectionner un fichier jpg ou png.";
        event.target.value = "";
      } else if (file.size > maxSize) {
        errorMessage.textContent = "Le fichier doit être inférieur à 4 Mo.";
        event.target.value = "";
      } else {
        const reader = new FileReader();
        reader.onload = function (e) {
          const preview = document.getElementById("picture-preview");
          preview.src = e.target.result;
          preview.classList.add("preview");
          document.querySelector(".photo-upload").classList.add("hidden");
          document.querySelector(".photo-info").classList.add("hidden");
        };
        reader.readAsDataURL(file);
      }
    }
    checkFormValidity();
  });

document
  .getElementById("form-add-picture")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("photo-title").value;
    const category = document.getElementById("photo-category").value;
    const fileInput = document.getElementById("photo-upload").files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", fileInput);

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token non trouvé. Veuillez vous connecter.");
    }

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(
              data.message || "Erreur lors de l'ajout de la photo"
            );
          });
        }
      })
      .then((data) => {
        closeModal(event);
        addPhotoToGallery(data);
        addPhotoToModal(data);
        resetForm();
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  });

function addPhotoToGallery(photo) {
  globalWorks.push(photo);
  displayWorks(globalWorks);
}

function addPhotoToModal(photo) {
  const container = document.getElementById("work-cards-container");
  const newCard = document.createElement("div");
  newCard.className = "work-card";
  newCard.innerHTML = `
    <img src="${photo.imageUrl}" alt="${photo.id}" />
    <img class="remove-icon" src="./assets/icons/bin.png" alt="Remove" />
  `;
  newCard
    .querySelector(".remove-icon")
    .addEventListener("click", () => removeWorkCard(newCard, photo.id));
  container.appendChild(newCard);
}

function resetForm() {
  const form = document.getElementById("form-add-picture");
  form.reset();
  const preview = document.getElementById("picture-preview");
  preview.src = "./assets/icons/picture_icon.png";
  preview.classList.remove("preview");

  document.querySelector(".photo-upload").classList.remove("hidden");
  document.querySelector(".photo-info").classList.remove("hidden");

  document.querySelector("#form-add-picture .modal-button").disabled = true;
}

modalGetWorks();
