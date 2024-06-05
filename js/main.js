document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const logInLink = document.getElementById("logInLink");
  const logOutLink = document.getElementById("logOutLink");
  const loginModifierButton = document.getElementById("loginModifierButton");

  if (token != null) {
    logInLink.style.display = "none";
    logOutLink.style.display = "block";
    if (loginModifierButton) {
      loginModifierButton.style.display = "block";
    }

    logOutLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      logInLink.style.display = "block";
      logOutLink.style.display = "none";
      if (loginModifierButton) {
        loginModifierButton.style.display = "none";
      }
    });
  } else {
    logInLink.style.display = "block";
    logOutLink.style.display = "none";
    if (loginModifierButton) {
      loginModifierButton.style.display = "none";
    }
  }

  getCategories();
  getWorks();
});

var globalWorks = [];
const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");

//fetch Works into .json
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const worksData = await response.json();
  globalWorks = worksData;
  displayWorks(worksData);
}

//fetch categories into .json
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  categories = await response.json();

  //ajout bouton "tous"
  displayFilterButton(null, "Tous", true);

  //ajout boutons categories
  categories.forEach(function (category) {
    displayFilterButton(category.id, category.name);
  });
}

//add class to use css
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
    return workData.categoryId === categoryId;
  });
  displayWorks(filteredWorks);
}

//method 2
function displayWorks(worksData) {
  gallery.innerHTML = "";
  worksData.forEach((workData) => {
    gallery.innerHTML += `
              <figure>
                  <img src="${workData.imageUrl}" alt="${workData.title}" />
                  <figcaption>${workData.title}</figcaption>
              </figure>
              `;
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
  modal.querySelectorAll(".closeCross").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
};

const closeModal = function (e) {
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.querySelectorAll(".closeCross").forEach((button) => {
    button.removeEventListener("click", closeModal);
  });
  showBaseView();
  modal = null;
};

const showAddPhotoView = function () {
  document.getElementById("modal-view-base").style.display = "none";
  document.getElementById("modal-view-add-photo").style.display = "flex";
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
document.querySelector(".returnArrow").addEventListener("click", showBaseView);

var modalGlobalWorks = [];

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
  // Remove card from the DOM
  card.remove();

  const token = localStorage.getItem("token");
  // request to remove work :
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      console.log("test");
    })
    .error((error) => {
      console.log("Erreur lors de la suppression");
    });

  // Remove work from modalGlobalWorks
  modalGlobalWorks = modalGlobalWorks.filter((work) => work.id !== workId);
  globalWorks = globalWorks.filter((work) => work.id !== workId);
  displayWorks(globalWorks);
}

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

document
  .getElementById("photo-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
      const allowedTypes = ["image/jpeg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        alert("Veuillez sélectionner un fichier jpg ou png.");
        event.target.value = "";
      } else if (file.size > maxSize) {
        alert("Le fichier doit être inférieur à 4 Mo.");
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
  });

modalGetWorks();
