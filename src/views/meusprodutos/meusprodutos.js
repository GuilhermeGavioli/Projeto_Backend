const BASE_URL_PATH =  'http://localhost:3000/'


let isAuthenticated = false;
window.onload = async () => {

  const user = await handleUserFetchTokenData('redirect');

  if (user) isAuthenticated = true;

  const productsdata = await getMyProducst();

  if (!productsdata || productsdata.length == 0) document.querySelector('.product-not-found').style.display = 'unset'
  else  fitProductsDataInHome(productsdata)
}




async function getMyProducst() {
  const res = await fetch(`${BASE_URL_PATH_AUTH}getprodutosfromuser`, {
    method: "GET",
    headers: {
        "Content-type": "application/json",
        authorization: getStoredToken(),
        required_info: "",
    }
  })
  return await res.json();
}

async function fitProductsDataInHome(data){
  appendOnPage(data)
}

function appendOnPage(data) {
  const container = document.querySelector('.c1')
  data.map(item => {
    const cardContainer = createProductCard(item);
    container.append(cardContainer);
  })
}

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
  cardButton.innerText = 'Excluir Produto'

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
      const data = await deleteProduct(item.product_id)
    

     
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
  if (item.is_organic == 1) cardTags.innerHTML = '<i class="fa-solid fa-check" style="margin:0;"></i> Orgânico'
  else cardTags.innerHTML = '<i class="fa-solid fa-x" style="margin:0;"></i>Não Organico'
  cardTags.className = 'card-tags ellipsis-on-two-lines'
  // cardTags.innerText = `${item.tags}`

  const organicAndLikeButton = document.createElement('div')
  organicAndLikeButton.style = 'display: flex; align-items: center; width: 100%; height: 50px; justify-content: space-between;'
  organicAndLikeButton.append(cardTags);
  // organicAndLikeButton.append(LikeButton);
  // organicAndLikeButton.append(DislikeButton);

 
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
  // buttonsContainer.append(removeButton)
  buttonsContainer.append(cardButton)
  buttonsContainer.append(verMais)
  
  const cardComplementSecond = document.createElement('div')
  cardComplementSecond.className = 'card-complement-second flex-center'
  
  const cardComplementFirst = document.createElement('div')
  console.log(item)
  cardComplementFirst.className = 'card-complement-first flex-center'
  if (item.is_organic == 1) {
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

async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL_PATH_AUTH}deletarProduto/${id}`, {
    method: "POST",
    headers: {
        "Content-type": "application/json",
        authorization: getStoredToken(),
        required_info: "",
    }
  })
  const data = await res.json();
  if (!data.error) window.location.reload();
}


function getStoredToken() {
  return window.localStorage.getItem("token") || null;
}