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
  window.location.href = `${BASE_URL_PATH}getprodutos?queryDescriptionAlso=true&pack=${1}&nomeProduto=${typedValue}`
}


async function handleCardsDisplayOnLoad(){
  const res = await fetch(`${BASE_URL_PATH}getprodutos/?nomeProduto=as&queryDescriptionAlso=true&number=${8}`);
  return await res.json();
}

async function fitProductsDataInHome(data){
  appendOnPage(data)
  console.log(data)
}


function appendOnPage(data) {
  const container = document.querySelector('.c10-main-inside')
  data.map(item => {
      const cardContainer = createProductCard(item);
      container.append(cardContainer);
  })
}


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

  console.log('item', item)

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
  cardCreatedAt.style = 'margin:0; font-size:.5em'
  cardCreatedAt.innerText = `${item.created_at}`

  const cardSecond = document.createElement('div');
  cardSecond.className = 'card-second';

  cardSecond.append(cardTitle)
  cardSecond.append(cardTags)
  cardSecond.append(cardStars)
  cardSecond.append(cardIsOrganic)
  cardSecond.append(cardPrice)
  cardSecond.append(cardCreatedAt)


  cardContainer.append(cardFirst);
  cardContainer.append(cardSecond);
  return cardContainer;
}

function handleAverage(parentElement, number) {
  if (!number) {
    parentElement.innerHTML = '<i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i>'
  }
}

const c10main = document.querySelector('.c10-main')
// const viewableProductScreen = c10main.getBoundingClientRect().width;
const viewableProductScreen = c10main.clientWidth;
const walk =  window.innerWidth - 120
let currentSlider = 0

let total = 0
let sum = 0
const productsBar = document.querySelector('.c10-main-inside');
// Array.from(productsBar.children).map(element => {
//   total = total + element.getBoundingClientRect().width + 30
//   sum++
// })
// console.log(sum)
// console.log(total)
console.log(viewableProductScreen)
document.querySelector('.c10-right-arrow').addEventListener('click', () => { 
  // if (currentSlider <= (-1 * (walk * 3))) return;
  // if (currentSlider >= (total / 4)) return;
  currentSlider = currentSlider - (viewableProductScreen);
  productsBar.style.left = `${currentSlider}px`;
})


document.querySelector('.c10-left-arrow').addEventListener('click', () => {
  if (currentSlider == 0) return;
  currentSlider = currentSlider + viewableProductScreen;

  productsBar.style.left = `${currentSlider}px`;
})


