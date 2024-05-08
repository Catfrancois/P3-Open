const form = document.getElementById("formLogIn");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let email = document.getElementById("email")?.value;
  let password = document.getElementById("password")?.value;
  console.log(email, password);
});

/*
TO DO
FETCH : envoyer email + password et écouter réponse (promise)
.then (stocker le token, renvoyer sur l'index) || .error (alert:) ou texte en rouge
*/
