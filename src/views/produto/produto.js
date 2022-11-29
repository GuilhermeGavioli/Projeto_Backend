const BASE_URL_PATH =  'http://localhost:3000/'
let fetchCont = 0;
let isOver = false;
let commentPack = 0

window.onload = async () => {
  
  const p_id = document.getElementById('product_id').getAttribute('product_id')
  const productRatings = await loadProductRatings(p_id)
  console.log('ratings ', productRatings)
  
  document.querySelector('.rating-counts').innerText = `(${productRatings.length} Avaliaçoes)`

  
  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
  console.log('data ' + JSON.stringify(data))
  await appendCommentsOnPage(productRatings, data?.userid)
  await handleSimilarProductsAppereance()

  if (data) { 
    const ratingInput = document.querySelector('.ratting-input')
    const ratingButton = document.querySelector('.ratting-btn')
    ratingInput.style.visibility = 'visible'
    ratingButton.style.visibility = 'visible'
    ratingButton.addEventListener('click', () => ratting(ratingInput))

    //stars
    for (let i = 1; i < 6; i++) { 
      document.getElementById(`star${i}`).addEventListener('click', () => handleCreateCommentStarsChange(i))
    }
  }


  document.getElementById('carregar-mais-btn').addEventListener('click', async () => {
    commentPack = commentPack + 2;

    const productRatings = await loadProductRatings(p_id)
    await appendCommentsOnPage(productRatings, data?.userid);
    console.log(commentPack)
    // await handleSimilarProductsAppereance()
   })

}

async function handleSimilarProductsAppereance() {
  const category = document.getElementById('product_category').getAttribute('product_category');
  const similarProducts = await fetchFourSimilarProducts(category); //by similar category
  console.log('similar ', similarProducts)
  appendSimilarProductsOnPage(similarProducts)
}

