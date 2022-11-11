const BASE_URL_PATH =  'http://localhost:3000/'
const MAXSIZEPERMITED = 230000;




window.onload = async () => {
  const userData = await handleUserFetchTokenData('redirect');
}


const tags = Array.from(document.querySelectorAll('.tag'))
console.log(tags)
let tagsAdded = 0;

tags.map(tag => tag.addEventListener('click', (e)=> run(e)))

const allTags = [
  "Terra",
  "Fazenda",
  "Natural",
  "Orgânico",
  "Light",
  "Vegano",
  "Promocao",
  "Vegano",
  "Vegano",
];

function run(e){
  if (e.target.getAttribute('toBeAddedContainer') == 'true') {
    if (tagsAdded > 4) return;
    const tagText = e.target.firstElementChild.innerText;
    const tag = createAddedTag(tagText);
    appendOnAddedContainer(tag);
    e.target.remove();
    tagsAdded ++;
  } else {
    const tagText = e.target.firstElementChild.innerText;
    const tag = createToBeAddedTag(tagText)
    appendOnToBeAddedContainer(tag)
    e.target.remove();
    tagsAdded --;
  }
}

function createAddedTag(text){
  const tag = document.createElement('div')
  tag.className = 'tag'
  tag.setAttribute('toBeAddedContainer', 'false');
  tag.addEventListener('click', (e) => run(e));

  const p = document.createElement('p')
  p.innerText = text;
  p.className = 'tag-text';
  const i = document.createElement('i');
  i.className = "fa-solid fa-xmark";
  i.setAttribute('style', 'pointer-events: none; margin-left: 5px;')
  
  tag.append(p);
  tag.append(i);
  return tag;
}

function createToBeAddedTag(text){
  const tag = document.createElement('div')
  tag.className = 'tag'
  tag.setAttribute('toBeAddedContainer', 'true');
  tag.addEventListener('click', (e) => run(e));

  const p = document.createElement('p')
  p.innerText = text;
  p.className = 'tag-text';
 
  tag.append(p);
  return tag;
}

function appendOnAddedContainer(tag){
  document.querySelector('.tags-added-container').append(tag);
}

function appendOnToBeAddedContainer(tag){
  document.querySelector('.tags-to-be-added-container').append(tag);
}


const files = document.getElementById("product-file");
files.onchange = ((e) => { 
  if (e.target.files[0].size > MAXSIZEPERMITED) {
    e.target.value = "";
    showMessage("Tamanho da imagem não permitido. Sua requisição será negada", true);
    setTimeout(() => hideMessage(), 2500);
    return;
  }
  const obj = URL.createObjectURL(e.target.files[0])
  document.getElementById('circle-change-image-cover').setAttribute('src', obj)
})


const createButton = document.getElementById('criar-btn');
createButton.addEventListener('click', (e) => {
  e.preventDefault();
  fireCreateProductRequest();
})

async function fireCreateProductRequest(){
  const inputData = getInputedData();
  console.log(inputData)
  const formData = convertDataToForm(inputData)
  console.log(formData.values())
  const data = await sendData(formData);
}


function getInputedData(){
  const productName = document.getElementById('product-name-input').value
  const productIsOrganic = document.getElementById('product-organic-input').checked
  const productDescription = document.getElementById('product-description-input').value
  const productPrice = document.getElementById('product-price-input').value
  const productUnity = document.getElementById('product-unity-input').value
  const productCategory = document.getElementById('product-category-input').value
  const productImageFile = document.getElementById("product-file").files[0];
  const productTags = getTags();

  return{
    productImageFile,
    productTags,
    productName,
    productIsOrganic,
    productDescription,
    productPrice,
    productUnity,
    productCategory
  }
}

function getTags() {
  let cont = 0;
  const my_tags = [];
  const choosenTags = Array.from(document.querySelector('.tags-added-container').childNodes);
  choosenTags.map(tag => {
    if (cont !== 0) { 
      my_tags.push(tag.innerText)
    }
    cont++;
  })
  return my_tags;
}

