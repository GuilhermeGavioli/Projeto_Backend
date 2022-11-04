const BASE_URL_PATH =  'http://localhost:3000/'
const MAXSIZEPERMITED = 230000;




window.onload = async () => {
  const userData = await handleUserFetchTokenData('redirect');
}



document.getElementById("main-criar-btn").addEventListener("click", () => fireCreateProductRequest());

async function fireCreateProductRequest() {
  const data = collectFieldsData();
  const formData = convertDataToForm(data);
  await sendData(formData);
}

function collectFieldsData() {
  const productName = document.getElementById("product-name").value;
  const productDescription = document.getElementById("product-description").value;
  const productImageFile = document.getElementById("product-file").files[0];
  return {
    productName,
    productDescription,
    productImageFile,
  };
}

function convertDataToForm(data) {
  const form = new FormData();
  form.append("name", data.productName);
  form.append("description", data.productDescription);
  form.append("productFile", data.productImageFile);
  form.append("token", getStoredToken());
  return form
}

async function sendData(formData) {
  const res = await fetch("http://localhost:3000/testimagecriarproduto", {
    method: "POST",
    body: formData,
    headers: {},
  });
  const data = await res.json();
  if (!data.error) return alert(data.message)
  return alert(data.message)
}


// CONTROLLS  TOGGLE SIDEBAR 






// procurar item



function getStoredToken() {
  return window.localStorage.getItem("token") || null;
}