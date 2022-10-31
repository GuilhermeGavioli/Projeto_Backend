const BASE_URL_PATH_AUTH = 'http://localhost:3000/'

authing();

async function handleUserFetchTokenData(action) {  //action to be done in case of not auth
  document.querySelector('.logo-header-container').addEventListener('click', () => window.location.href = '/')
  document.getElementById('procurar-and-icon-container').addEventListener('click', () => toggleNavItem())
    const header = document.querySelector(".header");
    const headerCircle = document.querySelector('.header-user-icon')
    const main = document.querySelector(".container");
    const spinner = document.getElementById("spinning");
    const registerAndLoginContainer = document.getElementById('register-and-login');
  
  const items = {
    header,
    headerCircle,
    main,
    spinner
  }

    hideContent(header,headerCircle, main, spinner, registerAndLoginContainer);
    
  
    const headerPainel = document.querySelector('.header-painel');
    const headerLogoutButton = document.querySelector('.logout-btn');
  
 
  
  if (!getStoredToken() ) handleActionForNonAuthorizedUsers(action, items);
  const data = await fireAuthVerificationRequest();
  
  if (!data.auth) { 
    handleActionForNonAuthorizedUsers(action, items);
  } else if (data.auth) {
        headerCircle.addEventListener('click', (e) => toggleHeaderPainel(headerPainel))
        headerLogoutButton.addEventListener('click', () => logout())
        fitUserInfoInHeader(data.fullUser.user_image);
        main.addEventListener('click', () => closePainel(headerPainel))
    showContent(header, headerCircle, main, spinner);
      

      registerAndLoginContainer.style.visibility = 'hidden'
      registerAndLoginContainer.style.position = 'absolute'
      return data.fullUser;
  } else {
    window.location.href = `${BASE_URL_PATH_AUTH}/login`;
    
    }
}


async function fireAuthVerificationRequest() {
    const res = await fetch(`${BASE_URL_PATH_AUTH}auth`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            authorization: getStoredToken(),
            required_info: "*",
        }
    })
    return await res.json();
}
  

function handleActionForNonAuthorizedUsers(action, items) {
  if (action == 'stay') return;
  if (action == 'redirect') return window.location.href = `${BASE_URL_PATH_AUTH}pagelogin`;
      
  if (action == 'stayOnThePageStillNotLoggedIn') {
    showContent(items.header, items.header, items.main, items.spinner)
  }
  return;
}

  
  function showContent(header,headerCircle, main, spinner) {
    main.style.visibility = "visible";
    header.style.visibility = 'visible';
    headerCircle.style.visibility = "visible";
    headerCircle.style.position = "unset";
    spinner.style.visibility = "hidden";
    spinner.style.position = "absolute";
  }
  
function hideContent(header,headerCircle, main, spinner, registerAndLoginContainer) {
  main.style.visibility = "hidden";
  headerCircle.style.visibility = 'hidden';
  headerCircle.style.position = 'absolute';
    header.style.visibility = 'hidden';
  spinner.style.visibility = "visible";

}
  
function fitUserInfoInHeader(imageSource) {
  const headerUserIcon = document.querySelector('.header-user-icon');
  let src = `${BASE_URL_PATH_AUTH}file_system/app/user_default.jpg`
  

  
  if (imageSource) { 
    src = `${BASE_URL_PATH_AUTH}file_system/user/${imageSource}`
  }

  headerUserIcon.setAttribute('src', src);
    
}
  
  function getStoredToken() {
    return window.localStorage.getItem("token") || null;
}
  
function toggleHeaderPainel(PainelElement) {
    PainelElement.style.visibility = PainelElement.style.visibility == "hidden" ? "visible" : "hidden";
}


//toggle procurar navbar item //procurar

function toggleNavItem() {
  console.log('opening')
  const painel = document.querySelector('.procurar-painel-container')

  const produtores = document.getElementById('produtores-item')
  const produtos = document.getElementById('produtos-item')
  // const painelItems = document.querySelector('.painel-items')
  const seta = document.getElementById('seta')


  isPainelOpen = painel.getAttribute('isOpen')

  if (isPainelOpen.toString() == "false") {
    painel.style.visibility = 'visible';
    painel.style.height = '90px';
    painel.setAttribute('isOpen', 'true');

    seta.style.transform = 'rotate(-90deg)'
    setTimeout(() => {
      produtores.style.visibility = 'visible'
      produtos.style.visibility = 'visible'
    }, 150);
  } else {
    painel.style.height = '0';
    painel.style.visibility = 'hidden';
    seta.style.transform = 'rotate(0deg)'
    produtores.style.visibility = 'hidden'
    produtos.style.visibility = 'hidden'
    painel.setAttribute('isOpen', 'false');
  }
}

//adds paths to header links
function closePainel(headerPainel) {
  headerPainel.style.visibility = 'hidden';
}


function authing() {
    console.log('authing...')
}

function logout() {
  window.localStorage.removeItem('token');
  window.location.reload();
}

function convertGender(genderNumber) {
  if (genderNumber === 1 ) return 'Masculino'
  if (genderNumber === 2 ) return 'Feminino'
  if (genderNumber === 0 ) return 'Outro'
}
  
function calcularIdade(ano) {
  return Number(new Date().getFullYear() - ano);
}


  