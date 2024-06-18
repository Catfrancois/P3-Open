const form = document.getElementById("formLogIn");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let email = document.getElementById("email")?.value;
  let password = document.getElementById("password")?.value;

  console.log("email : ", email, "password : ", password);

  let request = {
    email: email,
    password: password,
  };

  console.log("request", request);

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erreur de connection");
      }
    })
    .then((data) => {
      let token = data.token;
      /*
      // pour utiliser les cookies à la place du localStorage ?? //
      document.cookie = `token=${token};path=/`;
       */
      localStorage.setItem("token", token);
      window.location.href = "index.html";
      /* 
      // Ajouter gestion de la page utilisateur connecté ?? //
      */
    })
    .catch((error) => {
      alert("Erreur: " + error.message);
    });
});

/*

email: sophie.bluel@test.tld

password: S0phieork

*/

//JWT json web expliqué le token
/* fetch("http://localhost:5678/api/works", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
}) */
