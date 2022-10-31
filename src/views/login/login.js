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


const email = document.getElementById("field-email");
const password = document.getElementById("field-password");
const buttonLogar = document.getElementById("btn-logar");



// buttonLogar.addEventListener("click", (e) => {
   

//     e.preventDefault();
//     const userData = {
//         email: email.value,
//         password: password.value,
//     }
//     logar(userData);
// })

async function logar(userData){
    const res = await fetch("http://localhost:3000/loginuser", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            "Content-type": "application/json",
        }
    })
    const data = await res.json();
    if (data.token && !data.error) {
        storeToken(data.token);
        window.location.href = 'http://localhost:3000/pagealterarusuario'
        return
    }

    showMessage(data.message);
}

function storeToken(token){
    // document.cookie = "token=" + token
    window.localStorage.setItem("token", token);
}

function getStoredToken(){
    // const cookieToken = document.cookie = "token=" + token
    const localToken = window.localStorage.getItem("token");
    return localToken
}






//a-----------------------------------

buttonLogar.addEventListener("click", async (e) => {
    e.preventDefault();
    runSpinAnimation(e.target);
    
    
    if (!email.value.trim() || !password.value.trim()) {
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
      email: email.value,
      password: password.value,
    }
    
    
    await logar(userData);
    setTimeout(() => { 
        stopSpinAnimation(e.target)
    }, 400)

  setTimeout(() => {
    hideMessage();
  }, 6000);
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