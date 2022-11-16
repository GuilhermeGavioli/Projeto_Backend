const BASE_URL_PATH =  'http://localhost:3000/'
const SOCKET_BASE_URL_PATH =  'http://localhost:3001'


window.onload = async () => {
  // const header = document.querySelector(".header");
  const headerPainel = document.querySelector('.header-painel');
  // const main = document.querySelector(".container");
  // const spinner = document.getElementById("spinning");

  // hideContent(header, main, spinner);

  // const headerCircle = document.querySelector('.header-user-icon')
  // const headerPainel = document.querySelector('.header-painel');
  // const headerLogoutButton = document.querySelector('.logout-btn');

    const user = await handleUserFetchTokenData('redirect');
    console.log(JSON.stringify(user))
    if (!user){  return window.location.href = '/'  }


    // const ws = new WebSocket(`${BASE_URL_PATH}`);
    // ws.onopen = () => { ws.send('ping') };
    // ws.onmessage = (data) => { console.log(data); } 
  
    
    //teste
    // const container = document.querySelector('.chat-messages')
    // container.scrollTop = (container.scrollHeight)
    // container.onscroll = () => { 
    //     console.log(container.scrollHeight)
    //     console.log(container.scrollTop - 500)
    //     if ((container.scrollHeight) > (container.scrollTop + 500)) activatedScrollSymbol();
        
    // }
    
    
    //teste
    const appendMeData = {
        image: user.user_image,
        id: user.userid,
        name: "Voce"
    }

    appendOnFriends(appendMeData)
            
    const messagesContainer = document.querySelector('.chat-messages')

    const sendButton = document.querySelector('.chat-send-message-button')
    
    sendButton.addEventListener('click', (e)=> sendMessage(e, user, socket))
    
    
    const socket = io(`${SOCKET_BASE_URL_PATH}`)

    socket.emit('entered', { id: user.userid, name: user.full_name, image: user.user_image})
    
    appendSystemMessage("Bem vindo ao chat " + user.full_name)


    socket.on('last-ten-messages', data => {
        if (data) { 
            data.map(message => { 
                appendLastMessages(user.userid, message)
            })
        } 
        scrollToBottom();
    })

  
    socket.on('users-already-online', (users) => {
            users.map(user => { 
                appendOnFriends(user)
            })
    })
    
    
    socket.on('someone-joined', user => { 
        console.log('uuu ' + user)
        appendOnFriends(user)
    })
    
    socket.on('someone-disconnected', userid => { 
        removeFromFriends(userid)
    })

    removeFromFriends();
    socket.on('send-message-server', message => {
        appendOthersMessage(message.message, message.name, message.id, message.image, message.date);
        scrollToBottom();
    })
}

function removeFromFriends(userid) {
    
    const friends = document.querySelector('.friends')
 
        const friendsChildren = Array.from(friends.children)
    friendsChildren.map(el => { 
        if (el.getAttribute('userid') == userid) el.remove();
    })
}

function appendOnFriends(user) {
    const friend = document.createElement('div')
    friend.className = 'friend'
    friend.addEventListener('click', () => window.location.href = `/profile/${user.id}`)
    friend.setAttribute('userid', user.id)

    const friendImageContainer = document.createElement('div')
    friendImageContainer.className = 'friend-image-container'

    const onlineCircle = document.createElement('div')
    onlineCircle.className = 'green-online-circle'

    const friendImage = document.createElement('img')
    if (!user.image || user.image.toString().trim() == '') friendImage.setAttribute('src', '/file_system/app/user_default.jpg')
    else friendImage.setAttribute('src', `/file_system/user/${user.image}`)
    friendImage.className='friend-image'


    friendImageContainer.append(onlineCircle)
    friendImageContainer.append(friendImage)

    const div = document.createElement('div')
    const friendName = document.createElement('p')
    friendName.className = 'friend-name'
    friendName.innerText = user.name;
    
    const onlineText = document.createElement('p')
    onlineText.className = 'online-text'
    onlineText.innerText = 'Online';

    div.append(friendName)
    div.append(onlineText)

    friend.append(friendImageContainer)
    friend.append(div)

    const friends = document.querySelector('.friends')
    friends.append(friend)
}


function activatedScrollSymbol() {
    console.log('acteved')
    document.querySelector('.scroll-bottom-icon').style.visibility = 'visible'
}


