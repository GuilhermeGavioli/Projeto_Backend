window.onload = async () => {

    const headerPainel = document.querySelector('.header-painel');
  
  
    const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
    console.log('aaaaa' + data)
  }
  