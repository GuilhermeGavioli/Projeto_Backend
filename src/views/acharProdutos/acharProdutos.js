

const BASE_URL_PATH =  'http://localhost:3000/'
let fetchCont = 0;
let isOver = false;

window.onload = async () => {
  
  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');

  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const packparam = urlParams.get('pack')
  const searchedProductParam = urlParams.get('nomeProduto')

  const categoryParam = urlParams.get('category')
  const productsTotal = document.getElementById('product_total').getAttribute('product_total')
  const c1 = document.querySelector('.c1')

  addCategoriesRedirectEventOnClick(searchedProductParam, categoryParam);
  //resultados text
  const resultadosTextElement = document.querySelector('.resultados-text')
  resultadosTextElement.innerText = c1.childElementCount - 1 + " de " + productsTotal + ' resultados para "' + searchedProductParam + '"'
  
  //
  paintCategory(categoryParam);

  console.log('TOTAL ', productsTotal)
  if (productsTotal > 12) {
    handlePaginationcreation(productsTotal);
    paintPaginationButton(packparam);
  }

  // const queryParams = queryParamsString
  // .split('&')
  // .reduce((accumulator, singleQueryParam) => {
  //   const [key, value] = singleQueryParam.split('=');
  //   accumulator[key] = value;
  //   return accumulator;
  // }, {});
  // console.log(queryParams)

  // const queryParamsString = window.location.search.substring(1);

  // console.log(queryParamsString)
  
}

function addCategoriesRedirectEventOnClick(searchedProduct, category) {
  Array.from(document.querySelectorAll('.category-circle')).map(element => { 
    const category = element.getAttribute('category')
    element.addEventListener('click', () => { 
      window.location.href = `/getprodutos?queryDescriptionAlso=true&pack=1&nomeProduto=${searchedProduct}&category=${category}`
    })
  })
}
function paintCategory(category) {
  const selectedCategory = document.createElement('div');
  selectedCategory.className = 'selected-category';
  if (category == "todos") document.getElementById('todos-category').append(selectedCategory);
  if (category == "vegetais") document.getElementById('vegetais-category').append(selectedCategory);
  if (category == "frutas") document.getElementById('frutas-category').append(selectedCategory);
  if (category == "carnes") document.getElementById('carnes-category').append(selectedCategory);
  if (category == "laticinios") document.getElementById('laticinios-category').append(selectedCategory);
  if (category == "sementes") document.getElementById('sementes-category').append(selectedCategory);
  if (category == "graos") document.getElementById('graos-category').append(selectedCategory);
  if (category == "fertilizantes") document.getElementById('fertilizantes-category').append(selectedCategory);
  if (category == "outros") document.getElementById('outros-category').append(selectedCategory);
  
  
}

function getResultadosText() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('nomeProduto')
}

function paintPaginationButton(packNumber) {
  const paginationContainer = document.querySelector('.pagination-container')
  Array.from(paginationContainer.children).map(element => { 
    if (element.innerText == packNumber.toString()) { 
      element.className = 'selected-pagination-block';
    }
  })
  
}

function handlePaginationcreation(total) {
  if (total < 12) return
  const numberOfPages = Math.ceil(total / 12);
  createPagination(numberOfPages)
}

function createPagination(numberOfPages) {
  const paginationContainer = document.querySelector('.pagination-container')
  paginationContainer.style.visibility = 'visible'

  const beforeBlock = document.createElement('div')
  beforeBlock.className = 'pagination-block'
  beforeBlock.id = 'before-block'
  beforeBlock.innerText = 'Anterior'
  
  const afterBlock = document.createElement('div')
  afterBlock.className = 'pagination-block'
  afterBlock.id = 'after-block'
  afterBlock.innerText = 'Próximo'

  paginationContainer.append(beforeBlock)
  
  for (let i = 1; i < numberOfPages + 2; i++) {
    const paginationItem = document.createElement('div');



    const newPath = window.location.href.toString().replace(/\pack=.[0-9]*/g, `pack=${i}`)
   
    paginationItem.addEventListener('click', () => window.location.href = `${newPath}`)
    
    paginationItem.className = 'pagination-block';
    paginationItem.innerText = i;
    paginationContainer.append(paginationItem);
  }

  paginationContainer.append(afterBlock)
}

async function handlePermanentFetchingOnScroll() {
  const isInTheEnd = verifyScroll();
      if (isInTheEnd && !isOver) {
        const newProducts = await fetchMore(fetchCont);
        if (newProducts.length == 0) {
          console.log('No more products');
          isOver = true;
          return;
        }
        appendOnPage(newProducts);
        fetchCont = fetchCont + 8;
      }
}

  


function verifyScroll() {
  var scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)
  return window.scrollY === scrollMaxY;
}

// async function fetchMore(cont) {
//   const res = await fetch(`${BASE_URL_PATH}getprodutos/?nomeProduto=${"as"}&queryDescriptionAlso=true&number=${cont + 8}`);
//   return await res.json();
// }

function appendOnPage(data) {
  console.log(data)
  const container = document.querySelector('.c1')
  console.log(data.length)
  console.log('fetchcont ' + fetchCont)
  let cont = 0;
  console.log(data.length)
  data.map(item => {
    if (cont > (data.length - 8)) { 
      const cardContainer = createProductCard(item);
      container.append(cardContainer);
    }
    cont++
  })
}


// function createProductCard(item) {
//   if (!item) return;

//   const cardContainer = document.createElement('div');
//   cardContainer.className = 'card-container'
//   cardContainer.setAttribute('product-id', item.product_id)
//   cardContainer.addEventListener('click', (e) => { 
//     window.location.href = `/produto/${e.target.getAttribute('product-id')}`
//   })
  
//   const cardImage = document.createElement('img');
//   cardImage.setAttribute('src', `${BASE_URL_PATH}file_system/product/${item.product_image}`);
//   cardImage.className = 'card-first'

//   const cardTitle = document.createElement('h2');
//   cardTitle.className = 'card-title'
//   cardTitle.innerText = item.product_name;

//   const cardSecond = document.createElement('div');
//   cardSecond.className = 'card-second';
//   cardSecond.innerText = item.product_description;

//   cardContainer.append(cardImage);
//   cardContainer.append(cardTitle);
//   cardContainer.append(cardSecond);
//   return cardContainer;
// }

function createProductCard(item) {
  if (!item) return;

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

