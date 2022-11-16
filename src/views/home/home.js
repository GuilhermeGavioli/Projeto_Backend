const BASE_URL_PATH =  'http://localhost:3000/'


window.onload = async () => {
  // const header = document.querySelector(".header");
  const headerPainel = document.querySelector('.header-painel');
  // const main = document.querySelector(".container");
  // const spinner = document.getElementById("spinning");

  // hideContent(header, main, spinner);

  // const headerCircle = document.querySelector('.header-user-icon')
  // const headerPainel = document.querySelector('.header-painel');
  // const headerLogoutButton = document.querySelector('.logout-btn');

  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');


  const productData = await handleCardsDisplayOnLoad();
  await fitProductsDataInHome(productData);

  
 

  document.querySelector('.banner-container').addEventListener('click', () => { 
    closeSidebar()
   
    
  })
}

document.querySelector('.search-btn').addEventListener('click', (e) => { 
  e.preventDefault();
  searchProducts();
})
// http://localhost:3000/getprodutos?queryDescriptionAlso=true&number=0&nomeProduto=a

function searchProducts() {
  const typedValue = document.querySelector('.main-input').value
  window.location.href = `${BASE_URL_PATH}getprodutos?queryDescriptionAlso=true&number=0&nomeProduto=${typedValue}`
}


async function handleCardsDisplayOnLoad(){
  const res = await fetch(`${BASE_URL_PATH}getprodutos/?nomeProduto=as&queryDescriptionAlso=true&number=${1}`);
  return await res.json();
}

async function fitProductsDataInHome(data){
  appendOnPage(data)  
}


function appendOnPage(data) {
  let cont = 0;
  const container = document.querySelector('.c3')
  data.map(item => {
    if (cont > 0) { 
      const cardContainer = createProductCard(item);
      container.append(cardContainer);
    }
    cont++
  })
}


function createProductCard(item) {
  if (!item) return;

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container'
  cardContainer.setAttribute('product-id', item.product_id)
  cardContainer.addEventListener('click', (e) => { 
    window.location.href = `/produto/${e.target.getAttribute('product-id')}`
  })
  
  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', `${BASE_URL_PATH}file_system/product/${item.product_image}`);
  cardImage.className = 'card-first'

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title'
  cardTitle.innerText = item.product_name;

  const cardSecond = document.createElement('div');
  cardSecond.className = 'card-second';
  cardSecond.innerText = item.product_description;

  cardContainer.append(cardImage);
  cardContainer.append(cardTitle);
  cardContainer.append(cardSecond);
  return cardContainer;
}



