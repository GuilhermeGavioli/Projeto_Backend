const BASE_URL_PATH =  'http://localhost:3000/'
const MAXSIZEPERMITED = 230000;


window.onload = async () => {
  const userData = await handleUserFetchTokenData('redirect');
  fitInformationOnInputs(userData);
}

// ATUALIZA A IMAGEM DO PERFIL OU NEGA O INPUT DE IMAGEM QUANDO INSERIDA NO FRONTEND *BACKEND TBM VALIDA*
const files = document.getElementById("files");
files.onchange = ((e) => { 
  if (e.target.files[0].size > MAXSIZEPERMITED) {
    e.target.value = "";
    showMessage("Tamanho da imagem não permitido. Sua requisição será negada", true);
    setTimeout(() => hideMessage(), 2500);
    return;
  }
  const obj = URL.createObjectURL(e.target.files[0])
  document.getElementById('circle-change-image-cover').setAttribute('src', obj)
})



//ATUALIZA O PERFIL
const salvarButton = document.getElementById("salvar-btn");
salvarButton.addEventListener("click", async (e) => {
  e.preventDefault();
  runSpinAnimation(e.target);

  const updatedUserObject = getAllInputedInfo();
  const formData = convertDataToForm(updatedUserObject);
  
  if (!getStoredToken()) return window.location.href = `${BASE_URL_PATH}pagehome`
 
 
 
  try {
    const data = await fireUpdateUserRequest(formData);
    
    stopSpinAnimation(e.target);

    if (!data) showMessage(data.message, true);
    if (!data.error) showMessage(data.message, false);
    if (data.error) showMessage(data.message, true);
  
    setTimeout(() => hideMessage(), 2500);
  
  } catch (err) { 
    stopSpinAnimation(e.target);
    showMessage("Erro. A imagem pode conter um tamanho maior que o permitido...", true);
    setTimeout(() => hideMessage(), 2500);
  }
})


async function fireUpdateUserRequest(formData) {
  const res = await fetch(`${BASE_URL_PATH}testimage`, {
      method: "POST",
      body: formData,
      headers: {},
  });
  return await res.json();
}


function convertDataToForm(data) {
  const form = new FormData();
  form.append("files", document.getElementById("files").files[0]);
  form.append("name", data.name);
  form.append("city", data.city);
  form.append("password", data.password);
  form.append("confirmPassword", data.confirmPasswordValue);
  form.append("gender", data.gender);
  form.append("birthDate", data.birthDate);
  form.append("aboutMe", data.aboutMe);
  form.append("bio", data.bio);
  form.append("token", getStoredToken());
  return form;
}




const deleteButton = document.getElementById("deletar-btn");
deleteButton.addEventListener("click", () => displayPainel())

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




// DELETE ACCOUNT
const confirmarDeleteAccountButton = document.getElementById("confirmar-btn");
confirmarDeleteAccountButton.addEventListener('click', (e) => deleteAccount(e.target))

function deleteAccount(buttonElement) {
  runSpinAnimation(buttonElement);
  const data = fireDeleteAccountRequest();

  if (!data) return showMessage(data.message, true);
  if (data.error) return showMessage(data.message, true);

  if (!data.error) {
    showMessage(data.message, false);
    alert('Usuario deletado com sucesso');
    logout();
  }

  stopSpinAnimation(buttonElement);
  setTimeout(() => hideMessage(), 2500)
}

async function fireDeleteAccountRequest() {
  const res = await fetch(`${BASE_URL_PATH}deleteuser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: getStoredToken(),
    }
  })
  const data = await res.json();
  return data;
}




function fitInformationOnInputs(data) {
  console.log('running', data)
  
  document.getElementById('ola-message').innerText += data.full_name.split(' ')[0];

  const profileCircleImage = document.getElementById("circle-change-image-cover");
  
  let src = `${BASE_URL_PATH}file_system/app/user_default.jpg`

  if (data.user_image) { 
    src = `${BASE_URL_PATH}file_system/user/${data.user_image}`
  }

  profileCircleImage.setAttribute('src', src);

  document.getElementById("profile-email-input").innerHTML = data.email;
  document.getElementById("profile-name-input").value = data.full_name;
  document.getElementById("profile-cidade-input").value = data?.addr_state;
  document.getElementById("profile-sobre-input").value = data.about_me;
  document.getElementById("profile-bio-input").value = data.bio;
  document.getElementById("profile-data-nascimento-input").value = data.birth_date.toString().substring(0, 10);
  document.getElementById("profile-genero-input").value = data.user_gender.toString();

  const socialOneInput = document.getElementById("profile-social-one-input");
  const socialTwoInput = document.getElementById("profile-social-two-input");
  const socialThreeInput = document.getElementById("profile-social-three-input");
}




function getAllInputedInfo() {
  const nameValue = document.getElementById("profile-name-input").value
  const cidadeValue = document.getElementById("profile-cidade-input").value
  const sobreValue = document.getElementById("profile-sobre-input").value
  const bioValue = document.getElementById("profile-bio-input").value
  const dataNascimentoValue = document.getElementById("profile-data-nascimento-input").value
  const generoValue = document.getElementById("profile-genero-input").value

  const socialOneValue = document.getElementById("profile-social-one-input").value
  const socialTwoValue = document.getElementById("profile-social-two-input").value
  const socialThreeValue = document.getElementById("profile-social-three-input").value

  const passwordValue = document.getElementById("profile-password-input").value
  const confirmPasswordValue = document.getElementById("profile-confirmar-password-input").value

  const updatedUserObject = {
    name: nameValue,
    city: cidadeValue,
    password: passwordValue,
    confirmPasswordValue: confirmPasswordValue,
    gender: Number(generoValue),
    birthDate: dataNascimentoValue,
    aboutMe: sobreValue,
    bio: bioValue,
  }

  return updatedUserObject;
}



//toggle icon bar

// window.addEventListener('click', (e) => {
//   if (e.target.getAttribute('onclickclose') != null) { 
//     profilePainel.style.visibility = "hidden";
//   }
// })




function getStoredToken() {
  return window.localStorage.getItem("token") || null;
}

function runSpinAnimation(button) {
  button.firstElementChild.style.visibility = "visible";
  button.lastElementChild.style.visibility = "hidden";
}

function stopSpinAnimation(button) {
  button.firstElementChild.style.visibility = "hidden";
  button.lastElementChild.style.visibility = "visible";
}

function toggleHeaderPainel(PainelElement) {
  PainelElement.style.visibility = PainelElement.style.visibility == "hidden" ? "visible" : "hidden";
}

function logout() {
  window.localStorage.removeItem('token')
  window.location.reload();
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
