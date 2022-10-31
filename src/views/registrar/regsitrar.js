

window.onload = async () => {
    const spinning = document.getElementById("spinning");
    spinning.style.visibility = 'visible'
    const main = document.querySelector('.container2');
    main.style.visibility = 'hidden'

    const token = getStoredToken();
    if (token){
        const res = await fetch("http://localhost:3000/auth", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization": token
            }
        })
        const data = await res.json();
        if (!data.auth) {
            main.style.visibility = 'visible'
            spinning.style.visibility = 'hidden'
            return;
        }
        if (data.auth) window.location.href = 'http://localhost:3000/pagehome'
    } else {
        main.style.visibility = 'visible'
        spinning.style.visibility = 'hidden'
    }
}


const nameInput = document.getElementById("field-name");
const email = document.getElementById("field-email");
const password = document.getElementById("field-password");
const confirmPassword = document.getElementById("field-confirmar-senha");
const city = document.getElementById("field-city");
const gender = document.getElementById("field-gender");
const dataNascimento = document.getElementById("field-data-nascimento");
const buttonCadastrar = document.getElementById("btn-cadastrar");

buttonCadastrar.addEventListener("click", async (e) => {
    e.preventDefault();
    runSpinAnimation(e.target);
    
    
    if (!nameInput.value.trim() || !email.value.trim() || !password.value.trim() || !city.value.trim() || !gender.value || !dataNascimento.value) {
        showMessage("Campos devem ser preenchidos");
        setTimeout(() => { 
            hideMessage();
        }, 6000)
        setTimeout(() => { 
            stopSpinAnimation(e.target)
            return;
        },400)
    }
    
    const userData = {
        name: nameInput.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        gender: Number(gender.value),
        city: city.value,
        bornDate: dataNascimento.value,
    }

    await cadastrar(userData);
    setTimeout(() => { 
        stopSpinAnimation(e.target)
    }, 400)

  setTimeout(() => {
    hideMessage();
  }, 6000);
    
})

async function cadastrar(userData){
    console.log('runnning')
    const res = await fetch("http://localhost:3000/registeruser", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            "Content-type": "application/json",
        }
    })
    const data = await res.json();
    if (data.error) return showMessage(data.message);
    alert('Usuario cadastrado')
    window.location.href = 'http://localhost:3000/pagelogin'
}




function getStoredToken(){
    const localToken = window.localStorage.getItem("token");
    return localToken
}


function runSpinAnimation(button) {
    console.log(button);
    button.firstElementChild.style.visibility = "visible";
    button.lastElementChild.style.visibility = "hidden";
  }
  
  function stopSpinAnimation(button) {
    button.firstElementChild.style.visibility = "hidden";
    button.lastElementChild.style.visibility = "visible";
  }
  
  
  function showMessage(message) {
      const failMessage = document.querySelector(".fail-message-container");
      failMessage.innerHTML = "Algo deu errado, " + message + ", tente novamente!";
      failMessage.style.visibility = "visible";
      failMessage.style.opacity = "90%";
  }
    
  function hideMessage() {
      const failMessage = document.querySelector(".fail-message-container");
      failMessage.style.visibility = "hidden"
      failMessage.style.opacity = "0%"
  }
  
  const failMessage = document.querySelector(".fail-message-container");
  failMessage.addEventListener('dblclick', () => { hideMessage()})