const BASE_URL_PATH_AUTH = 'http://localhost:3000/'

authing();

async function handleUserFetchTokenData(action) {  //action to be done in case of not auth

  // if home it will paint home with green

  document.querySelector('.logo-header-container').addEventListener('click', () => window.location.href = '/')
  // document.getElementById('procurar-and-icon-container').addEventListener('click', () => toggleNavItem())
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
    
  
    
    const headerLogoutButton = document.querySelector('.logout-btn');
  
 
  
  if (!getStoredToken() ) handleActionForNonAuthorizedUsers(action, items);
  const data = await fireAuthVerificationRequest();
  
  if (!data.auth) { 
    handleActionForNonAuthorizedUsers(action, items);
  } else if (data.auth) {


    //cart

    const headerCart = document.getElementById('header-cart')
    headerCart.style.visibility = 'visible'
    headerCart.addEventListener('click', () => toggleCart())

    handleCart();
   

    //cart


    headerUserCircleContainer.style.display = 'flex';
    headerCircle.addEventListener('click', (e) => toggleHeaderPainel())
    headerLogoutButton.addEventListener('click', () => logout())

    const headerPainelUserName = document.querySelector('.header-painel-name')
    headerPainelUserName.innerText = data.fullUser.full_name

    console.log(data)
    fitUserInfoInHeader(data.fullUser.user_image);
    fitUserInfoInCart(data.fullUser)

    showContent(header, headerCircle, main, spinner);

    const bellContainer = document.querySelector('#header-bell');
    bellContainer.style.visibility = 'visible';
    bellContainer.addEventListener('click', () => toggleBellPainel())
      
    document.getElementById('header-bell').style.display = 'unset'

    registerAndLoginContainer.style.visibility = 'hidden'
    registerAndLoginContainer.style.position = 'absolute'




    const likesData = await getUserLikes();
    myLikes = likesData;


    
    const messagesData = await getUserMessages();
    myMessages = messagesData;

    if (messagesData.length == 0) {
      const noMessagesDiv = document.createElement('div');
      noMessagesDiv.setAttribute('style', 'width: 70%;margin: auto;margin-top: 115px;');

      noMessagesDiv.innerHTML = '<i class="fa-solid fa-bell" style="font-size: 1.5em; margin-left: 10px; margin-bottom: 15px;"></i><p>Voce nao possui nehnuma notificação</p>'

      const allMessagesContainer = document.querySelector('.all-messages-container')
      allMessagesContainer.append(noMessagesDiv)
    } else { 
      appendMessagesOnPainel(messagesData);
      appendMessagesContOnBell(notReadMessagesCont);
    }

      return data.fullUser;
  } else {
    window.location.href = `${BASE_URL_PATH_AUTH}login`;
    
    }
}


cartStateChanged = false;
isCartOpen = false;
function toggleCart() {
  if (isCartOpen) closeCart()
  else openCart()
}

async function openCart() {
  closeUserPainel();
  const bellPainel = document.querySelector('.bell-painel');
  const bellInsidePainel = document.querySelector('.bell-painel-inside');
  closeBellPainel(bellPainel, bellInsidePainel)
  // document.querySelector('.cart-no-items-to-be-shown-container').style.display = 'unset'

  if (cartStateChanged) {
    await handleCart();
  }
  cartContainer = document.querySelector('.cart-container')
  cartContainer.style.inset = '0 0 0 0';
  cartContainer.style.visibility = 'visible';
  isCartOpen = true;
}

let cartIdsItems = [];
let myLikes = [];

async function handleCart() {
  let cartTotalPrice = 0;
  const cartItems = await getCartData();
  if (!cartItems || cartItems.length == 0) {
    //  document.querySelector('.cart-no-items-to-be-shown-container').style.visibility = 'visible'
     updateCartCount(0)  
    return;
    }
    cartItems.map(item => { 
      cartTotalPrice += Number(item.price)
      
      updateCart('add', item.cart_id, item)
  })
  isFirstTimeOpeningCart = false;
  // if (cartCont != 0) {
    document.getElementById('cart-sub-total-number').innerText = "R$" + cartTotalPrice.toFixed(2).toString();
  // }
}

function updateCart(action, cartid, productInfo) {
 

  if (action === 'remove') {
    cartIdsItems = cartIdsItems.filter((obj) => {
      console.log(obj)
      return obj.cart.toString() !== cartid.toString()
    })
    removeCardItem(cartid);
  }

  if (action === 'add') {
    cartIdsItems.push({ product: productInfo, cart: cartid })
    const card = createCartItem(productInfo, cartid)
    document.querySelector('.cart-items-container').append(card)
  }

  updateCartCount(cartIdsItems.length)
  console.log(cartIdsItems)
  // updateCartInterface();
}

