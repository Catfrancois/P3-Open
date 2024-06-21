const form = document.getElementById("login-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let email = document.getElementById("email")?.value;
  let password = document.getElementById("password")?.value;

  let request = {
    email: email,
    password: password,
  };

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
        return response.json().then((data) => {
          throw new Error(data.message || "Erreur de connexion");
        });
      }
    })
    .then((data) => {
      let token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "index.html";
    })
    .catch(() => {
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent =
        "Le nom d'utilisateur ou le mot de passe est incorrect";
    });
});
