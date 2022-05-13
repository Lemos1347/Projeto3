const vagas = [
    {
        'nome': 'Analista de Sistemas 1',
        'matchPer': 60,
        'modelo': "Remoto",
        'status': "Aguardando"
    },
    {
        'nome': 'Analista de Sistemas 2',
        'matchPer': 60,
        'modelo': "Presencial",
        'status': "Aprovado"
    },
    {
        'nome': 'Analista de Sistemas 3',
        'matchPer': 50,
        'modelo': "Remoto",
        'status': "Rejeitado"
    },
    {
        'nome': 'Engenheiro de Software',
        'matchPer': 10,
        'modelo': "Presencial",
        'status': "Aguardando"
    },
    {
        'nome': 'Engenheiro da Computação',
        'matchPer': 20,
        'modelo': "Remoto",
        'status': "Aguardando"
    },
    {
        'nome': 'Analista de DB',
        'matchPer': 50,
        'modelo': "Remoto",
        'status': "Aguardando"
    },
]

function checkVagas() {

    vagas.map((vaga) => {

        let color = 'black'

        document.getElementById('containerOfAll').innerHTML += `
        <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent">
            <div class = 'vagaComponent' style="box-shadow:  2px 4px 5px var(--shadow-${color}), -2px 4px 5px var(--shadow-${color});">
                <div class="row mainWidGet">
                    <div class="col-5 imgHubVagas">
                        <img src = '../images/userTest.png' style = "width: 100px;">
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent">
                            <h1 class="nomeVagaHubVagas">${vaga.nome}</h1>
                            <p class="pForHubVagas"><i class="fa fa-map-marker" aria-hidden="true"></i>São Paulo</p>
                            <p class="pForHubVagas d-flex"><i class="fa fa-briefcase briefcase-yellow" aria-hidden="true"></i>${vaga.modelo}</p>
                            <p class="pForHubVagas d-flex"><i class="fa fa-info-circle info-circle-yellow" aria-hidden="true"></i>${vaga.status}</p>
                            <div class = 'divBtnSeeMore'>
                                <button class="btnSeeMore">Ver Mais</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    })
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