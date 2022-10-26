const BASE_URL_PATH = 'http://localhost:3000/'

window.onload = async () => {
    fixGenderAndBirthDateFormat()
    
    
    const productsData = await getUserProducts();
    console.log(productsData)
    if (productsData.length == 0) displayEmpty();
    else {
        displayProducts(productsData);
    }



    //Referente a Se o usuario esta logado ou nao --------------------------------------------
    const headerCircle = document.querySelector('.header-circle');
    const headerPainel = document.querySelector('.header-painel');
    const headerLogoutButton = document.querySelector('.logout-btn');

    if (getStoredToken()) {
      const res = await fetch(`${BASE_URL_PATH}auth`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: getStoredToken(),
          required_info: "*",
        },
    });
        const data = await res.json();
        console.log(data)
        if (data.auth) {
            console.log('tem')
            fitUserTokenImageInHeader(headerCircle, data.fullUser);
            headerCircle.addEventListener('click', () => toggleHeaderPainel(headerPainel))
            headerLogoutButton.addEventListener('click', logout);
            headerCircle.style.visibility = "visible";
        } else {
            console.log('n tem')
        }
    }
}
  
function getStoredToken() {
    return window.localStorage.getItem("token") || null; //tokenInfo
}

function fitUserTokenImageInHeader(headerElement, userData) {
    console.log('image ' + userData.user_image)
    if (userData.user_image) {
        console.log('running')
        const src = `${BASE_URL_PATH}file_system/user/${userData.user_image}`
        headerElement.setAttribute('src', src);
    } else {
        const alternativeSrc = `${BASE_URL_PATH}file_system/app/default_user_image.png`
        console.log(alternativeSrc)
        headerElement.setAttribute('src', alternativeSrc);
    }
}


function toggleHeaderPainel(PainelElement) {
    PainelElement.style.visibility = PainelElement.style.visibility == "hidden" ? "visible" : "hidden";
}

function logout() {
    window.localStorage.removeItem('token')
    window.location.reload();
}



window.onscroll = async () => { 
    
   
}

async function getUserProducts() {
    const userid = document.getElementById('userid').getAttribute('userid');
    
    //fituserimage
    const userimage = document.getElementById('userimage').getAttribute('userimage')
    const profileImage = document.querySelector('.profile-user-image')

    if (userimage) profileImage.setAttribute('src', `${BASE_URL_PATH}file_system/user/${userimage}`)
    else profileImage.setAttribute('src', `${BASE_URL_PATH}file_system/app/default_user_image.png`);

    const res = await fetch(`${BASE_URL_PATH}getprodutosfromuser/${userid}`)
    const data = await res.json();
    return data;
}

function displayProducts(productsData) {
    const productsContainer = document.querySelector('.mais-produtos-container');
    productsData?.map(product => { 
        const card = createProductCard(product);
        productsContainer.append(card)
    })
}

function createProductCard(product) {
    console.log(product)
    const card = document.createElement('div')
    card.className = 'card-container';
    // card.addEventListener('click', () => /* */ redirecionar())

    const card_first = document.createElement('div')
    card_first.className = 'card-first'
    card_first.style.backgroundImage = `url(${BASE_URL_PATH}file_system/product/${product.product_image})`

    const card_title = document.createElement('h2');
    card_title.className = 'card-title'
    card_title.innerHTML = product.product_name

    const card_second = document.createElement('div')
    card_second.className = 'card-second'

    const card_text = document.createElement('p')
    card_text.innerHTML = product.product_description

    card_first.append(card_title)
    card_second.append(card_text)
   
    card.append(card_first);
    card.append(card_second);
    return card;
}


function fixGenderAndBirthDateFormat() {
    const gender = document.getElementById('genero')
    const genderNumber = Number(gender.innerText)
    if (genderNumber == 0) gender.innerText = "Outro"
    if (genderNumber == 1) gender.innerText = "Masculino"
    if (genderNumber == 2) gender.innerText = "Feminino"

    // calcula nao precisamente a idade...
    const age = document.getElementById('idade')
    const year = Number(age.innerText.substring(11, 15))
    const currentYear = Number(new Date().getFullYear());
    age.innerText = currentYear - year;
}

function displayEmpty() {
    const productsContainer = document.querySelector('.mais-produtos-container');
    const emptyContainer = createEmptyItem();
    console.log('empty ', emptyContainer)
    productsContainer.append(emptyContainer);

    document.querySelector('.mais-produtos-container').style.display = 'flex';
}

function createEmptyItem() {
    const div = document.createElement('div');
    div.className = 'empty-container'

    const emptyBoxImage = document.createElement('img');
    emptyBoxImage.setAttribute('src', `${BASE_URL_PATH}file_system/app/empty_box.png`)
    emptyBoxImage.className = 'empty-box-img'
    
    const message = document.createElement('h2');
    message.innerText = 'Este Produtor não possui mais produtos...';
    message.className = 'empty-message'

    div.append(emptyBoxImage)
    div.append(message)
    return div;
}