function convertDataToForm(data) {
  const form = new FormData();
  form.append("tags", JSON.stringify(data.productTags));
  form.append("name", data.productName);
  form.append("isOrganic", data.productIsOrganic);
  form.append("description", data.productDescription);
  form.append("price", data.productPrice);
  form.append("unity", data.productUnity);
  form.append("category", data.productCategory);
  form.append("productFile", data.productImageFile);
  form.append("token", getStoredToken());
  return form
}

async function sendData(formData) {
  console.log(formData)
  const res = await fetch(`${BASE_URL_PATH}criarProduto`, {
    method: "POST",
    body: formData,
    headers: {},
  });
  const data = await res.json();
  console.log(data)
  if (!data.error) { 
    setTimeout(() => {
      alert(data.message)
      window.location.reload();
      return
    }, 500);
  } else {
    alert(data.message)
  }
}


function getStoredToken() {
  return window.localStorage.getItem("token") || null;
}



let = screen = 0
updateScreen()
// ------------------------------------------------------------------------
document.getElementById('proximo-btn').addEventListener('click', (e) => handleScreenTransition(e))
document.getElementById('anterior-btn').addEventListener('click', (e) => handleScreenLeftTransition(e))

function handleScreenTransition(e) {
  if (screen == 3) return
  if (screen == 0) { 
    const isValid = validateProductScreen();
    if (!isValid) return;
  }
  if (screen == 1) { 
    const isValid = validatePicScreen();
    if (!isValid) return;
  }
  if (screen == 2) { 
    const isValid = validateInfoScreen();
    if (!isValid) return;
  }
  screen++;
  console.log(screen)
  updateScreen(e);
}

function validateProductScreen() {
  const data = getInputedData();
  if (data.productName.trim() == '') return false;
  return true;
}

function validatePicScreen() {
  const data = getInputedData();
  if (!data.productImageFile) return false;
  return true;
}

function validateInfoScreen() {
  const data = getInputedData();
  if (data.productDescription.trim() == '' || !data.productPrice) return false;
  if (data.price < 1 || data.price > 10000)
  return true;
}

function handleScreenLeftTransition(e) {
  if (screen == 0 ) return
  screen--;
  console.log(screen)
  updateScreen(e);
}


