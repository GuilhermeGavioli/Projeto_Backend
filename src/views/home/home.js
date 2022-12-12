
const BASE_URL_PATH =  'http://localhost:3000/'

let isAuthenticated = false;
window.onload = async () => {
  // const header = document.querySelector(".header");
  const headerPainel = document.querySelector('.header-painel');

  const headerHomeText = document.getElementById('nav-item-home')
  paintHeader(headerHomeText)

  



  
 

  setInterval(() => {
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

  if (data) {
    isAuthenticated = true;
  }
  
  
  const productData = await handleCardsDisplayOnLoad();
  console.log(productData)
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
  window.location.href = `${BASE_URL_PATH}acharprodutos?search=${typedValue}&pack=${1}`
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
  // a b c
  // 1 2
  let productID = 0;
  data.map(product => {

      // cartIdsItems.every(cartItem => {
      //   if (product.product_id == cartItem.product.product_id) {
    const cardContainer = createProductCard(product, productID);
    container.append(cardContainer);
    productID++
          // return false;
        // }
      // })
    
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



// <div class="cards-slide-block">
// <div class="card-container">
//    <div class="card-first-and-second">
//        <img
//        class="card-first" 
//    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrl5VNsAGTXvsPRCvudGWRM9FNhgBgn9ln4zkE90dfqEEcnX-rcPWn&usqp=CAE&s"></img>
// <div class="card-second">
//    <h2 class="card-title" style="margin: 0;">Meu Produto top de mais hleo okdkoa pdkdpka coda pck</h2>
//    <p class="card-tags" style="margin-top:5px;">Fresco - Organico - Natural - ZeroAcucar - Sem Gordura</p>
//    <p class="card-tags" style="margin-bottom: 15px;"> Venda por unidade</p>
//    <div style="display: flex; width: 100%; justify-content: space-between; align-items: center; margin: 12px 0 8px 0;">
//        <div class="card-stars">
//            <i class="fa-solid fa-heart" style="margin:0;"></i>
//            <p style="margin:0; margin-left: 6px;">4</p>
//    </div>
//    <p class="card-price">
//        R$10.50
//    </p>
// </div>
//    <div style="display: flex; width: 100%; justify-content: space-between;">
//        <button class="heart-card-button"><i class="fa-regular fa-heart"></i></button>
//        <button class="card-button">Adicionar ao Carrinho</button>
//    </div>
// </div>
// </div>
//    <div class="card-complement">
//    <div class="card-complement-first">
//        <p style="margin:0;">Orgânico</p>
//    </div>
//    <div class="card-complement-second">
//        <i class="fa-solid fa-check"></i>
//    </div>
// </div> 
// </div>
// </div>
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

      const data = await addToCart(cardID); // pid
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


function goToProduct(id) {
  window.location.href = `${BASE_URL_PATH_AUTH}produto/${id}`
}