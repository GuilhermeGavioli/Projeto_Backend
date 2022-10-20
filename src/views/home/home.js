window.onload = async () => {
    profilePainel.style.visibility = "hidden"
  
      const spinning = document.getElementById("spinning");
      spinning.style.visibility = "visible";
    const main = document.querySelector(".container");
    main.style.visibility = "hidden";
  
  
    const token = getStoredToken();
    if (token) {
      const res = await fetch("http://localhost:3000/auth", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: token,
          required_info: "*",
        },
      });
      const data = await res.json();
      if (!data.auth) {
        return (window.location.href = "http://localhost:3000/pagelogin");
      }
      if (data.auth) {
        console.log(data);
        main.style.visibility = "visible";
        spinning.style.visibility = "hidden";
        fitInformationOnInputs(data.fullUser);
        return;
      }
    }
    window.location.href = "http://localhost:3000/pagelogin";
};
  
function getStoredToken() {
    // const cookieToken = document.cookie = "token=" + token
    const localToken = window.localStorage.getItem("token");
    return localToken;
}
  



//toggle icon bar
const profilePainel = document.querySelector('.profile-icon-painel')

window.addEventListener('click', (e) => {
  if (e.target.getAttribute('onclickclose') != null) { 
    profilePainel.style.visibility = "hidden";
  }
})


document.querySelector('.profile-icon-circle').addEventListener('click', (e) => {
  if (e.target.getAttribute('class').toString() == "profile-icon-circle") {
    profilePainel.style.visibility = profilePainel.style.visibility == "hidden" ? "visible" : "hidden";
  }
})

document.querySelector('.logout-btn').addEventListener('click', async (e) => {
  await window.localStorage.removeItem('token')
  window.location.reload();
})
