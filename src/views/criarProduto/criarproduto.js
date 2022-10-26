window.onload = async () => {
  const spinning = document.getElementById("spinning");
  spinning.style.visibility = "visible";
  const main = document.querySelector(".main-container");
  main.style.visibility = "hidden";

  const token = getStoredToken();
  if (token) {
    const res = await fetch("http://localhost:3000/auth", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: token,
      },
    });
    const data = await res.json();
    if (!data.auth) {
      return (window.location.href = "http://localhost:3000/pagelogin");
    }
    if (data.auth) {
      main.style.visibility = "visible";
      spinning.style.visibility = "hidden";
      return;
    }
  }
  window.location.href = "http://localhost:3000/pagelogin";
};

function getStoredToken() {
  return window.localStorage.getItem("token") || null;
}

document
  .getElementById("criar-btn")
  .addEventListener("click", () => fireRequest());

async function fireRequest() {
  const data = collectFieldsData();
  const formData = convertDataToForm(data);
  await sendData(formData);
}

function collectFieldsData() {
  const productName = document.getElementById("product-name").value;
  const productDescription = document.getElementById(
    "product-description"
  ).value;
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
  console.log(data);
}

// e.preventDefault();
//   runSpinAnimation(e.target);

//   const token = getStoredToken();
//   const updatedUserObject = getAllInputedInfo();

//   const formData = new FormData();
//   formData.append("name", updatedUserObject.name);
//   formData.append("city", updatedUserObject.city);
//   formData.append("password", updatedUserObject.password);
//   formData.append("confirmPassword", updatedUserObject.confirmPasswordValue);
//   formData.append("gender", updatedUserObject.gender);
//   formData.append("birthDate", updatedUserObject.birthDate);
//   formData.append("aboutMe", updatedUserObject.aboutMe);
//   formData.append("bio", updatedUserObject.bio);
//   formData.append("token", token);

//   if (files.files) {
//     for(let i =0; i < files.files.length; i++) {
//       formData.append("files", files.files[i]);
//     }
//   }

//   try {
//     const res = await fetch("http://localhost:3000/testimage", {
//       method: "POST",
//       body: formData,
//       headers: {},
//     });
//     const data = await res.json();
//     stopSpinAnimation(e.target);

//     if (!data) showMessage(data.message, true);
//     if (!data.error) showMessage(data.message, false);
//     if (data.error) showMessage(data.message, true);

//     setTimeout(() => hideMessage(), 2500);

//   } catch (err) {
//     stopSpinAnimation(e.target);
//     showMessage("Erro. A imagem pode conter um tamanho maior que o permitido...", true);
//     setTimeout(() => hideMessage(), 2500);
//   }
// })
