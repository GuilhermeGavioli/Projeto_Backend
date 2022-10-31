window.onload = async () => {
  // const header = document.querySelector(".header");
  const headerPainel = document.querySelector('.header-painel');
  // const main = document.querySelector(".container");
  // const spinner = document.getElementById("spinning");

  // hideContent(header, main, spinner);

  // const headerCircle = document.querySelector('.header-user-icon')
  // const headerPainel = document.querySelector('.header-painel');
  // const headerLogoutButton = document.querySelector('.logout-btn');

  const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
  console.log('aaaaa' + data)
  // if (!data.auth) return window.location.href = `${BASE_URL_PATH_AUTH}pagelogin`;
        
  // if (data.auth) {
  //       headerCircle.addEventListener('click', (e) => toggleHeaderPainel(headerPainel))
  //       headerLogoutButton.addEventListener('click', () => logout())
  //       fitUserInfoInHeader(data.fullUser.user_image);
  //       showContent(header, main, spinner);
  //       return data.fullUser;
  //   }
  // headerCircle.style.position = 'absolute'
  // headerCircle.style.visibility = 'hidden'
  // headerPainel.style.visibility = 'hidden'
  // headerLogoutButton.style.visibility = 'hidden'
  
 

  document.querySelector('.banner-container').addEventListener('click', () => { 
    closeSidebar()
    closePainel(headerPainel)
    
  })
}
