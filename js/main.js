var API_URL = "http://localhost:5678/api/";

// FETCH WORKDS
const works = getWorks();
console.log(works);

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