function updateScreen(e) {
  if (screen == 0) { 
    const container = document.querySelector('.container');
    container.style.gridTemplateAreas = '"main-title" "c0" "c1" "c-button"';
    document.getElementById('circle-one').style.backgroundColor = 'rgb(126, 176, 28)';

    document.getElementById('circle-one').style.padding = '20px'
    document.getElementById('circle-two').style.padding = '0'
    document.getElementById('circle-three').style.padding = '0'
    document.getElementById('circle-four').style.padding = '0'

    const c2 = document.querySelector('.c2');
    c2.style.position = 'absolute';
    c2.style.visibility = 'hidden';
    const c3 = document.querySelector('.c3');
    c3.style.position = 'absolute';
    c3.style.visibility = 'hidden';
    const c4 = document.querySelector('.c4');
    c4.style.position = 'absolute';
    c4.style.visibility = 'hidden';
    
    const c1 = document.querySelector('.c1');
    c1.style.position = 'relative';
    c1.style.visibility = 'visible';
  }
  if (screen == 1) { 
    const container = document.querySelector('.container');
    container.style.gridTemplateAreas = '"main-title" "c0" "c2" "c-button"';
    document.getElementById('circle-one').innerHTML = '<i class="fa-solid fa-check"></i>'

    document.getElementById('circle-one').style.padding = '0'
    document.getElementById('circle-two').style.padding = '20px'
    document.getElementById('circle-three').style.padding = '0'
    document.getElementById('circle-four').style.padding = '0'

    document.getElementById('progress-bar-one').firstElementChild.style.width = '100%'
    

    const c1 = document.querySelector('.c1');
    c1.style.position = 'absolute';
    c1.style.visibility = 'hidden';
    const c3 = document.querySelector('.c3');
    c3.style.position = 'absolute';
    c3.style.visibility = 'hidden';
    const c4 = document.querySelector('.c4');
    c4.style.position = 'absolute';
    c4.style.visibility = 'hidden';

    const c2 = document.querySelector('.c2');
    c2.style.position = 'relative';
    c2.style.visibility = 'visible';
  }
  if (screen == 2) { 
    const container = document.querySelector('.container');
    container.style.gridTemplateAreas = '"main-title" "c0" "c3" "c-button"';
    document.getElementById('circle-two').style.backgroundColor = 'rgb(126, 176, 28)';
    document.getElementById('circle-two').innerHTML = '<i class="fa-solid fa-check"></i>'

    document.getElementById('circle-one').style.padding = '0'
    document.getElementById('circle-two').style.padding = '0'
    document.getElementById('circle-three').style.padding = '20px'
    document.getElementById('circle-four').style.padding = '0'

    document.getElementById('progress-bar-two').firstElementChild.style.width = '100%'

  
    const criarButton = document.getElementById('criar-btn')
    criarButton.style.visibility = 'hidden'
    criarButton.style.position = 'absolute'
    
    const proximoButton = document.getElementById('proximo-btn')
    proximoButton.style.visibility = 'visible'
    proximoButton.style.position = 'relative'
   
    
    const c1 = document.querySelector('.c1');
    c1.style.position = 'absolute';
    c1.style.visibility = 'hidden';
    const c2 = document.querySelector('.c2');
    c2.style.position = 'absolute';
    c2.style.visibility = 'hidden';
    const c4 = document.querySelector('.c4');
    c4.style.position = 'absolute';
    c4.style.visibility = 'hidden';



    const c3 = document.querySelector('.c3');
    c3.style.position = 'relative';
    c3.style.visibility = 'visible';

  

  }
  if (screen == 3) { 
    const container = document.querySelector('.container');
    container.style.gridTemplateAreas = '"main-title" "c0" "c4" "c-button"';
    document.getElementById('circle-three').style.backgroundColor = 'rgb(126, 176, 28)';
    document.getElementById('circle-three').innerHTML = '<i class="fa-solid fa-check"></i>'

    document.getElementById('circle-one').style.padding = '0'
    document.getElementById('circle-two').style.padding = '0'
    document.getElementById('circle-three').style.padding = '0'
    document.getElementById('circle-four').style.padding = '20px'

    document.getElementById('progress-bar-three').firstElementChild.style.width = '100%'

    const criarButton = document.getElementById('criar-btn')
    criarButton.style.visibility = 'visible'
    criarButton.style.position = 'relative'
    
    const proximoButton = document.getElementById('proximo-btn')
    proximoButton.style.visibility = 'hidden'
    proximoButton.style.position = 'absolute'

    // const containerButton = document.querySelector('.c-button')
    // containerButton.lastElementChild.style.visibility = 'hidden';
    // containerButton.lastElementChild.style.position = 'absolute';
    // const criarbtn = document.createElement('button');
    // criarbtn.setAttribute('id', 'criar-btn');
    // criarbtn.className = 'button';
    // criarbtn.innerHTML = '<div id="inside-criar-btn-circle" style="pointer-events: none;"></div><div id="criar-btn-text" style="pointer-events: none;">Publicar Produto</div></button >';
    // criarbtn.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   fireCreateProductRequest();
    // })
    // containerButton.append(criarbtn);
     

    
    const c1 = document.querySelector('.c1');
    c1.style.position = 'absolute';
    c1.style.visibility = 'hidden';
    const c2 = document.querySelector('.c2');
    c2.style.position = 'absolute';
    c2.style.visibility = 'hidden';
    const c3 = document.querySelector('.c3');
    c3.style.position = 'absolute';
    c3.style.visibility = 'hidden';



    const c4 = document.querySelector('.c4');
    c4.style.position = 'relative';
    c4.style.visibility = 'visible';
  }
}