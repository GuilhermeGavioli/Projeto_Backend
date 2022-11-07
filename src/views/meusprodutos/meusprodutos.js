const BASE_URL_PATH =  'http://localhost:3000/'



window.onload = async () => {
  const userData = await handleUserFetchTokenData('redirect');


  const productsdata = await getMyProducst();
  fitProductsDataInHome(productsdata)
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

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container'
  cardContainer.setAttribute('product-id', item.product_id)
  cardContainer.addEventListener('click', (e) => { 
    window.location.href = `/produto/${e.target.getAttribute('product-id')}`
  })

  const productid = cardContainer.getAttribute('product-id')
  console.log(productid)

  const thrashIcon = document.createElement('div');
  thrashIcon.className = 'thrash-icon';
  thrashIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  thrashIcon.addEventListener('click', async () => {
    const data = await deleteProduct(productid);
    console.log(data)
  })
  

  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', `${BASE_URL_PATH}file_system/product/${item.product_image}`);
  cardImage.className = 'card-first'

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title'
  cardTitle.innerText = item.product_name;

  const cardSecond = document.createElement('div');
  cardSecond.className = 'card-second';
  cardSecond.innerText = item.product_description;

  cardContainer.append(cardImage);
  cardContainer.append(thrashIcon);
  cardContainer.append(cardTitle);
  cardContainer.append(cardSecond);
  return cardContainer;
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