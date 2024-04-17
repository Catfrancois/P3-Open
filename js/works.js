export function getWorks() {
  const works = document.querySelectorAll(".gallery");

  works.forEach(async function (work) {
    const response = await fetch("http://localhost:5678/api/works");
    const worksData = await response.json();

    worksData.forEach((workData) => {
      work.innerHTML += `
                <figure>
                  <img src="${workData.imageUrl}" alt="${workData.title}" />
                  <figcaption>${workData.title}</figcaption>
                </figure>
              `;
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getWorks();
});
