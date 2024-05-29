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

  // request to remove work :
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      console.error("Erreur lors de la suppression");
    }
  });

  // Remove work from modalGlobalWorks
  modalGlobalWorks = modalGlobalWorks.filter((work) => work.id !== workId);
}

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

modalGetWorks();
