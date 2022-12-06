const BASE_URL_PATH =  'http://localhost:3000/'
let fetchCont = 0;
let isOver = false;

window.onload = async () => {
  
  const headerSobreText = document.getElementById('nav-item-sobre')
  paintHeader(headerSobreText)

  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');


}
