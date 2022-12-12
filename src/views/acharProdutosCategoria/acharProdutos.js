
let isAuthenticated;
const BASE_URL_PATH =  'http://localhost:3000/'
let fetchCont = 0;
let isOver = false;

window.onload = async () => {
 
  const headerProdutosText = document.getElementById('nav-item-produtos')
  paintHeader(headerProdutosText)
  
  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const packParam = urlParams.get('pack')
  const categoryParam = urlParams.get('categoria')


  
  if (data) {
    isAuthenticated = true;
  }
  
  const res = await fetch(`${BASE_URL_PATH}getprodutosporcategoria?categoria=${categoryParam}&pack=${packParam}`);
  const productsFound = await res.json();
  console.log(productsFound)

  const cardContainer = document.querySelector('.c1')
  const resultadosTextElement = document.querySelector('.resultados-text')
  let productsTotal;

  if (productsFound.length > 0) {
    productsTotal = productsFound[0].total
    resultadosTextElement.innerText = (productsFound[0].total) + ' Produtos encontrados'
    productsFound.map(product => { 
      const productCard = createProductCard(product)
      cardContainer.append(productCard)
    })
    
  } else {
    document.querySelector('.product-not-found').style.display = 'flex';
    document.querySelector('.categories').style.display = 'none'
  }
  // const productsfound = document.getElementById('product_found').getAttribute('product_found')
  // console.log('aaa' + JSON.stringify(productsfound[0]))

  if (productsTotal > 12) {
    handlePaginationcreation(productsTotal);
    paintPaginationButton(packParam);
  }

  
 

  // const categoryParam = urlParams.get('category')

  // const c1 = document.querySelector('.c1')

  // addCategoriesRedirectEventOnClick(searchedProductParam, categoryParam);


  
  // if (!searchedProductParam || searchedProductParam.trim() == '') {
  //   resultadosTextElement.innerText = c1.childElementCount - 1 + " de " + productsTotal + ' resultados em ' + categoryParam
  // } else {
    
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
  


function addCategoriesRedirectEventOnClick(searchedProduct, category) {
  Array.from(document.querySelectorAll('.category-circle')).map(element => { 
    const category = element.getAttribute('category')
    element.addEventListener('click', () => { 
      window.location.href = `/getprodutos?queryDescriptionAlso=true&pack=1&nomeProduto=${searchedProduct}&category=${category}`
    })
  })
}
// function paintCategory(category) {
//   const selectedCategory = document.createElement('div');
//   selectedCategory.className = 'selected-category';
//   if (category == "todos") document.getElementById('todos-category').append(selectedCategory);
//   if (category == "vegetais") document.getElementById('vegetais-category').append(selectedCategory);
//   if (category == "frutas") document.getElementById('frutas-category').append(selectedCategory);
//   if (category == "carnes") document.getElementById('carnes-category').append(selectedCategory);
//   if (category == "laticinios") document.getElementById('laticinios-category').append(selectedCategory);
//   if (category == "sementes") document.getElementById('sementes-category').append(selectedCategory);
//   if (category == "graos") document.getElementById('graos-category').append(selectedCategory);
//   if (category == "fertilizantes") document.getElementById('fertilizantes-category').append(selectedCategory);
//   if (category == "outros") document.getElementById('outros-category').append(selectedCategory);
  
  
// }

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
  const numberOfPages = Math.ceil(total / 12) - 1;
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
    // const res = await fetch(`${BASE_URL_PATH}getprodutosporcategoria?categoria=${categoryParam}&pack=${packParam}`);
    paginationItem.addEventListener('click', () => window.location.href = `${newPath}`)
    
    paginationItem.className = 'pagination-block';
    paginationItem.innerText = i;
    paginationContainer.append(paginationItem);
  }

  paginationContainer.append(afterBlock)
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
  console.log('d' + data)
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

  let filtered = [];
  let filteredLikes = [];


  if (isAuthenticated) {
    filtered = cartIdsItems.filter(cartItem => {
      return cartItem.product.product_id == item.product_id;
    })

    filteredLikes = myLikes.filter(like => { 
      return like.product_id == item.product_id;
    })
  }

  const cardStarsAndPrice = document.createElement('div');
  cardStarsAndPrice.style='display: flex; width: 100%; justify-content: space-between; align-items: center; margin: 12px 0 8px 0;'

  let p_current_average = item.average
  const cardStars = document.createElement('div');
  cardStars.className = 'card-stars'
  if (item.average) {
    cardStars.innerHTML = `<i class="fa-solid fa-heart" style="margin:0;"></i><p style="margin:0; margin-left: 6px;">${item.average}</p>`
  } else {
    cardStars.innerHTML = `<i class="fa-solid fa-heart" style="margin:0;"></i><p style="margin:0; margin-left: 6px;">0</p>`
  }



  const cardContainerMaster = document.createElement('div');
  cardContainerMaster.className = 'cards-slide-block'
  // cardContainerMaster.addEventListener('click', () => goToProduct(item.product_id))
  cardContainerMaster.addEventListener('click', async () => {
    // await likeProduct(item.product_id)
  })

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container'
  cardContainer.setAttribute('product-id', item.product_id)
  // cardContainer.setAttribute('product-id', item.product_id)

  const removeButton = document.createElement('button')
  removeButton.id = 'remove-button'
  removeButton.innerText = 'Remover do Carrinho'

  const cardButton = document.createElement('button')
  cardButton.className = 'card-button'
  cardButton.innerText = 'Adicionar ao carrinho'

  const likeIcon = document.createElement('i')
  likeIcon.style.pointerEvents = 'none'
  // likeIcon.className = 'fa-regular fa-thumbs-up'
  likeIcon.className = 'fa-solid fa-heart'
  
  const LikeButton = document.createElement('button')
  LikeButton.className = 'like-button'
  LikeButton.append(likeIcon)

  const likeIcon2 = document.createElement('i')
  likeIcon2.style.pointerEvents = 'none'
  likeIcon2.className = 'fa-regular fa-heart'

  const DislikeButton = document.createElement('button')
  DislikeButton.className = 'dislike-button'
  DislikeButton.append(likeIcon2)
  
  
  //hide cart remove/add button
  if (filtered.length > 0) {
    cardContainer.setAttribute('isOnCart', true);
    cardButton.style.display = 'none';
    // cardButton.style.visibility = 'hidden';

    removeButton.style.display = 'unset';
    // removeButton.style.visibility = 'visible';
  } else {
    cardContainer.setAttribute('isOnCart', false);
    cardButton.style.display = 'unset';
    // cardButton.style.visibility = 'visible';

    removeButton.style.display = 'none';
    // removeButton.style.visibility = 'hidden';
  }
  
  
  //hide cart remove/add button
  if (filteredLikes.length > 0) { 
    cardContainer.setAttribute('isLiked', 'true');
    LikeButton.style.display = 'none';
    DislikeButton.style.display = 'unset';
  } else {
    cardContainer.setAttribute('isLiked', 'false');
    LikeButton.style.display = 'unset';
    DislikeButton.style.display = 'none';
  }


  //hide cart like/dislike button


  //hide cart like/dislike button

  if (!isAuthenticated) {
      cardButton.addEventListener('click', () => window.location.href = '/login')
      LikeButton.addEventListener('click', () => window.location.href = '/login')
  } else {
      
    LikeButton.addEventListener('click', async (e) => {
      console.log('clicked')
      const data = await likeProduct(item.product_id);
      if (data.liked) {
        cardContainer.setAttribute('isLiked', 'true')
        
        DislikeButton.style.display = 'unset'
        e.target.style.display = 'none';
        // cardStars.remove();
        
        p_current_average ++
        cardStars.innerHTML = `<i class="fa-solid fa-heart" style="margin:0;"></i><p style="margin:0; margin-left: 6px;">${p_current_average}</p>`
        console.log('here')
      }
    })
    
    DislikeButton.addEventListener('click', async (e) => { 
      const data = await dislikeProduct(item.product_id);
      if(data.disliked){
        cardContainer.setAttribute('isLiked', 'false')
        LikeButton.style.display = 'unset';
        e.target.style.display = 'none';
        p_current_average --
        cardStars.innerHTML = `<i class="fa-solid fa-heart" style="margin:0;"></i><p style="margin:0; margin-left: 6px;">${p_current_average}</p>`
      }
   })

    cardButton.addEventListener('click', async (e) => {
      const cardID = cardContainer.getAttribute('product-id')
    if (cardContainer.getAttribute('isOnCart') == 'true') return

      const data = await addToCart(cardID);
      if (data.saved) {
    
        updateCart('add', data.savedItem.cart_id, item)
        console.log(cartIdsItems)
        
        cardContainer.setAttribute('isOnCart', 'true')
        removeButton.style.display = 'unset';
        e.target.style.display = 'none';
      } else {
        console.log('not saved')
        return
      }
      console.log('added')
    })


    removeButton.addEventListener('click', (e) => { 
      if (cardContainer.getAttribute('isOnCart') == 'false') return
      cartIdsItems.map(async (cartItem) => {
        const cardID = cardContainer.getAttribute('product-id')
        if (cartItem.product.product_id == cardID) {
          console.log('cardid', cardID)
          console.log('deleting')
          const wasDeleted = await deleteFromCart(cartItem.cart);
          if (wasDeleted) {
            console.log('deleted')
            console.log(cartItem)
            console.log('cartItem.product.cartid ' + cartItem.cart)
            updateCart('remove', cartItem.cart, null) 
            cardButton.style.display = 'unset';
            e.target.style.display = 'none';
            cardContainer.setAttribute('isOnCart', 'false')
          }
        }
      })
    })


  }

  
  const cardFirstAndSecond = document.createElement('div');
  cardFirstAndSecond.className = 'card-first-and-second'

  const cardFirst = document.createElement('img');
  cardFirst.setAttribute('src', `${BASE_URL_PATH}file_system/product/${item.product_image}`);
  cardFirst.className = 'card-first'
  
  const cardSecond = document.createElement('div');
  cardSecond.className = 'card-second';

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title ellipsis-on-two-lines'
  cardTitle.innerText = item.product_name;

  const cardIsOrganic = document.createElement('p');

  
  const cardTags = document.createElement('p');
  if (cardIsOrganic == 0) cardTags.innerHTML = '<i class="fa-solid fa-check" style="margin:0;"></i> organico'
  else cardTags.innerHTML = '<i class="fa-solid fa-x" style="margin:0;"></i> organico'
  cardTags.className = 'card-tags ellipsis-on-two-lines'
  // cardTags.innerText = `${item.tags}`

  const organicAndLikeButton = document.createElement('div')
  organicAndLikeButton.style = 'display: flex; align-items: center; width: 100%; height: 50px; justify-content: space-between;'
  organicAndLikeButton.append(cardTags);
  organicAndLikeButton.append(LikeButton);
  organicAndLikeButton.append(DislikeButton);

 
  // handleAverage(cardStars, item.average)

  const cardFirstTop = document.createElement('div')
  cardFirstTop.append(cardTitle)
  // cardFirstTop.append(cardTags)

  const cardFirstBottom = document.createElement('div')
  cardFirstBottom.style = 'width: 100%; '

  
                      
  const verMais = document.createElement('div')
  verMais.innerHTML = `<a href="/produto/${item.product_id}">Ver mais</p>`
  verMais.style = 'text-align: end; margin-top: 8px;'

  // cardFirstBottom.append(LikeButton)
  // cardFirstBottom.append(DislikeButton)
  
  const cardPrice = document.createElement('p');
  cardPrice.className = 'card-price'
  cardPrice.innerText = `R$${item.price}`
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style = 'display: flex; width: 100%; justify-content: end; flex-direction: column; padding: 0'
  
  console.log('filtered ' + JSON.stringify(filtered))
  
  const cardComplement = document.createElement('div')
  cardComplement.className = 'card-complement'
  
  cardFirstBottom.append(organicAndLikeButton)
  cardFirstBottom.append(cardStarsAndPrice)
  cardFirstBottom.append(buttonsContainer)
  // cardFirstBottom.append(verMais)
  
  cardStarsAndPrice.append(cardStars)
  cardStarsAndPrice.append(cardPrice)

  // buttonsContainer.append(heartButton)
  buttonsContainer.append(removeButton)
  buttonsContainer.append(cardButton)
  buttonsContainer.append(verMais)
  
  const cardComplementSecond = document.createElement('div')
  cardComplementSecond.className = 'card-complement-second flex-center'
  
  const cardComplementFirst = document.createElement('div')
  cardComplementFirst.className = 'card-complement-first flex-center'
  if (item.organic) { 
    cardComplementFirst.innerHTML = '<p style="margin:0;">Orgânico</p>'
    cardComplementSecond.innerHTML = '<i class="fa-solid fa-check"></i>'
  } else {
    cardComplementFirst.innerHTML = '<p style="margin:0;">Não Orgânico</p>'
    cardComplementSecond.innerHTML = '<i class="fa-solid fa-xmark"></i>'
  }
  

  const cardCategory = document.createElement('p');
  cardCategory.innerText = item.is_organic


  
  const cardCreatedAt = document.createElement('p');
  cardCreatedAt.className = 'card-created-at'
  cardCreatedAt.innerText = `${item.created_at}`

  
  cardSecond.append(cardFirstTop)
  cardSecond.append(cardFirstBottom)

  // cardSecond.append(cardCreatedAt)
  
  cardFirstAndSecond.append(cardFirst)
  cardFirstAndSecond.append(cardSecond)

  cardComplement.append(cardComplementFirst)
  cardComplement.append(cardComplementSecond)

  cardContainer.append(cardFirstAndSecond);
  // cardContainer.append(cardComplement)
  cardContainerMaster.append(cardContainer)
  return cardContainerMaster;
}


function handleAverage(parentElement, number) {
  if (!number) {
    parentElement.innerHTML = '<i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i><i class="fa-regular fa-star" style="margin:0;"></i>'
  }
}


async function likeProduct(p_id) {
  const res = await fetch(`${BASE_URL_PATH_AUTH}likeproduct/${p_id}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
}

async function dislikeProduct(p_id) {
  const res = await fetch(`${BASE_URL_PATH_AUTH}dislikeproduct/${p_id}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
}
