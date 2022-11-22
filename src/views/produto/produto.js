const BASE_URL_PATH =  'http://localhost:3000/'
let fetchCont = 0;
let isOver = false;

window.onload = async () => {
  
  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');


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
  
document.querySelector('.ratting-btn').addEventListener('click', async () => { 
  const p_id = document.getElementById('product_id').getAttribute('product_id')
  console.log(p_id)
  const res = await fetch(`${BASE_URL_PATH_AUTH}avaliarproduto`, {
    method: 'POST',
    body: JSON.stringify({ p_id }),
    headers: {
      "Content-type": "application/json",
      authorization: getStoredToken(),
    }
  })
  const data = await res.json();
  console.log(data)
})

function ratting(){}