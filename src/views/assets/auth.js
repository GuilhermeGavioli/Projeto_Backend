const BASE_URL_PATH_AUTH = 'http://localhost:3000/'

authing();

async function handleUserFetchTokenData(page) {
    const header = document.querySelector(".header");
    const main = document.querySelector(".container");
    const spinner = document.getElementById("spinning");

    hideContent(header, main, spinner);
    
  const registerAndLoginContainer = document.getElementById('register-and-login');
  
    const headerCircle = document.querySelector('.header-user-icon')
    const headerPainel = document.querySelector('.header-painel');
    const headerLogoutButton = document.querySelector('.logout-btn');
  
    // function protectAgainstNonAuthorizedUsers();
    // function protectAgainstAuthorizedUsers();
  
  if (!getStoredToken() && page !== 'home') return window.location.href = `${BASE_URL_PATH_AUTH}pagelogin`;
  
  const data = await fireAuthVerificationRequest();
  
  if (!data.auth) { 
    if (page == 'home') { 
      showContent(header, main, spinner);
      return handleHomeStyle(headerCircle, registerAndLoginContainer);

    }
    return window.location.href = `${BASE_URL_PATH_AUTH}pagelogin`;
  }

            
    if (data.auth) {
        headerCircle.addEventListener('click', (e) => toggleHeaderPainel(headerPainel))
        headerLogoutButton.addEventListener('click', () => logout())
        fitUserInfoInHeader(data.fullUser.user_image);
      showContent(header, main, spinner);
      
      //dirty code
      registerAndLoginContainer.style.visibility = 'hidden'
      registerAndLoginContainer.style.position = 'absolute'
        return data.fullUser;
    }
    window.location.href = `${BASE_URL_PATH_AUTH}pagelogin`;
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
  

function handleHomeStyle(headerCircle, registerAndLoginContainer) {
  headerCircle.style.position = 'absolute'
  headerCircle.style.visibility = 'hidden'
  registerAndLoginContainer .style.visibility = 'visible'
  registerAndLoginContainer.style.position = 'unset'
  return;
}

  
  function showContent(header, main, spinner) {
    main.style.visibility = "visible";
    header.style.visibility = 'visible';
    spinner.style.visibility = "hidden";
  }
  
function hideContent(header, main, spinner) {
    console.log('hiding')
    main.style.visibility = "hidden";
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

  



  