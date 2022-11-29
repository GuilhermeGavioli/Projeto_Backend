const BASE_URL_PATH =  'http://localhost:3000/'
let fetchCont = 0;
let isOver = false;

window.onload = async () => {
  
  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');

  const productsTotal = document.getElementById('product_total').getAttribute('product_total')
  console.log('TOTAL ', productsTotal)
  if (productsTotal > 12) {
    handlePaginationcreation(productsTotal);
  }

  // const dataLength = document.getElementById('data-length').getAttribute('dataLength');
  // if (Number(dataLength) == 0) { 
  //   const noResultsContainer = document.querySelector('.no-results-container');
  //   noResultsContainer.style.visibility = 'visible';
  // } else {
  //   window.onscroll = async () => {
  //     handlePermanentFetchingOnScroll();
  //   }
  // }

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
  
  for (let i = 1; i < numberOfPages + 1; i++) {
    const paginationItem = document.createElement('div');
   
    paginationItem.addEventListener('click', () => window.location.href = `${BASE_URL_PATH}getprodutos?queryDescriptionAlso=true&pack=${i}&nomeProduto=${"as"}`)
    
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

