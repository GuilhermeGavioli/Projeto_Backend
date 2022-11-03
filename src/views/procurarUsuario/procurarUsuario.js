const BASE_URL_PATH =  'http://localhost:3000/'

window.onload = async () => {
    console.log('gh')

    const data = await handleUserFetchTokenData('stayOnThePageStillNotLoggedIn');
    console.log('data: ' + data)   
}

const pesquisarButton = document.querySelector('.search-btn')
const pesquisarInput = document.querySelector('.main-input')
const procurarDescricaoInput = document.getElementById('procurar-descricao-input')



procurarDescricaoInput.addEventListener("click", (e) => {
    if (e.target.getAttribute('checked').toString() == 'false') return e.target.setAttribute('checked', 'true')
    e.target.setAttribute('checked', 'false');
})

pesquisarButton.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (!(pesquisarInput.value).toString().trim()) return alert('Campo Vazio');
    

    const isChecked =  procurarDescricaoInput.getAttribute('checked')
        

    const res = await fetch(`http://localhost:3000/get/${isChecked}/${pesquisarInput.value}`);
    const data = await res.json();
    console.log(JSON.stringify(data))
    console.log(JSON.stringify(data.length))
    if (JSON.stringify(data.length) == 0) {
        console.log('no data')
        showNoDataContainer();
        return pesquisarInput.value = "";
    }
    console.log('tem' + data)
    showDataContainer(data);
})



function showNoDataContainer() {
    const noResultsContainer = document.querySelector('.resultados-container-sem-info');
    const resultsContainer = document.querySelector('.resultados-container-com-info');

    resultsContainer.style.visibility = "hidden"
    resultsContainer.style.position = "absolute"
    noResultsContainer.style.visibility = "visible";
    noResultsContainer.style.position = "unset";
}


function showDataContainer(data) {
    const noResultsContainer = document.querySelector('.resultados-container-sem-info');
    const resultsContainer = document.querySelector('.resultados-container-com-info');
    
    while (resultsContainer.hasChildNodes()) resultsContainer.removeChild(resultsContainer.lastChild);
    resultsContainer.style.visibility = "visible"
    resultsContainer.style.position = "unset"
    noResultsContainer.style.visibility = "hidden";
    noResultsContainer.style.position = "absolute";
    data.map(item => { 
        createCard(item);
    })
}

function createCard(item) {
    const cardContainer = document.createElement('div')
    cardContainer.className = "card-container";
    cardContainer.setAttribute('id', item.userid)
    
    

    const cardCircle = document.createElement('img')
    cardCircle.className = "card-circle";

    if (item.user_image) {
        cardCircle.setAttribute('src', `http://localhost:3000/file_system/user/${item.user_image}`)
    } else {        
        cardCircle.setAttribute('src', 'http://localhost:3000/file_system/app/user_default.jpg')
    }


    
    const cardTitle = document.createElement('h2')
    cardTitle.className = "card-title";
    cardTitle.innerHTML = item.full_name

    const cardText = document.createElement('p')
    cardText.className = "card-text";
    const gender = convertGender(Number(item.user_gender))
    const idade = calcularIdade(item.birth_date.toString().substring(0, 4));
    console.log(item.birth_date.toString().substring(0, 4))
    cardText.innerText += " " + gender + ", " + idade + " anos";

    const viewProfileContainer = document.createElement('div')
    viewProfileContainer.className = "view-profile-container";
    
    const viewProfileButton = document.createElement('button')
    viewProfileButton.className = "view-profile-btn";
    viewProfileButton.innerHTML = ' <i class="fa-regular fa-user" style="font-size: 1.3em;"></i> Ver perfil'
    

    viewProfileButton.addEventListener('click', ()=> { 
        window.location.href = `http://localhost:3000/pageprofile/${item.userid}`
    })

    const div = document.createElement('div')
    const cardText2 = document.createElement('p')
    cardText2.setAttribute('style', 'margin-top: 25px; text-align: start;')
    
    const month_number = Number(item.created_at.substring(5, 7))
    const month = convertNumberToMonth(month_number)

    const ano = Number(item.created_at.substring(0, 4))
    cardText2.innerText = 'Desde ' + month + ' de ' + ano;

    cardContainer.append(cardCircle)
    cardContainer.append(cardTitle)
    cardContainer.append(cardText)

    viewProfileContainer.append(viewProfileButton)

    cardContainer.append(viewProfileContainer)

    div.append(cardText2)
    cardContainer.append(div)


    const containerComInfo = document.querySelector('.resultados-container-com-info');
    containerComInfo.append(cardContainer)
}







function convertNumberToMonth(month_number) {
  const months = new Array("Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro");
  return months[month_number - 1]
}



function toggleHeaderPainel(PainelElement) {
    PainelElement.style.visibility = PainelElement.style.visibility == "hidden" ? "visible" : "hidden";
}