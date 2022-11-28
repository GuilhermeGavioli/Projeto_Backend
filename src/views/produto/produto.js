const BASE_URL_PATH =  'http://localhost:3000/'
let fetchCont = 0;
let isOver = false;

window.onload = async () => {
  
  const p_id = document.getElementById('product_id').getAttribute('product_id')
  const productRatings = await loadProductRatings(p_id)
  console.log('ratings ', productRatings)
  
  document.querySelector('.rating-counts').innerText = `(${productRatings.length} avaliaçoes)`

  
  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
  console.log('data ' + JSON.stringify(data))
  
  appendCommentsOnPage(productRatings, data.userid || null)
  if (data) { 
    const ratingInput = document.querySelector('.ratting-input')
    const ratingButton = document.querySelector('.ratting-btn')
    ratingInput.style.visibility = 'visible'
    ratingButton.style.visibility = 'visible'
    ratingButton.addEventListener('click', () => ratting(ratingInput))
  }
  


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


function createProductCard(item) {
  if (!item) return;

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container'
  cardContainer.setAttribute('product-id', item.product_id)
  
  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', `${BASE_URL_PATH}file_system/product/${item.product_image}`);
  cardImage.className = 'card-first'

  const cardTitle = document.createElement('h2');
  cardTitle.innerText = item.product_name;

  const cardSecond = document.createElement('div');
  cardSecond.className = 'card-second';
  cardSecond.innerText = item.product_description;

  cardImage.append(cardTitle);
  cardContainer.append(cardImage);
  cardContainer.append(cardSecond);
  return cardContainer;
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




// function getStoredToken() {
//   return window.localStorage.getItem("token") || null;
// }

async function loadProductRatings(p_id) {
  const res = await fetch(`${BASE_URL_PATH_AUTH}acharavaliacoes/${p_id}`, {
    method: 'GET',
    // body: JSON.stringify({p_id, critic}),
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  return await res.json();
}