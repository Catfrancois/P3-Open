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