function removeCardItem(cartid) {
  Array.from(document.querySelector('.cart-items-container').children).map(element => { 
    if (element.getAttribute('cartid') == cartid.toString()) {
      element.remove();
    }
  })
}

function updateCartCount(number) {
  console.log('removing cont')
  const headerCart = document.getElementById('header-cart')
  if (headerCart.firstChild) headerCart.firstChild.remove();
  // const noItemsElement = document.querySelector('.cart-no-items-to-be-shown-container')
  // if (number != 0) noItemsElement.style.visibility = 'hidden'
  // else noItemsElement.style.visibility = 'visible'
  const numberCartCount = document.createElement('div');
  numberCartCount.id = 'cart-number-cont'
  numberCartCount.innerText = number
  headerCart.append(numberCartCount)
}




{/* <div class="cart-item">
                    <div class="cart-item-first"></div>
                    <div class="cart-item-second">
                        <h2 class="cart-item-name">Batatas Orgânicas</h2>
                        <p class="cart-item-price">R$ 129.00</p>
                    </div>
                    <div class="cart-item-third">
                        <i class="fa-solid fa-xmark" style="margin: 0;"></i>
                    </div>
                </div> */}
function createCartItem(item, cartid) {
  const cartItem = document.createElement('div')
  cartItem.className = 'cart-item'
  cartItem.setAttribute('cartid', cartid)
  
  const cartItemFirst = document.createElement('img')
  cartItemFirst.className = 'cart-item-first'
  cartItemFirst.src = `/file_system/product/${item.product_image}`
  
  const cartItemSecond = document.createElement('div')
  cartItemSecond.className = 'cart-item-second'
  
  const cartItemName = document.createElement('h2')
  cartItemName.className = 'cart-item-name'
  cartItemName.innerText = item.product_name
  cartItemName.onclick = () => window.location.href = `/produto/${item.product_id}`
  
  const cartItemPrice = document.createElement('p')
  cartItemPrice.className = 'cart-item-price'
  cartItemPrice.innerText = "R$" + item.price

  const cartItemThird = document.createElement('div')
  cartItemThird.className = 'cart-item-third'
  cartItemThird.innerHTML = '<i class="fa-solid fa-xmark" style="margin: 0;"></i>'

  cartItemThird.addEventListener('click', async (e) => {
    const wasDeleted = await deleteFromCart(item.cart_id)
    if (wasDeleted) {
      console.log('iii '+ JSON.stringify(item))
      removeCardItem(cartid)
      e.target.parentElement.parentElement.remove();
    }
  })

  cartItemSecond.append(cartItemName)
  cartItemSecond.append(cartItemPrice)

  cartItem.append(cartItemFirst)
  cartItem.append(cartItemSecond)
  cartItem.append(cartItemThird)
  return cartItem;
}



