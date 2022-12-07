const BASE_URL_PATH =  'http://localhost:3000/'
const MAXSIZEPERMITED = 200000;


window.onload = async () => {
 
  const userData = await handleUserFetchTokenData('redirect');
  fitInformationOnInputs(userData);
  console.log(userData)

  const advanced = document.querySelector(".c2-advanced-info");
  const userInfo = document.querySelector(".c2-user-info");
  showUserInfo(advanced, userInfo)
  // headerLogoutButton.addEventListener('click', () => logout())
  // fitUserInfoInHeader(data.fullUser.user_image);



  // return data.fullUser;
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



isSalvarButtonClickable = true;
//ATUALIZA O PERFIL
const salvarButton = document.getElementById("salvar-btn");
salvarButton.addEventListener("click", async (e) => {
  if (!isSalvarButtonClickable) return
  isSalvarButtonClickable = false;
  e.preventDefault();
  console.log(e.target)
  runSpinAnimation(e.target);

  const updatedUserObject = getAllInputedInfo();
  const formData = convertDataToForm(updatedUserObject);
  
  if (!getStoredToken()) return window.location.href = `/`
 
 
 console.log('running')
  try {
    const data = await fireUpdateUserRequest(formData);
    
    stopSpinAnimation(e.target);

    if (!data) { 
      showMessage(data.message, true);
      isSalvarButtonClickable = true;
    }

    if (data.error) { 
      showMessage(data.message, true);
      isSalvarButtonClickable = true;
    }

    if (!data.error) { 
      showMessage(data.message, false);
      setTimeout(()=> window.location.reload() ,1300)
    }
    
    setTimeout(() => hideMessage(), 2500);
  
  } catch (err) { 
    stopSpinAnimation(e.target);
    showMessage("Erro. A imagem pode conter um tamanho maior que o permitido...", true);
    setTimeout(() => hideMessage(), 2500);
  }
})


async function fireUpdateUserRequest(formData) {
  const res = await fetch(`${BASE_URL_PATH}alterarUsuario`, {
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








isDeleteButtonClickable = true;
// DELETE ACCOUNT
const confirmarDeleteAccountButton = document.getElementById("deletar-btn");
console.log(confirmarDeleteAccountButton)
confirmarDeleteAccountButton.addEventListener('click', (e) => deleteAccount(e.target))

function deleteAccount(buttonElement) {
  if (!isDeleteButtonClickable) return
  runSpinAnimation(buttonElement);
  const data = fireDeleteAccountRequest();

  if (!data || data.error) { 
    isDeleteButtonClickable = true;
    showMessage(data?.message, true);
    return;
  }


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
  document.getElementById('ola-message').innerText += " " + data.full_name.split(' ')[0] + "!";
  const profileCircleImage = document.getElementById("circle-change-image-cover");
  let src = `${BASE_URL_PATH}file_system/app/user_default.jpg`
  if (data.user_image) { 
    src = `${BASE_URL_PATH}file_system/user/${data.user_image}`
  }
  profileCircleImage.setAttribute('src', src);
  document.getElementById("profile-email-input").value = data.email;
  document.getElementById("profile-name-input").value = data.full_name;
  document.getElementById("profile-cidade-input").value = data?.addr_state;
  document.getElementById("profile-sobre-input").value = data.about_me;
  document.getElementById("profile-bio-input").value = data.bio;
  document.getElementById("profile-data-nascimento-input").value = data.birth_date.toString().substring(0, 10);
  document.getElementById("profile-genero-input").value = data.user_gender.toString();

  document.getElementById('c1-main-name').innerText = data.full_name
  //phone number

  const month_number = Number(data.created_at.substring(5, 7))
  const month = convertNumberToMonth(month_number)
  document.getElementById('mes').innerHTML = month;
  document.getElementById('ano').innerHTML = data.created_at.substring(0,4);


}

// function convertNumberToMonth(month_number) {
//   const months = new Array("Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro");
//   return months[month_number - 1]
// }



function getAllInputedInfo() {
  const nameValue = document.getElementById("profile-name-input").value
  const cidadeValue = document.getElementById("profile-cidade-input").value
  const sobreValue = document.getElementById("profile-sobre-input").value
  const bioValue = document.getElementById("profile-bio-input").value
  const dataNascimentoValue = document.getElementById("profile-data-nascimento-input").value
  const generoValue = document.getElementById("profile-genero-input").value
  const phoneNumber = document.getElementById("profile-phone-input").value
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



//toggle profile advanced and userinfo
document.getElementById('avancado-text').addEventListener('click', () => toggleUserInfoAndAdvanced('advanced'))
document.getElementById('user-info-text').addEventListener('click', () => toggleUserInfoAndAdvanced('info'))

let state = 'user-info'
function toggleUserInfoAndAdvanced(type) {
  const advanced = document.querySelector(".c2-advanced-info");
  const userInfo = document.querySelector(".c2-user-info");

  const advancedCategory = document.getElementById('category-advanced');
  const userInfoCategory = document.getElementById('category-user-info');

  resetCategory(advancedCategory, userInfoCategory);
  if (type == 'advanced') {
    showAdvanced(advanced, userInfo);
    lightAdvanced(advancedCategory);
  } else if (type == 'info') { 
    showUserInfo(advanced, userInfo);
    lightInfo(userInfoCategory);
  }
}

function lightAdvanced(advanced) {
  advanced.style.borderBottom = '3px solid rgb(126, 176, 28)';
  advanced.style.color = 'rgb(120,120,120)';
}
function lightInfo(userInfo) {
  userInfo.style.borderBottom = '3px solid rgb(126, 176, 28)';
  userInfo.style.color = 'rgb(120,120,120)';
}

function resetCategory(advanced, userInfo) {
  userInfo.style.borderBottom = 'unset';
  userInfo.style.fontWeight = 'unset';
  userInfo.style.color = 'rgb(175, 175, 175)';
  advanced.style.borderBottom = 'unset';
  advanced.style.fontWeight = 'unset';
  advanced.style.color = 'rgb(175, 175, 175)';
}




function showUserInfo(advanced, userInfo){
  advanced.style.visibility = 'hidden';
  advanced.style.position = 'absolute';
  userInfo.style.visibility = 'visible';
  userInfo.style.position = 'unset';
}

function showAdvanced(advanced, userInfo){
  advanced.style.visibility = 'visible';
  advanced.style.position = 'unset';
  userInfo.style.visibility = 'hidden';
  userInfo.style.position = 'absolute';
}