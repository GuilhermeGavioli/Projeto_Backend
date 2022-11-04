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
  const res = await fetch(`${BASE_URL_PATH}testimagecriarproduto`, {
    method: "POST",
    body: formData,
    headers: {},
  });
  const data = await res.json();
  console.log(data)
  if (!data.error) return alert(data.message)
  return alert(data.message)
}


function getStoredToken() {
  return window.localStorage.getItem("token") || null;
}