function sendMessage(e, user, socket) {
    e.preventDefault();
    scrollToBottom()
    messageInput = document.querySelector('.chat-message-input');
    if (messageInput.value.length > 500 || messageInput.value.trim() == '') return;
    appendMyMessage(messageInput.value)
    socket.emit('send-message', {
        id: user.userid,
        name: user.full_name,
        message: messageInput.value,
        image: user.user_image
    })
    messageInput.value = '';
}

function scrollToBottom() {
    const container = document.querySelector('.chat-messages')
    container.scrollTop = (container.scrollHeight)
}

function appendOthersMessage(messageTextValue, name, id, pic, date) {
    const message = document.createElement('div');
    message.className = 'chat-message';

    const userMessageImage = document.createElement('img');
    if (!pic || pic.toString().trim() == '') userMessageImage.setAttribute('src', '/file_system/app/user_default.jpg')
    else userMessageImage.setAttribute('src', `/file_system/user/${pic}`)
    userMessageImage.className = 'chat-user-image'
    userMessageImage.addEventListener('click', () => window.location.href = `/profile/${id}`)
    
    const userName = document.createElement('p')
    userName.className = 'chat-user-name'
    userName.innerText = name;
    userName.addEventListener("click", () => { 
        window.location.href = `/profile/${id}`
    })
    const messageText = document.createElement('p')
    messageText.className = 'chat-message-text'
    messageText.innerText = messageTextValue;

    const chatTime = document.createElement('p')
    chatTime.className = 'chat-time'
    const day = date.toString().substring(8, 10)
    const month = convertNumberToMonth(Number(date.toString().substring(5, 7)))
    const year = date.toString().substring(0, 4)
    const time = date.toString().substring(11, 16)
    const finalDate = `${day} de ${month} de ${year} às ${time}`
    chatTime.innerText = finalDate;

    const emptyDivJustForFlexPurposes = document.createElement('div');
    emptyDivJustForFlexPurposes.append(userName)
    emptyDivJustForFlexPurposes.append(messageText)
    emptyDivJustForFlexPurposes.append(chatTime)
    emptyDivJustForFlexPurposes.className='emptyDivJustForFlexPurposes'
    message.append(userMessageImage)
    message.append(emptyDivJustForFlexPurposes)
    document.querySelector('.chat-messages').append(message);
}


function appendMyMessage(message) {
    const date = new Date()
    date.setHours(date.getHours() - 3)

    const myMessage = document.createElement('p')
    myMessage.innerText = message
    myMessage.className = 'chat-message-text'

    const myTime = document.createElement('p')
   
    console.log(date)
    const day = date.toString().substring(8, 10)
    const month = convertNumberToMonth(Number(date.getMonth() + 1))
   
    const year = date.toString().substring(0, 4)
    const time = date.toString().substring(11, 16)
    const finalDate = `${date.getDate()} de ${month} de ${date.getFullYear()} às ${date.getHours() + 3}:${date.getMinutes()}`

    myTime.innerText = finalDate
    myTime.className = 'chat-time'
    
    const myChatMessage = document.createElement('div')
    myChatMessage.className = 'my-chat-message'
    myChatMessage.append(myMessage)
    myChatMessage.append(myTime)

    document.querySelector('.chat-messages').append(myChatMessage);
}

function appendSystemMessage(message) {
    const date = new Date()
    const myMessage = document.createElement('p')
    myMessage.innerText = message
    myMessage.className = 'chat-message-text'

    const myTime = document.createElement('p')
    myTime.innerText = date.setHours(date.getHours() - 3)
    myTime.innerText = date.toString().substring(0, 10) 
    myTime.className = 'chat-time'
    
    const myChatMessage = document.createElement('div')
    myChatMessage.className = 'system-message'
    myChatMessage.append(myMessage)
    // myChatMessage.append(myTime)

    document.querySelector('.chat-messages').append(myChatMessage);
}

function appendLastMessages(userid, message) {
    if (userid == message.id) {
        appendMyMessage(message.message)
    } else {
        appendOthersMessage(message.message, message.name, message.id, message.image, message.date);
    }
}




function convertNumberToMonth(month_number) {
    const months = new Array("Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro");
    return months[month_number - 1]
}