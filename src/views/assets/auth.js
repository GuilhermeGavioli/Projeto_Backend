const BASE_URL_PATH_AUTH = 'http://localhost:3000/'

authing();

async function handleUserFetchTokenData(action) {  //action to be done in case of not auth
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
  
    // function protectAgainstNonAuthorizedUsers();
    // function protectAgainstAuthorizedUsers();
  
  if (!getStoredToken() ) handleActionForNonAuthorizedUsers(action, items);
  console.log('bbbbbbbbbbbbbb')
  const data = await fireAuthVerificationRequest();
  
  if (!data.auth) { 
    handleActionForNonAuthorizedUsers(action, items);
  } else if (data.auth) {
        headerCircle.addEventListener('click', (e) => toggleHeaderPainel(headerPainel))
        headerLogoutButton.addEventListener('click', () => logout())
        fitUserInfoInHeader(data.fullUser.user_image);
      showContent(header, headerCircle, main, spinner);
      

      registerAndLoginContainer.style.visibility = 'hidden'
      registerAndLoginContainer.style.position = 'absolute'
        return data.fullUser;
  } else {
    window.location.href = `${BASE_URL_PATH_AUTH}pagelogin`;
    
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
    try {
        if (!imageSource) headerUserIcon.setAttribute('src', `${BASE_URL_PATH_AUTH}file_system/app/user_default.jpg`);
        if (imageSource) return headerUserIcon.setAttribute('src', `${BASE_URL_PATH_AUTH}file_system/user/${imageSource}`);
    } catch (err) {
        headerUserIcon.setAttribute('src', `${BASE_URL_PATH_AUTH}file_system/user/${imageSource}`);
    }
}
  
  function getStoredToken() {
    return window.localStorage.getItem("token") || null;
}
  
function toggleHeaderPainel(PainelElement) {
    PainelElement.style.visibility = PainelElement.style.visibility == "hidden" ? "visible" : "hidden";
}


//toggle procurar navbar item
document.getElementById('procurar').addEventListener('click', () => toggleNavItem())
function toggleNavItem() {
  const painel = document.getElementById('procurar-painel')
  isPainelOpen = painel.getAttribute('isOpen')

  if (isPainelOpen.toString() == 'false') {
    painel.style.visibility = 'visible';
    painel.style.opacity = '100%';
    painel.setAttribute('isOpen', 'true');
  } else {
    painel.style.visibility = 'hidden';
    painel.style.opacity = '0%';
    painel.setAttribute('isOpen', 'false');
  }
}

//adds paths to header links



function authing() {
    console.log('authing...')
}

function logout() {
  window.localStorage.removeItem('token');
  window.location.reload();
}
  



  