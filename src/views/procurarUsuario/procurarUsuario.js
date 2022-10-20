

const pesquisarButton = document.querySelector('.pesquisar-btn')
const pesquisarInput = document.getElementById('pesquisar-input')
const procurarDescricaoInput = document.getElementById('procurar-descricao-input')

procurarDescricaoInput.addEventListener("click", (e) => {
    if (e.target.getAttribute('checked').toString() == 'false') return e.target.setAttribute('checked', 'true')
    e.target.setAttribute('checked', 'false');
})

pesquisarButton.addEventListener("click", async () => {
    if (!(pesquisarInput.value).toString().trim()) return pesquisarInput.value = "";
    

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
    
    const cardFirst = document.createElement('div')
    cardFirst.className = "card-first";

    const cardCircle = document.createElement('div')
    cardCircle.className = "card-circle";

    const cardSecond = document.createElement('div')
    cardSecond.className = "card-second";

    const cardTitleContainer = document.createElement('div')
    cardTitleContainer.className = "card-title-container";
    
    const cardTitle = document.createElement('h2')
    cardTitle.className = "card-title";
    cardTitle.innerHTML = item.full_name

    const cardTextContainer = document.createElement('div')
    cardTextContainer.className = "card-text-container";

    const cardText = document.createElement('p')
    cardText.className = "card-text";
    cardText.innerHTML = item.about_me || "User has no description"

    const cardButtonContainer = document.createElement('div')
    cardButtonContainer.className = "card-button-container";
    
    const visitarButton = document.createElement('button')
    visitarButton.className = "visitar-btn";
    visitarButton.innerHTML = "Visitar Perfil";
    visitarButton.addEventListener('click', ()=> { 
        window.location.href = 'http://localhost:3000/page'
    })


    cardFirst.append(cardCircle)

    cardTitleContainer.append(cardTitle);
    cardTextContainer.append(cardText);
    cardButtonContainer.append(visitarButton);

    cardSecond.append(cardTitleContainer);
    cardSecond.append(cardTextContainer);
    cardSecond.append(cardButtonContainer);

    cardContainer.append(cardFirst);
    cardContainer.append(cardSecond);

    const containerComInfo = document.querySelector('.resultados-container-com-info');
    containerComInfo.append(cardContainer)
}
