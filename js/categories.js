const response = await fetch("http://localhost:5678/api/categories");
categories = await response.json();
const categoriesJSON = JSON.stringify(categories);
window.localStorage.setItem("categories", categoriesJSON);
