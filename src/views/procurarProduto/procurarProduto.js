const BASE_URL_PATH =  'http://localhost:3000/'

window.onload = async () => {
    const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
    console.log('data: ' + data)   
}


const procurarDescricaoInput = document.getElementById('procurar-descricao-input')

document.querySelector('.search-btn').addEventListener('click', (e) => { 
    e.preventDefault();
    searchProducts();
})

  
  function searchProducts() {
    const typedValue = document.querySelector('.main-input').value
    window.location.href = `${BASE_URL_PATH}getprodutos?queryDescriptionAlso=false&number=0&nomeProduto=${typedValue}`
  }






function convertNumberToMonth(month_number) {
  const months = new Array("Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro");
  return months[month_number - 1]
}



