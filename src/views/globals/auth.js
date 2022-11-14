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
    headerUserCircleContainer.style.position = 'unset';
        headerCircle.addEventListener('click', (e) => toggleHeaderPainel(headerPainel))
        headerLogoutButton.addEventListener('click', () => logout())
        fitUserInfoInHeader(data.fullUser.user_image);
        main.addEventListener('click', () => closePainel(headerPainel))
    showContent(header, headerCircle, main, spinner);

    const bellContainer = document.querySelector('.bell-inside-container');
    bellContainer.style.visibility = 'visible';
    bellContainer.addEventListener('click', () => toggleBellPainel())
      

      registerAndLoginContainer.style.visibility = 'hidden'
    registerAndLoginContainer.style.position = 'absolute'
    
    const messagesData = await getUserMessages();
    console.log('mdata '+ JSON.stringify(messagesData))
    appendMessagesOnPainel(messagesData, data.fullUser.userid)

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
  // if (firstTimeOpening) { 
  //   const messagesData = await getUserMessages();
  //   appendMessagesOnPainel(messagesData)
  // }
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
  console.log('messages ' + JSON.stringify(messages))
  messages.map(message => {
    console.log(JSON.stringify(message))
    console.log('test')
    if (message.has_been_read == 0) notReadMessagesCont++;

    const messageElement = createMessageElement(message, userid);
    allMessagesContainer.append(messageElement);
  })
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

function createMessageElement(message, userid) {
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container'
  messageContainer.setAttribute('message_id', message.message_id)
  messageContainer.addEventListener('click', (e) => { 
    e.target.className = 'message-selected'
  })

  const imageAndNameContainer = document.createElement('div');
  imageAndNameContainer.className = 'image-and-name-container'
  const messageImage = document.createElement('img');
  if (message.user_image) messageImage.setAttribute('src', message.user_image)
  else messageImage.setAttribute('src', '/file_system/app/user_default.jpg')

  messageImage.className = 'message-image'

  const messageName = document.createElement('p');
  console.log(message.sender)
  console.log(userid)
  // messageContainer.style.background = 'red'
  messageName.innerHTML = `${message.full_name}`
  
  messageName.style.margin = '0'
  
const messageTime = document.createElement('div');
  messageTime.className = 'message-time'
const month = convertNumberToMonth(message.created_at.toString().substring(5,7))
const day = message.created_at.toString().substring(8,10)
  const year = message.created_at.toString().substring(0, 4)
  
  const messageOwnerPara = document.createElement('p');
  const messageOwnerLink = document.createElement('a');
  messageOwner.style.textAlign = 'start'
  messageOwner.style.margin = '0'
  
  if (message.sender == userid) {
    messageOwner.setAttribute('href', `/profile/${message.receiver}`);
    messageOwner.innerHTML = `<b>Para:</b> <a  href="/profile/${message.receiver}"> ${message.full_name}</a>,`
    messageOwner.onclick = () => window.location.href=`/profile/${message.receiver}`
  } else {
    messageOwner.setAttribute('href', `/profile/${message.sender}`);
    messageOwner.innerHTML = `<b>Para:</b> <a href="/profile/${message.sender}"> ${message.full_name}</a>,`
    messageOwner.onclick = () => window.location.href=`/profile/${message.sender}`
  }
  messageTime.innerHTML = `em: </br> em ${day} de ${month} de ${year}`
  
  
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox')
  checkbox.className = 'message-checkbox'
  // checkbox.setAttribute('checked', 'false')
  checkbox.addEventListener('change', () => toggleOnList(messageContainer.getAttribute('message_id')));

  const messageText = document.createElement('p');
  messageText.className = 'message-text'
  messageText.innerText = message.message_text


  imageAndNameContainer.append(messageImage)
  imageAndNameContainer.append(messageName)

  // messageContainer.append(imageAndNameContainer)
  messageContainer.append(messageText)
  messageContainer.append(messageOwner)
  messageContainer.append(messageTime)

 

  return messageContainer
}

const deleteMessagesButton = document.querySelector('.delete-messages-button')
deleteMessagesButton.addEventListener('click', () => deleteMessages())

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
  return await res.json();
}

