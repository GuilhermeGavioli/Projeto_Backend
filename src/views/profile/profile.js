
window.onload = async () => {

    //Referente ao conteudo da página --------------------------------------------

    // /get//:idprodutor
    // const params = new URLSearchParams(window.location.search)
    // console.log(params)
    // const res = await fetch("http://localhost:3000//get/:idprodutor", {
    //     method: "GET",
    //     headers: {
    //       "Content-type": "application/json",
    //       authorization: token,
    //       required_info: "*",
    //     },
    // });
    // const data = await res.json();
    
    
    getUserProducts();
    
    
    //Referente a Se o usuario esta logado ou nao --------------------------------------------
    const headerCircle = document.querySelector('.header-circle');
    const headerPainel = document.querySelector('.header-painel');
    const headerLogoutButton = document.querySelector('.logout-btn');

    if (getStoredToken()) {
      const res = await fetch("http://localhost:3000/auth", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: getStoredToken(),
          required_info: "*",
        },
    });
    const data = await res.json();
        if (data.auth) {
            fitUserTokenImageInHeader(headerCircle, data.fullUser);
            headerCircle.addEventListener('click', () => toggleHeaderPainel(headerPainel))
            headerLogoutButton.addEventListener('click', logout);
            headerCircle.style.visibility = "visible";
        }
    }
}
  
function getStoredToken() {
    return window.localStorage.getItem("token") || null; //tokenInfo
}

function fitUserTokenImageInHeader(headerElement, userData) {
    if (userData.user_image) {
        const src = `http://localhost:3000/file_system/${userData.user_image}`
        return headerElement.setAttribute('src', src);
    }
    const alternativeSrc = `http://localhost:3000/file_system/app/default_user_image.png`
    headerElement.setAttribute('src', alternativeSrc);
}


function toggleHeaderPainel(PainelElement) {
    PainelElement.style.visibility = PainelElement.style.visibility == "hidden" ? "visible" : "hidden";
}

function logout() {
    window.localStorage.removeItem('token')
    window.location.reload();
}



window.onscroll = async () => { 
    
   
}

async function getUserProducts() { 
    const userid = document.getElementById('userid').getAttribute('userid');
    console.log(userid)
    const res = await fetch(`http://localhost:3000/getprodutosfromuser/${userid}`)
    const data = await res.json();
    console.log(data)
}

