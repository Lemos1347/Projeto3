const vagas = [
    {
        'nome': 'Analista de Sistemas 1',
        'matchPer': 60,
        'id': 1
    },
    {
        'nome': 'Analista de Sistemas 2',
        'matchPer': 60,
        'id': 2
        
    },
    {
        'nome': 'Analista de Sistemas 3',
        'matchPer': 50,
        'id': 3
    },
    {
        'nome': 'Engenheiro de Software',
        'matchPer': 10,
        'id': 4
    },
    {
        'nome': 'Engenheiro da Computação',
        'matchPer': 20,
        'id': 5
    },
    {
        'nome': 'Analista de DB',
        'matchPer': 50,
        'id': 6
    },
]

function checkVagas() {

    vagas.map((vaga) => {

        let color = ''

        let randomNumber = generateRandomNumber()

        if(randomNumber < 50) {
            color = 'red'
        } else if (randomNumber > 50) {
            color = 'green'
        } else if (randomNumber = 50) {
            color = 'yellow'
        }

        document.getElementById('containerOfAll').innerHTML += `
        <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent" style = "margin-top: 40px;">
            <div class = 'vagaComponent' style="box-shadow:  2px 4px 5px var(--shadow-${color}), -2px 4px 5px var(--shadow-${color});">
                <div class="row mainWidGet">
                    <div class="col-5 imgHubVagas">
                        <img src = '../images/userTest.png' style = "width: 100px;">
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent">
                            <h1 class="nomeVagaHubVagas">${vaga.nome}</h1>
                            <p class="pForHubVagas"><i class="fa fa-map-marker" aria-hidden="true"></i>São Paulo</p>
                            <p class="pForHubVagas d-flex"><i class="fa fa-briefcase briefcase-yellow" aria-hidden="true"></i>Presencial</p>
                            <div class = 'divBtnSeeMore'>
                                <button class="btnSeeMore" onclick = "redirectToVagaId(${vaga.id})">Ver Mais</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    })
}

function redirectToVagaId(param) {
    document.location.href = `../view/vagaExpandida.html?id=${param}`
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 100)
}

function popUpVisibility(visible) {

    console.log('Foi')
    console.log(visible)

    let displayToEdit = ''

    if(visible == true) {
        document.getElementById('bodyFiltersHubVagas').style.display = 'flex'

        document.getElementById('toScroll').scrollIntoView();
    } else {
        displayToEdit = 'none'
        document.getElementById('bodyFiltersHubVagas').style.display = 'none'
    }

    
}

checkVagas()