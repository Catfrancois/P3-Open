const token = localStorage.getItem("token");
if (token != null) {
  const logInLink = document.getElementById("logInLink");
  logInLink.style.display = "none";
  const logOutLink = document.getElementById("logOutLink");
  logOutLink.style.display = "block";
}

/* 
TODO 
logOutLink
add event listener
supress local token
redirect to index

//

formdata pour modale
*/

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
  displayFilterButton(null, "Tous");

  //ajout boutons categories
  categories.forEach(function (category) {
    displayFilterButton(category.id, category.name);
  });
}

//add class to use css
function displayFilterButton(id, name) {
  const button = document.createElement("button");
  button.innerText = name;
  button.classList.add("filter-button");
  button.addEventListener("click", function (event) {
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

//refaire
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

document.addEventListener("DOMContentLoaded", function () {
  getCategories();
  getWorks();
});

// class galery into id, pas besoin de check l'array
