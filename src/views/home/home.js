const BASE_URL_PATH =  'http://localhost:3000/'


window.onload = async () => {
  // const header = document.querySelector(".header");
  const headerPainel = document.querySelector('.header-painel');

  const headerHomeText = document.getElementById('nav-item-home')
  paintHeader(headerHomeText)





  
 

  setInterval(() => {
    console.log('hi')
    changeHomeBannerState();
    changeBannerElement();
  }, 15000)

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

let bannerState = 3;
function changeHomeBannerState(numberClicked) {
  console.log(bannerState)
  if (numberClicked) return bannerState = numberClicked;
  if (bannerState == 3) bannerState = 1
  else bannerState++;
}

function changeBannerElement() {
  const banner = document.querySelector('.banner')
  banner.style.opacity = '40%'

  setTimeout(() => {
    
    if (bannerState == 1) {
      banner.style.backgroundImage = "url('https://images.pexels.com/photos/35196/water-plant-green-fine-layers.jpg?auto=compress&cs=tinysrgb&w=600')"
      
  }
  
  if (bannerState == 2) { 
    banner.style.backgroundImage = "url('https://images.unsplash.com/photo-1650343403040-f312b05c4995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzB8fG9yZ2FuaWN8ZW58MHwwfDB8Z3JlZW58&auto=format&fit=crop&w=500&q=60')"
  }

  if (bannerState == 3) { 
    banner.style.backgroundImage = "url('https://images.pexels.com/photos/10601784/pexels-photo-10601784.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load')"
  }
}, 1000);
  banner.style.opacity = '100%'
}

function searchProducts() {
  const typedValue = document.querySelector('.main-input').value
  window.location.href = `${BASE_URL_PATH}getprodutos?queryDescriptionAlso=true&pack=${1}&nomeProduto=${typedValue}&category=todos`
}


async function handleCardsDisplayOnLoad(){
  const res = await fetch(`${BASE_URL_PATH}getrandomproducts/19`);
  return await res.json();
}

async function fitProductsDataInHome(data){
  appendOnPage(data)
}


function appendOnPage(data) {
  const container = document.querySelector('.cards-slide-grid-container')
  data.map(item => {
      const cardContainer = createProductCard(item);
      container.append(cardContainer);
  })
}

// cards-slide-block
{/* <div class="card-container" >
        <img
        class="card-first" 
        src="../assets/6871551_29406_-_Copia-removebg-preview-removebg-preview.png">
    </img>
    <div class="card-second">
        <h2 class="card-title" style="margin: 0;">Meu Produto top de mais</h2>
        <p class="card-tags">
            Fresco - Organico - Natural - ZeroAcucar - Sem Gordura
        </p>
        <div class="card-stars">
                <i class="fa-solid fa-star" style="margin:0;"></i>
                <i class="fa-solid fa-star" style="margin:0;"></i>
                <i class="fa-solid fa-star" style="margin:0;"></i>
                <i class="fa-solid fa-star" style="margin:0;"></i>
            <i class="fa-solid fa-star" style="margin:0;"></i>
        </div>

        <p style="margin:0; font-size:.6em;"><i class="fa-solid fa-check" style="margin:0;"></i> organico</p>

        <p class="card-price">
            R$10.50
        </p>
        <p style="margin:0; font-size:.5em">
            Criado em setembro de 2022
        </p>
    </div>
</div> */}

function createProductCard(item) {
  if (!item) return;

  const cardContainerMaster = document.createElement('div');
  cardContainerMaster.className = 'cards-slide-block'

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container'
  cardContainer.setAttribute('product-id', item.product_id)
  cardContainer.addEventListener('click', (e) => { 
    window.location.href = `/produto/${e.target.getAttribute('product-id')}`
  })
  
  const cardFirst = document.createElement('img');
  cardFirst.setAttribute('src', `${BASE_URL_PATH}file_system/product/${item.product_image}`);
  cardFirst.className = 'card-first'

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title'
  cardTitle.style = 'margin: 0;'
  cardTitle.innerText = item.product_name;
  
  const cardTags = document.createElement('p');
  cardTags.className = 'card-tags'
  cardTags.innerText = `${item.tags}`

  const cardStars = document.createElement('div');
  cardStars.className = 'card-stars'
  handleAverage(cardStars, item.average)
  
  
  const cardCategory = document.createElement('p');
  cardCategory.innerText = item.is_organic

  const cardIsOrganic = document.createElement('p');
  cardIsOrganic.style = 'margin:0; font-size:.6em;'
  if (cardIsOrganic == 0) cardIsOrganic.innerHTML = '<i class="fa-solid fa-check" style="margin:0;"></i> organico'
  else cardIsOrganic.innerHTML = '<i class="fa-solid fa-x" style="margin:0;"></i> organico'


  
  const cardPrice = document.createElement('p');
  cardPrice.className = 'card-price'
  cardPrice.innerText = `R$${item.price}/ ${item.unity}`
  
  const cardCreatedAt = document.createElement('p');
  cardCreatedAt.className = 'card-created-at'
  cardCreatedAt.innerText = `${item.created_at}`

  const cardSecond = document.createElement('div');
  cardSecond.className = 'card-second';

  cardSecond.append(cardTitle)
  cardSecond.append(cardStars)
  cardSecond.append(cardTags)
  cardSecond.append(cardPrice)
  cardSecond.append(cardIsOrganic)
  cardSecond.append(cardCreatedAt)


  cardContainer.append(cardFirst);
  cardContainer.append(cardSecond);
  cardContainerMaster.append(cardContainer)
  return cardContainerMaster;
}

function handleAverage(parentElement, number) {
  if (!number) {
    parentElement.innerHTML = '<i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i>'
  }
}







// here
let current = 0;

document.querySelector('.foward-btn').addEventListener('click', () => { 
    const measuresObject = slide();
    slideFoward(measuresObject)

})
document.querySelector('.backward-btn').addEventListener('click', () => { 
    const measuresObject = slide();
    slideBackward(measuresObject)
})



function getBlocksAmount() {
    return document.querySelector('.cards-slide-grid-container').childElementCount
}

function slide(){
    const blocksAmount = getBlocksAmount();
    const containerWidth =  document.querySelector('.cards-slide-inside-container').getBoundingClientRect().width
    const blockWidth =  document.querySelector('.cards-slide-block').getBoundingClientRect().width
    const howManyBlocksfitIn = containerWidth / blockWidth
    return { blocksAmount, containerWidth, blockWidth, howManyBlocksfitIn }
}

function slideFoward(measuresObject) {
    console.log(current)
    const maximumOfFowardSlides = (measuresObject.blocksAmount / measuresObject.howManyBlocksfitIn) - 1
    if (current >= maximumOfFowardSlides) return
    const toBeWalked = measuresObject.howManyBlocksfitIn * measuresObject.blockWidth
    slideRight(toBeWalked);
    current++;
}

function slideRight(toBeWalked){
    const gridContainer =  document.querySelector('.cards-slide-grid-container')
    const currentLeft = Number(gridContainer.style.left.toString().replace('px', ''));
    gridContainer.style.left = `-${toBeWalked - currentLeft}px`
}


function slideBackward(measuresObject) {
    console.log(current)
    if (current == 0) return;
    const toBeWalked = measuresObject.howManyBlocksfitIn * measuresObject.blockWidth
    slideLeft(toBeWalked);
    current--;
}

function slideLeft(toBeWalked){
    const gridContainer = document.querySelector('.cards-slide-grid-container');
    const currentLeft = Number(gridContainer.style.left.toString().replace('px', ''));
    gridContainer.style.left = `${toBeWalked + currentLeft}px`
}


window.onresize = () => { 
    const gridContainer = document.querySelector('.cards-slide-grid-container');
    gridContainer.style.left = '0px'
    current = 0;
}