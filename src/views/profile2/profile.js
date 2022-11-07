const BASE_URL_PATH =  'http://localhost:3000/'






function convertNumberToMonth(month_number) {
    const months = new Array("Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro");
    return months[month_number - 1]
}
  
function calcularIdade(ano) {
    console.log(ano)
    console.log(new Date().getFullYear())
    return Number(new Date().getFullYear() - ano);
  }


const createdAtField = document.getElementById('createdAt')
createdAtValue = createdAtField.getAttribute('createdAt');

const month = createdAtValue.toString().substring(4, 7);
const year = createdAtValue.toString().substring(11, 15);

document.querySelectorAll('.createdAtField')[0].innerText += ` ${month} de ${year}`
document.querySelectorAll('.createdAtField')[1].innerText += ` ${month} de ${year}`


const idade = calcularIdade(Number(year));
// document.getElementById('ageField').innerText = `Idade: ${idade} anos`



const userid = document.getElementById('userid-html').innerText




let isOver = false;

window.onload = async () => {

    const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
    console.log(data);
  
    window.onscroll = async () => {
      handlePermanentFetchingOnScroll();
    
  }

}

let fetchCont = 0;
async function handlePermanentFetchingOnScroll() {
  const isInTheEnd = verifyScroll();
      if (isInTheEnd && !isOver) {
        const newProducts = await fetchMore(fetchCont);
        console.log(newProducts)
        if (newProducts.length == 0) {
          console.log('no products');
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

async function fetchMore(cont) {
  const res = await fetch(`${BASE_URL_PATH}getprodutosfromuser/?produtorId=${userid}&number=${cont}`);
  return await res.json();
}

function appendOnPage(data) {
  const container = document.querySelector('.mais-produtos-container')
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
