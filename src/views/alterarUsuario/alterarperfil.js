console.log("giF");
const MAXSIZEPERMITED = 230000;

const files = document.getElementById("files");
files.onchange = ((e) => { 
  console.log(e.target.files[0].size)
   if (e.target.files[0].size > MAXSIZEPERMITED) {
     e.target.value = "";
     showMessage("Tamanho da imagem não permitido. Sua requisição será negada", true);

     setTimeout(() => {
       hideMessage();
     }, 2500);


     return;
  }
  const obj = URL.createObjectURL(e.target.files[0])
  document.getElementById('circle-change-image-cover').setAttribute('src', obj)
})



const salvarButton = document.getElementById("salvar-btn");
salvarButton.addEventListener("click", async (e) => {
  e.preventDefault();
  runSpinAnimation(e.target);

  const token = getStoredToken();
  const updatedUserObject = getAllInputedInfo();

  const formData = new FormData();
  formData.append("name", updatedUserObject.name);
  formData.append("city", updatedUserObject.city);
  formData.append("password", updatedUserObject.password);
  formData.append("confirmPassword", updatedUserObject.confirmPasswordValue);
  formData.append("gender", updatedUserObject.gender);
  formData.append("birthDate", updatedUserObject.birthDate);
  formData.append("aboutMe", updatedUserObject.aboutMe);
  formData.append("bio", updatedUserObject.bio);
  formData.append("token", token);

  if (files.files) { 
    for(let i =0; i < files.files.length; i++) {
      formData.append("files", files.files[i]);
    }
  }
 
  try {
    const res = await fetch("http://localhost:3000/testimage", {
      method: "POST",
      body: formData,
      headers: {},
    });
    const data = await res.json();
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
confirmarButton.addEventListener("click", async (e) => {
  runSpinAnimation(e.target);

 

  const token = getStoredToken();

  console.log(token)
  // try {
    console.log('here')
    
    const res = await fetch('http://localhost:3000/deleteuser', {
      method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    }
    })
    const data = await res.json()
    console.log(data);
  if (!data) showMessage(data.message, true);

  if (!data.error) {
    showMessage(data.message, false);
    alert('Usuario deletado com sucesso');
    
    window.localStorage.removeItem('token')
    window.location.reload();
  }
  
  if (data.error) { 
    showMessage(data.message, true);
  }
  
  stopSpinAnimation(e.target);
  setTimeout(() => {
    hideMessage();
  }, 2500);
  
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

window.onload = async () => {
  profilePainel.style.visibility = "hidden"

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
      document.querySelector('header').style.visibility = 'visible'
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

function fitInformationOnInputs(data) {
  
  const imageInput = document.getElementById("circle-change-image-cover");
  const headerCircle = document.querySelector('.profile-icon-circle')
 

  if (data.user_image) {
    const src = `http://localhost:3000/file_system/${data.user_image}`
    imageInput.setAttribute('src', src);
    headerCircle.setAttribute('src', src)
    
  }
  else { 
    const alternativeSrc = `http://localhost:3000/file_system/app/default_user_image.png`
    imageInput.setAttribute('src', alternativeSrc);
    headerCircle.setAttribute('src', alternativeSrc)
  }
    


  const emailInput = document.getElementById("profile-email-input");
  emailInput.innerHTML = data.email;

  const nameInput = document.getElementById("profile-name-input");
  nameInput.value = data.full_name;

  const cidadeInput = document.getElementById("profile-cidade-input");
  cidadeInput.value = data?.addr_state;

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
const profilePainel = document.querySelector('.profile-icon-painel')

window.addEventListener('click', (e) => {
  if (e.target.getAttribute('onclickclose') != null) { 
    profilePainel.style.visibility = "hidden";
  }
})


document.querySelector('.profile-icon-circle').addEventListener('click', (e) => {
  if (e.target.getAttribute('class').toString() == "profile-icon-circle") {
    profilePainel.style.visibility = profilePainel.style.visibility == "hidden" ? "visible" : "hidden";
  }
})

document.querySelector('.logout-btn').addEventListener('click', (e) => {
  window.localStorage.removeItem('token')
  window.location.reload();
})
