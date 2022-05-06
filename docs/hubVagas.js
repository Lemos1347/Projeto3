const vagas = [
    {
        'nome': 'Analista de Sistemas 1',
        'matchPer': 60
    },
    {
        'nome': 'Analista de Sistemas 2',
        'matchPer': 60
    },
    {
        'nome': 'Analista de Sistemas 3',
        'matchPer': 50
    },
    {
        'nome': 'Engenheiro de Software',
        'matchPer': 10
    },
    {
        'nome': 'Engenheiro da Computação',
        'matchPer': 20
    },
    {
        'nome': 'Analista de DB',
        'matchPer': 50
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
        <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent">
            <div class = 'vagaComponent' style="box-shadow:  2px 4px 5px var(--shadow-${color}), -2px 4px 5px var(--shadow-${color});">
                <div class="row" style="margin-top: 20px;">
                    <div class="col-5">
                        <img src = '../images/userTest.png'>
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent">
                            <p>${vaga.nome}</p>
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