async function deleteFromCart(cart_item_id) {
  console.log('deleting')
  const res = await fetch(`${BASE_URL_PATH_AUTH}removecartitem/${cart_item_id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  const data = await res.json();
  return data.deleted
}

function closeCart() {
  cartContainer = document.querySelector('.cart-container')
  cartContainer.style.bottom = '-100vh';
  cartContainer.style.visibility = 'hidden';
  // document.querySelector('.cart-no-items-to-be-shown-container').style.display = 'none'
  isCartOpen = false;
}

async function getCartData() {
  const res = await fetch(`${BASE_URL_PATH_AUTH}mycartitems`, {
    method: "GET",
    headers: {
        "Content-type": "application/json",
        authorization: getStoredToken(),
    }
})
  return await res.json();
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
  const headerPainelUserIcon = document.querySelector('.header-painel-pic')
  const headerUserIcon = document.querySelector('.header-user-icon');
  let src = `${BASE_URL_PATH_AUTH}file_system/app/user_default.jpg`
  if (imageSource) src = `${BASE_URL_PATH_AUTH}file_system/user/${imageSource}`
  headerUserIcon.setAttribute('src', src);
  headerPainelUserIcon.setAttribute('src', src)
}
  
function fitUserInfoInCart(user) {
  document.querySelector('#cart-name-input').setAttribute('value', user.full_name)
  document.querySelector('#cart-address-input').setAttribute('value', user.addr_state)
}

function getStoredToken() {
    return window.localStorage.getItem("token") || null;
}
  
let isUserPainelClosed = true
function toggleHeaderPainel() {
  if (isUserPainelClosed) return openUserPainel()
  closeUserPainel();
}

function openUserPainel() {
  closeCart()
  const bellPainel = document.querySelector('.bell-painel');
  const bellInsidePainel = document.querySelector('.bell-painel-inside');
  closeBellPainel(bellPainel, bellInsidePainel)
  const userPainel = document.querySelector('.header-painel');
  userPainel.style.visibility = 'visible'
  isUserPainelClosed = false;
}
function closeUserPainel() {
  const userPainel = document.querySelector('.header-painel');
  userPainel.style.visibility = 'hidden'
  isUserPainelClosed = true;
}

window.onscroll = () => {
  closeUserPainel();

  const bellPainel = document.querySelector('.bell-painel');
  const bellInsidePainel = document.querySelector('.bell-painel-inside');
  closeBellPainel(bellPainel, bellInsidePainel);
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

let myMessages = [];
// testing bell
let isPainelClosed = true;
let isPainelClickable = true;
let firstTimeOpening = true;

async function toggleBellPainel() {
  
  if (firstTimeOpening && myMessages.length != 0) {
    let notReadMessagesOnly = [];

    notReadMessagesOnly = myMessages.filter(message => { 
      return message.has_been_read_by_receiver == 0;
    })

    const data = await readMessages(notReadMessagesOnly);
    if (data.read) {
      console.log('has ben reda')
      // const number = document.getElementById('bell-number-cont')
      // number.remove();
      appendMessagesContOnBell(0);
    }
  }

  const bellPainel = document.querySelector('.bell-painel');
  const bellInsidePainel = document.querySelector('.bell-painel-inside');
  
  if (!isPainelClickable) return
  if (isPainelClickable) {
    if (isPainelClosed) {
      openBellPainel(bellPainel, bellInsidePainel)
      closeCart();
    }
    else { closeBellPainel(bellPainel, bellInsidePainel) };
  }
  firstTimeOpening = false;
}

async function readMessages(notReadMessages) {
  const res = await fetch(`${BASE_URL_PATH_AUTH}readmessage`, {
    method: 'POST',
    body: JSON.stringify({messages: notReadMessages}),
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
}


let notReadMessagesCont = 0;
function appendMessagesOnPainel(messages) {
  const allMessagesContainer = document.querySelector('.all-messages-container')

  messages.map(message => {
      myMessages.push(message)
      const messageElement = createMessageElement(message);
      allMessagesContainer.append(messageElement);
      if (message.has_been_read_by_receiver == 0) notReadMessagesCont++;
  })
}

let firstTime = true;
function appendMessagesContOnBell(numberOfMessages) {
  const bellInsideContainer = document.querySelector('#header-bell');
  if (!firstTimeOpening) {
    console.log('removing')
    bellInsideContainer.lastChild.remove();
    
  }


  const number = document.createElement('p')
  number.style.margin = '0'
  number.innerText = numberOfMessages;
  const bellNumber = document.createElement('div');
  bellNumber.id = 'bell-number-cont'
  bellNumber.append(number);
  bellInsideContainer.append(bellNumber);
  firstTime = false;
}

function createMessageElement(message) {
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container'
  messageContainer.setAttribute('message_id', message.message_id)
  
  const messageImage = document.createElement('img');
  messageImage.className = 'message-image'

  messageImage.setAttribute('src', '/file_system/app/system.png')
  
  const month = convertNumberToMonth(message.created_at.toString().substring(5,7))
  const day = message.created_at.toString().substring(8,10)
  const year = message.created_at.toString().substring(0, 4)
  
  const messageOwner = document.createElement('p');
  messageOwner.style.textAlign = 'start'
  messageOwner.style.margin = '0'
  
  const messageTime = document.createElement('p');
  messageTime.className = 'message-time'
  messageOwner.innerHTML = `<b>GoGreen</b>`
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
  closeCart()
  closeUserPainel();

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

async function getUserLikes() { 
  const res = await fetch(`${BASE_URL_PATH_AUTH}mylikes`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
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



function paintHeader(elementToBePainted) {
  elementToBePainted.style.background = '#85bb46';
  elementToBePainted.style.padding = '8px 15px 8px 15px';
  elementToBePainted.style.color = 'rgb(7,67,27)!important'
  elementToBePainted.firstChild.style.color = 'rgb(7,67,27)'
}



async function addToCart(product_id) {
  const res = await fetch(`${BASE_URL_PATH}insertcartitem/${product_id}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  const data = await res.json();
  return { saved: data.saved, savedItem: data.savedItem }
}