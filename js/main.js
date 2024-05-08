/* function userLogInInput() {
  const form = document.getElementById("formLogIn");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let email = document.getElementById("email")?.value;
    let password = document.getElementById("password")?.value;
    return email, password;
  });
}

async function getUserLogInfo() {
  const userInfo = await fetch("http://localhost:5678/api/users/login");
  if (
    userLogInInput(email) === userInfo?.email &&
    userLogInInput(password) === userInfo?.password
  ) {
    return true;
  } else {
    return false;
  }
}
 */
