var API_URL = "http://localhost:5678/api/";

// FETCH WORKS
const works = getWorks();
console.log(works, "works");

async function getWorks() {
  const works = await fetch(API_URL + "works")
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
  return works;
}

getWorks()
  .then((works) => {
    works.forEach((work) => {
      document.querySelector(".gallery").innerHTML += `<div class="gallery">
                                                            <figure>
                                                              <img src="${work.imageUrl}" alt="${work.title}" />
                                                              <figcaption>${work.title}</figcaption>
                                                            </figure>
                                                          </div>`;
      console.log(work);
    });
  })
  .catch((error) => {
    console.error(error);
  });

/* FETCH CATEGORIES
const categories = getCategories();
console.log(categories, "categories");

async function getCategories() {
  const categories = await fetch(API_URL + "categories")
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
  return categories;
}
*/
