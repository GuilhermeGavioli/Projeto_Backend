console.log("giF");

const salvarButton = document.getElementById("salvar-btn");
salvarButton.addEventListener("click", (e) => {
  runSpinAnimation(e.target);

  setTimeout(() => {
    stopSpinAnimation(e.target);
    showMessage("Perfil atualizado com sucesso", false);
  }, 1750);

  setTimeout(() => {
    hideMessage();
  }, 3500);
});

function runSpinAnimation(button) {
  console.log(button);
  button.firstElementChild.style.visibility = "visible";
  button.lastElementChild.style.visibility = "hidden";
}

function stopSpinAnimation(button) {
  button.firstElementChild.style.visibility = "hidden";
  button.lastElementChild.style.visibility = "visible";
}

function showMessage(message, error) {
  if (error) {
    const failMessage = document.querySelector(".fail-message-container");
    failMessage.innerHTML = message;
    failMessage.style.top = "50px";
    return;
  }
  const successMessage = document.querySelector(".success-message-container");
  successMessage.innerHTML = message;
  successMessage.style.top = "50px";
}

function hideMessage() {
  document.querySelector(".fail-message-container").style.top = "-150px";
  document.querySelector(".success-message-container").style.top = "-150px";
}

const deleteButton = document.getElementById("deletar-btn");
deleteButton.addEventListener("click", (e) => {
  displayPainel();
});

function displayPainel() {
  const janelConfirmacao = document.querySelector(".janela-confirmacao");
  janelConfirmacao.style.visibility = "visible";
  janelConfirmacao.style.opacity = "100%";
}

function closePainel() {
  const janelConfirmacao = document.querySelector(".janela-confirmacao");
  janelConfirmacao.style.visibility = "hidden";
  janelConfirmacao.style.opacity = "0%";
}

// document.querySelector(".container").addEventListener("click", () => {
//     closePainel();
// })

const confirmarButton = document.getElementById("confirmar-btn");
confirmarButton.addEventListener("click", (e) => {
  runSpinAnimation(e.target);

  setTimeout(() => {
    stopSpinAnimation(e.target);
    showMessage("Erro. Tente novamente.", true);
  }, 1750);

  setTimeout(() => {
    hideMessage();
  }, 3500);
});

window.onload = async () => {
  const spinning = document.getElementById("spinning");
  spinning.style.visibility = "visible";
  const main = document.querySelector(".container");
  main.style.visibility = "hidden";

  const token = getStoredToken();
  if (token) {
    const res = await fetch("http://localhost:3000/auth", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: token,
        required_info: "*",
      },
    });
    const data = await res.json();
    if (!data.auth) {
      return (window.location.href = "http://localhost:3000/pagelogin");
    }
    if (data.auth) {
      console.log(data);
      main.style.visibility = "visible";
      spinning.style.visibility = "hidden";
      fitInformationOnInputs(data.fullUser);
      return;
    }
  }
  window.location.href = "http://localhost:3000/pagelogin";
};

function getStoredToken() {
  // const cookieToken = document.cookie = "token=" + token
  const localToken = window.localStorage.getItem("token");
  return localToken;
}

async function fitInformationOnInputs(data) {
  const emailInput = document.getElementById("profile-email-input");
  emailInput.innerHTML = await data.email;

  const nameInput = document.getElementById("profile-name-input");
  nameInput.value = await data.full_name;

  const cidadeInput = document.getElementById("profile-cidade-input");
  cidadeInput.value = await data?.addr_state;

  const sobreInput = document.getElementById("profile-sobre-input");
  sobreInput.value = data.about_me;

  const bioInput = document.getElementById("profile-bio-input");
  bioInput.value = data.bio;

  const dataNascimentoInput = document.getElementById(
    "profile-data-nascimento-input"
  );
  dataNascimentoInput.value = data.birth_date.toString().substring(0, 10);

  const generoInput = document.getElementById("profile-genero-input");
  generoInput.value = data.user_gender.toString();

  const socialOneInput = document.getElementById("profile-social-one-input");
  const socialTwoInput = document.getElementById("profile-social-two-input");
  const socialThreeInput = document.getElementById(
    "profile-social-three-input"
  );
  const passwordInput = document.getElementById("profile-password-input");
}
