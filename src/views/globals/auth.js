const BASE_URL_PATH_AUTH = 'http://localhost:3000/'

authing();

async function handleUserFetchTokenData(action) {  //action to be done in case of not auth
  document.querySelector('.logo-header-container').addEventListener('click', () => window.location.href = '/')
  document.getElementById('procurar-and-icon-container').addEventListener('click', () => toggleNavItem())
    const header = document.querySelector(".header");
  const headerCircle = document.querySelector('.header-user-icon')
  const headerUserCircleContainer = document.querySelector('.header-user-icon-container')
  
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

    const lis = document.querySelectorAll('.user-painel-item')

    headerUserCircleContainer.style.position = 'unset';
        headerCircle.addEventListener('click', (e) => toggleHeaderPainel(headerPainel, headerLogoutButton, lis))
        headerLogoutButton.addEventListener('click', () => logout())
        fitUserInfoInHeader(data.fullUser.user_image);
        main.addEventListener('click', () => toggleHeaderPainel(headerPainel, headerLogoutButton, lis))
    showContent(header, headerCircle, main, spinner);

    const bellContainer = document.querySelector('.bell-inside-container');
    bellContainer.style.visibility = 'visible';
    bellContainer.addEventListener('click', () => toggleBellPainel())
      

    registerAndLoginContainer.style.visibility = 'hidden'
    registerAndLoginContainer.style.position = 'absolute'
    
    const messagesData = await getUserMessages();
    if (messagesData.from_users.length == 0 && messagesData.from_system.length == 0) { 
      const noMessagesDiv = document.createElement('div');
      noMessagesDiv.setAttribute('style', 'width: 70%;margin: auto;margin-top: 115px;');

      noMessagesDiv.innerHTML = '<i class="fa-solid fa-bell" style="font-size: 1.5em; margin-left: 10px; margin-bottom: 15px;"></i><p>Voce nao possui nehnuma notificação</p>'

      const allMessagesContainer = document.querySelector('.all-messages-container')
      allMessagesContainer.append(noMessagesDiv)

    }

    else appendMessagesOnPainel(messagesData, data.fullUser.userid)

      return data.fullUser;
  } else {
    window.location.href = `${BASE_URL_PATH_AUTH}login`;
    
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
  if (action == 'redirect') return window.location.href = `${BASE_URL_PATH_AUTH}login`;
      
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
  
let closed=true
let isUserPainelClickable = true

function toggleHeaderPainel(PainelElement, headerLogoutButton, lis) {
  if (!isUserPainelClickable) return;
  
  isUserPainelClickable = false;

  if (closed) {
    PainelElement.style.visibility = 'visible'
    PainelElement.style.width = '5px'
    PainelElement.style.height = '300px'
    setTimeout(() => { 
      PainelElement.style.width = '200px'
      PainelElement.style.padding = '20px 15px 20px 15px'
    }, 350)
    setTimeout(() => { 
      Array.from(lis).map(li => { 
        li.style.visibility = 'visible'
        li.style.position = 'unset'
        li.style.margin = 'auto'
        li.style.top = 'unset'
      })
      headerLogoutButton.style.visibility = 'visible'
      headerLogoutButton.style.position = 'static'
 
    headerLogoutButton.style.bottom = '8px'
    headerLogoutButton.style.margin = 'auto'
 
      isUserPainelClickable = true;
    }, 525)
    
    closed = false;
  } else {
    PainelElement.style.padding = '0'
    PainelElement.style.height = '5px'
    Array.from(lis).map(li => { 
      // li.style.visibility = 'hidden'
      li.style.position = 'fixed'
      li.style.inset = '0 500px 0 0'
      li.style.margin = 'unset'
      li.style.visibility = 'hidden'
    })
   
    // headerLogoutButton.style.visibility = 'hidden'
    headerLogoutButton.style.position = 'fixed'
    headerLogoutButton.style.inset = '0 500px 0 0'
    headerLogoutButton.style.margin = 'unset'
    headerLogoutButton.style.visibility = 'hidden'
    setTimeout(() => { 
      PainelElement.style.width = '0'
      isUserPainelClickable = true
    }, 350)
    
    closed = true;
  }
    
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

function convertNumberToMonth(month_number) {
  const months = new Array("Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro");
  return months[month_number - 1]
}



// BELL

// testing bell
let isPainelClosed = true;
let isPainelClickable = true;
let firstTimeOpening = true;

async function toggleBellPainel() {
  if (firstTimeOpening) { 

  }

  const bellPainel = document.querySelector('.bell-painel');
  const bellInsidePainel = document.querySelector('.bell-painel-inside');
  if (!isPainelClickable) return
  if (isPainelClickable) {
    if (isPainelClosed) { openBellPainel(bellPainel, bellInsidePainel) }
    else { closeBellPainel(bellPainel, bellInsidePainel) };
  }
  firstTimeOpening = false;
}

function appendMessagesOnPainel(messages, userid) {
  let notReadMessagesCont = 0;

  const allMessagesContainer = document.querySelector('.all-messages-container')

  if (messages.from_system.length > 0) {
    messages.from_system.map(message => { 
      const messageElement = createMessageElement(message, userid, true);
      allMessagesContainer.append(messageElement);
      if (message.has_been_read_by_receiver == 0) notReadMessagesCont++;
    })
  }


  if (messages.from_users.length > 0) { 
    messages.from_users.map(message => {
      const messageElement = createMessageElement(message, userid, false);
      allMessagesContainer.append(messageElement);

      //user que enviou
      if (message.sender == userid) { 
        if (message.has_been_read_by_sender == 0) notReadMessagesCont++;
      } else {
        if (message.has_been_read_by_receiver == 0) notReadMessagesCont++;
      }
        
    })
  }

  if (notReadMessagesCont !== 0) appendMessagesContOnBell(notReadMessagesCont); //for not read messages only
}

function appendMessagesContOnBell(numberOfMessages) {
  const bellInsideContainer = document.querySelector('.bell-inside-container')
  const number = document.createElement('p')
  number.style.margin = '0'
  number.innerText = numberOfMessages;
  const bellNumber = document.createElement('div')
  bellNumber.className = 'bell-number'
  bellNumber.append(number)
  bellInsideContainer.append(bellNumber)
}

function createMessageElement(message, userid, robot) {
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container'
  messageContainer.setAttribute('message_id', message.message_id)
  
  const messageImage = document.createElement('img');
  messageImage.className = 'message-image'

  if (robot) {
    messageImage.setAttribute('src', '/file_system/app/system.png')
  } else {
    if (message.user_image) messageImage.setAttribute('src', message.user_image)
    else messageImage.setAttribute('src', '/file_system/app/user_default.jpg')
  }
  

  const month = convertNumberToMonth(message.created_at.toString().substring(5,7))
  const day = message.created_at.toString().substring(8,10)
  const year = message.created_at.toString().substring(0, 4)
  
  const messageOwner = document.createElement('p');
  messageOwner.style.textAlign = 'start'
  messageOwner.style.margin = '0'
  
  const messageTime = document.createElement('p');
  messageTime.className = 'message-time'
  

  if (robot) {
    messageOwner.innerHTML = `<b>GoGreen</b>`
  } else {
    if (message.sender == userid) {
      messageOwner.setAttribute('href', `/profile/${message.receiver}`);
      messageOwner.innerHTML = `<b>Para:</b> <a  href="/profile/${message.receiver}"> ${message.full_name}</a>`
      messageOwner.onclick = () => window.location.href=`/profile/${message.receiver}`
    } else {
      messageOwner.setAttribute('href', `/profile/${message.sender}`);
      messageOwner.innerHTML = `<b>Para:</b> <a href="/profile/${message.sender}"> ${message.full_name}</a>`
      messageOwner.onclick = () => window.location.href=`/profile/${message.sender}`
    }
  }
  messageTime.innerHTML = `${day} de ${month} de ${year}`
  

  const messageText = document.createElement('p');
  messageText.className = 'message-text'
  messageText.innerHTML = message.message_text

  const ImageAndInfoContainer = document.createElement('div');
  ImageAndInfoContainer.setAttribute('style', 'display: flex; align-items: center;');

  
  const messageOwnerAndInfoContainer = document.createElement('div')
  messageOwnerAndInfoContainer.setAttribute('style', 'display: flex; flex-direction: column; justify-content: start;')
  messageOwnerAndInfoContainer.append(messageOwner)
  messageOwnerAndInfoContainer.append(messageTime)

  ImageAndInfoContainer.append(messageImage)
  ImageAndInfoContainer.append(messageOwnerAndInfoContainer)


  messageContainer.append(ImageAndInfoContainer)
  messageContainer.append(messageText)

 

  return messageContainer
}

// const deleteMessagesButton = document.querySelector('.delete-messages-button')
// deleteMessagesButton.addEventListener('click', () => deleteMessages())

let selectedMessages = [];

function toggleOnList(message_id) {
  const found = selectedMessages.find(id => id == message_id)
  if (!found) selectedMessages.push(message_id);
  else selectedMessages = selectedMessages.filter(id => id !== message_id)

  if (selectedMessages.length > 0) { 
    showDeleteMessagesButton()
  }
  else {
    console.log('hiding')
    hideDeleteMessagesButton()
  }
  console.log(selectedMessages)
}

function showDeleteMessagesButton() {
  deleteMessagesButton.style.visibility = 'visible'
}

function hideDeleteMessagesButton() {
  deleteMessagesButton.style.visibility = 'hidden'
  
}


async function deleteMessages() {
  if (selectedMessages.length == 0) return;
  const data = await fireDeleteMessagesRequest();
  console.log(data)
}
async function fireDeleteMessagesRequest() {
  const res = await fetch(`${BASE_URL_PATH_AUTH}deletemessages`, {
    method: 'POST',
    body: JSON.stringify(selectedMessages),
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
 }

 function openBellPainel(bellPainel, bellInsidePainel) {
  isPainelClickable = false;
  bellPainel.style.height = '3px';
  bellPainel.style.transition = '0.2s ease-in-out';
  bellPainel.style.width = '250px';
  setTimeout(() => {
    bellPainel.style.height = '350px';
    bellPainel.style.padding = '5px';
  }, 175);
  setTimeout(() => {
    bellInsidePainel.style.visibility = 'visible';
    isPainelClickable = true;
  }, 200);
  isPainelClosed = false;
}
 function closeBellPainel(bellPainel, bellInsidePainel) {
  isPainelClickable = false;
  bellPainel.style.height = '2px';
  bellPainel.style.padding = '0';
  bellInsidePainel.style.visibility = 'hidden';
  setTimeout(() => {
    bellPainel.style.width = '0';
    isPainelClickable = true;
  }, 175);
  isPainelClosed = true;
}


async function getUserMessages() {
  const res = await fetch(`${BASE_URL_PATH_AUTH}mymessages`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  const data = await res.json();
  console.log('here ' + JSON.stringify(data))
  return data;
}