async function fetchFourSimilarProducts(category) {
  const res = await fetch(`${BASE_URL_PATH_AUTH}acharprodutoporcategoria/${4}/${category}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json",
    }
  })
  return await res.json();
}

function appendSimilarProductsOnPage(data) {
  const productsContainer = document.querySelector('.products')
  data.map(item => {
      const cardContainer = createProductCard(item);
      productsContainer.append(cardContainer);
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



async function appendCommentsOnPage(comments, userid) {
  const commentsContainer = document.querySelector('.comments')
  comments.map(async (comment) => { 
    const commentElement = await createCommentElement(comment, userid) 
    commentsContainer.append(commentElement);
  })
}

async function deleteComment(ratting_id) {
  const res = await fetch(`${BASE_URL_PATH_AUTH}deletaravaliacao/${ratting_id}`, {
    method: 'DELETE',
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
}


{/* <div class="comment-container">
<div class="comment-image-and-username-container">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Black_hole_-_Messier_87.jpg/1200px-Black_hole_-_Messier_87.jpg" alt="" class="comment-image">
    <p class="comment-username">Joao da Silva</p>
</div>
<div class="comment-stars-container">
    <i class="fa-solid fa-heart"></i>
    <i class="fa-solid fa-heart"></i>
    <i class="fa-solid fa-heart"></i>
    <i class="fa-regular fa-heart"></i>
    <i class="fa-regular fa-heart"></i>
</div>
<p class="comment-text">odiei essa merda de produto, nunca mais compro!</p>
<p class="comment-created-at">avaliado em 15 de novembro de 1999</p>
</div> */}
async function createCommentElement(comment, userid) {
  
  const commentContainer = document.createElement('div')
  commentContainer.className = 'comment-container'
  const imageAndUsername = document.createElement('div')
  imageAndUsername.className = 'comment-image-and-username-container'
  const commentImage = document.createElement('img')
  commentImage.className = 'comment-image'
  
  if (!comment.user_image || comment.user_image.trim() == '') {
    commentImage.setAttribute('src', '/file_system/app/user_default.jpg')
  } else {
    commentImage.setAttribute('src', `/file_system/user/${comment.user_image}`)
  }

  const starsContainer = document.createElement('div')
  starsContainer.className = 'comment-stars-container'
  await handleCommentStarsAllocation(starsContainer, comment.rating_stars)
   
  const commentUsername = document.createElement('p')
  commentUsername.className = 'comment-username';
  commentUsername.innerText = comment.full_name

  const commentText = document.createElement('p')
  commentText.className = 'comment-text'
  commentText.innerText = comment.comment
  
  const commentCreatedAt = document.createElement('p')
  commentCreatedAt.className = 'comment-created-at'
  const formatedDate = formatDate(comment.created_at)
  commentCreatedAt.innerText = "Avaliado em " + formatedDate;

  if (userid == comment.user_id) {
    const thrashContainer = document.createElement('div')
    thrashContainer.className = 'comment-thrash'
    thrashContainer.innerHTML = '<i class="fa-regular fa-trash-can"></i>'
    commentContainer.append(thrashContainer)
    thrashContainer.addEventListener('click', () => deleteComment(comment.ratting_id))
  }

  imageAndUsername.append(commentImage)
  imageAndUsername.append(commentUsername)
  commentContainer.append(imageAndUsername)
  commentContainer.append(starsContainer)
  commentContainer.append(commentText)
  commentContainer.append(commentCreatedAt)
  return commentContainer
  
}
function formatDate(date) {
  const month = convertNumberToMonth(date.substring(5, 7))
  return `${date.substring(8,10)} de ${month} de ${date.substring(0,4)}` 
}

async function handleCommentStarsAllocation(container, rating) {
  starNumber = Number(rating.toString().substring(0, 1))
  console.log(starNumber)
  if (starNumber == 1) {
    container.innerHTML = '<i class="fa-solid fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i>'
  } else if (starNumber == 2) {
    container.innerHTML = '<i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i>'
  } else if (starNumber == 3) {
    container.innerHTML = '<i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i>'
  } else if (starNumber == 4) {
    container.innerHTML = '<i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-regular fa-heart"></i>'
  } else if (starNumber == 5) {
    container.innerHTML = '<i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-heart"></i>'
  } else {
    container.innerHTML = '<i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i><i class="fa-regular fa-heart"></i>'
  }
}

function appendOnPage(data) {
  const container = document.querySelector('.c1')
  data.map(item => {
    const cardContainer = createProductCard(item);
    container.append(cardContainer);
  })
}




function handleAverage(parentElement, number) {
  if (!number) {
    parentElement.innerHTML = '<i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i>'
  }
  if (number == 1) {
    parentElement.innerHTML = '<i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i>'
  }
  if (number == 2) {
    parentElement.innerHTML = '<i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i>'
  }
  if (number == 3) {
    parentElement.innerHTML = '<i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i>'
  }
  if (number == 4) {
    parentElement.innerHTML = '<i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-regular fa-heart" style="margin:0;"></i>'
  }
  if (number == 5) {
    parentElement.innerHTML = '<i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i><i class="fa-solid fa-heart" style="margin:0;"></i>'
  }
}




{/* <input type="text" class="ratting-input"> */}
  {/* <button class="ratting-btn">rate</button> */}
  
// document.querySelector('.ratting-btn').addEventListener('click', async () => { 
//   const p_id = document.getElementById('product_id').getAttribute('product_id')
//   console.log(p_id)
//   const res = await fetch(`${BASE_URL_PATH_AUTH}avaliarproduto`, {
//     method: 'POST',
//     body: JSON.stringify({ p_id }),
//     headers: {
//       "Content-type": "application/json",
//       authorization: getStoredToken(),
//     }
//   })
//   const data = await res.json();
//   console.log(data)
// })

async function ratting(ratingInput) {
  const critic = ratingInput.value;
  const p_id = document.getElementById('product_id').getAttribute('product_id')
  const data = await fireRattingRequest(p_id, critic);
  console.log(data)
}

async function fireRattingRequest(p_id, critic) { 
  const res = await fetch(`${BASE_URL_PATH_AUTH}avaliarproduto`, {
    method: 'POST',
    body: JSON.stringify({p_id, critic}),
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
}

function handleCreateCommentStarsChange(starNumber) {
  const starsContainer = document.querySelector('.create-comment-stars-container');
  const star1 = document.getElementById('star1')
  const star2 = document.getElementById('star2')
  const star3 = document.getElementById('star3')
  const star4 = document.getElementById('star4')
  const star5 = document.getElementById('star5')
  
  while (starsContainer.hasChildNodes()) {
    starsContainer.removeChild(starsContainer.lastChild);
  }

  if (starNumber == 1) {
    starsContainer.innerHTML = '<i class="fa-solid fa-heart" id="star1"></i><i class="fa-regular fa-heart" id="star2"></i><i class="fa-regular fa-heart" id="star3"></i><i class="fa-regular fa-heart" id="star4"></i><i class="fa-regular fa-heart" id="star5"></i>'
  } else if (starNumber == 2) {
    starsContainer.innerHTML = '<i class="fa-solid fa-heart" id="star1"></i><i class="fa-solid fa-heart" id="star2"></i><i class="fa-regular fa-heart" id="star3"></i><i class="fa-regular fa-heart" id="star4"></i><i class="fa-regular fa-heart" id="star5"></i>'
  } else if (starNumber == 3) {
    starsContainer.innerHTML = '<i class="fa-solid fa-heart" id="star1"></i><i class="fa-solid fa-heart" id="star2"></i><i class="fa-solid fa-heart" id="star3"></i><i class="fa-regular fa-heart" id="star4"></i><i class="fa-regular fa-heart" id="star5"></i>'
  } else if (starNumber == 4) {
    starsContainer.innerHTML = '<i class="fa-solid fa-heart" id="star1"></i><i class="fa-solid fa-heart" id="star2"></i><i class="fa-solid fa-heart" id="star3"></i><i class="fa-solid fa-heart" id="star4"></i><i class="fa-regular fa-heart" id="star5"></i>'
  } else if (starNumber == 5) {
    starsContainer.innerHTML = '<i class="fa-solid fa-heart" id="star1"></i><i class="fa-solid fa-heart" id="star2"></i><i class="fa-solid fa-heart" id="star3"></i><i class="fa-solid fa-heart" id="star4"></i><i class="fa-solid fa-heart" id="star5"></i>'
  }

  for (let i = 1; i < 6; i++) { 
      document.getElementById(`star${i}`).addEventListener('click', () => handleCreateCommentStarsChange(i))
    }
}


// function getStoredToken() {
//   return window.localStorage.getItem("token") || null;
// }



async function loadProductRatings(p_id) {
  console.log('here ',commentPack)
  const res = await fetch(`${BASE_URL_PATH_AUTH}acharavaliacoes/${p_id}/${commentPack}`, {
    method: 'GET',
    // body: JSON.stringify({p_id, critic}),
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  
  return await res.json();
}