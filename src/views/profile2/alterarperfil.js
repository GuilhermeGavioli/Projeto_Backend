const BASE_URL_PATH =  'http://localhost:3000/'
const MAXSIZEPERMITED = 200000;


window.onload = async () => {
 
  const userData = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
  console.log(userData)


  // const advanced = document.querySelector(".c2-advanced-info");
  // const userInfo = document.querySelector(".c2-user-info");
  // showUserInfo(advanced, userInfo)
  // headerLogoutButton.addEventListener('click', () => logout())
  // fitUserInfoInHeader(data.fullUser.user_image);



  // return data.fullUser;
}





















// function convertNumberToMonth(month_number) {
//   const months = new Array("Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro");
//   return months[month_number - 1]
// }







function getStoredToken() {
  return window.localStorage.getItem("token") || null;
}

function runSpinAnimation(button) {
  button.firstElementChild.style.visibility = "visible";
  button.lastElementChild.style.visibility = "hidden";
}

function stopSpinAnimation(button) {
  button.firstElementChild.style.visibility = "hidden";
  button.lastElementChild.style.visibility = "visible";
}



function logout() {
  window.localStorage.removeItem('token')
  window.location.reload();
}







function lightAdvanced(advanced) {
  advanced.style.borderBottom = '3px solid rgb(126, 176, 28)';
  advanced.style.color = 'rgb(120,120,120)';
}
function lightInfo(userInfo) {
  userInfo.style.borderBottom = '3px solid rgb(126, 176, 28)';
  userInfo.style.color = 'rgb(120,120,120)';
}

function resetCategory(advanced, userInfo) {
  userInfo.style.borderBottom = 'unset';
  userInfo.style.fontWeight = 'unset';
  userInfo.style.color = 'rgb(175, 175, 175)';
  advanced.style.borderBottom = 'unset';
  advanced.style.fontWeight = 'unset';
  advanced.style.color = 'rgb(175, 175, 175)';
}




function showUserInfo(advanced, userInfo){
  advanced.style.visibility = 'hidden';
  advanced.style.position = 'absolute';
  userInfo.style.visibility = 'visible';
  userInfo.style.position = 'unset';
}

function showAdvanced(advanced, userInfo){
  advanced.style.visibility = 'visible';
  advanced.style.position = 'unset';
  userInfo.style.visibility = 'hidden';
  userInfo.style.position = 'absolute';
}