let nome
let email
let id
let hardSkills
let softSkills
let isVerified
let imgUser
let qntOffersGood = 0

let auth = window.localStorage.getItem('auth')

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        $.ajax({
            url: "https://matchagas.herokuapp.com/User/Verify/Infos",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                nome = resul.name
                email = resul.email,
                id = resul.id
                hardSkills = resul.hardSkills,
                softSkills = resul.softSkills,
                isVerified = Boolean(resul.isVerified),
                imgUser = resul.imgUser

                if(!isVerified) {
                    window.location.href = '/view/verifyAccount.html'
                }

                if (!hardSkills || !softSkills) {
                    document.getElementById('containerOfAll').innerHTML += "<p class = 'mt-5'>Lembramos que você não finalizou o cadastro das suas informações como currículo ou teste de SoftSkills, sendo assim não conseguimos lhe oferecer uma informação a respeito de quantos porcento determinada vaga se assemelha ao seu perfil, porém todas as vagas que possuímos estão disponibilizadas para você ainda assim.</p>"
                }

                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                if (imgUser) {
                    document.getElementById('userImage').src = imgUser 
                }
                loadVagas()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })
    }
}

let vagas = [
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

vagasFiltered = []

function searchInput(valToSearch) {
    if (valToSearch == "") {
        vagasFiltered = vagas
        document.getElementById('containerOfAll').innerHTML = ''
    } else {
        vagasFiltered = vagas.filter((val) => {
            return val.name.toLowerCase().includes(valToSearch.toLowerCase())
        })
        document.getElementById('containerOfAll').innerHTML = ''
    }
    checkVagas()
}

async function loadVagas() {
    await $.ajax({
        url: "https://matchagas.herokuapp.com/Offer/getOffers",
        headers: {"Authorization": `Bearer "${auth}"`},
        success: function(resul) { 
            vagas = resul.offers
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    var count = 0
    while (count < vagas.length) {
        await $.ajax({
            url: "https://matchagas.herokuapp.com/Match",
            type: "POST",
            datatype: 'json',
            data: {
                userSoft: softSkills,
                userHard: hardSkills,
                offerSoft: vagas[count].softSkills,
                offerHard: vagas[count].hardSkills + "," + vagas[count].requirements
            },
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) {
                var match = resul.percentage
                vagas[count].match = resul.percentage
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
        })
        count++
    }

    vagasFiltered = vagas

    checkVagas()
}


async function checkVagas() {
    vagasFiltered.map((vaga) => {
    
        if (!vaga.logo_company) {
            vaga.logo_company = "../images/userTest.png"
        }

        if (!hardSkills || !softSkills) {
            document.getElementById('containerOfAll').innerHTML += `
                <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent" style = "margin-top: 40px;">
                    <div class = 'vagaComponent' style="box-shadow:  2px 4px 5px var(--cinza-fundo), -2px 4px 5px var(--cinza-fundo);">
                    <h3 class="empresaVagaHubVagas">${vaga.name_company}</h3>
                        <div class="row mainWidGet">
                            <div class="col-5 imgHubVagas">
                                <img src = ${vaga.logo_company} style = "width: 100px; heigth: 100px; border-radius: 50%;">
                            </div>
                            <div class="col-7">
                                <div class="divRightHubVagasComponent">
                                    <h1 class="nomeVagaHubVagas">${vaga.name}</h1>
                                    <p class="pForHubVagas"><i class="fa fa-map-marker" aria-hidden="true"></i>${vaga.location}</p>
                                    <p class="pForHubVagas d-flex"><i class="fa fa-briefcase briefcase-yellow" aria-hidden="true"></i>${vaga.type}</p>
                                    <div class = 'divBtnSeeMore'>
                                        <button class="btnSeeMore" onclick = "redirectToVagaId('${vaga.id}')">Ver Mais</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        } else {
            if(vaga.match < 40) {
                color = 'red'
            } else if (vaga.match > 60) {
                color = 'green'
                qntOffersGood = qntOffersGood + 1
            } else if (vaga.match > 40 && vaga.match < 60) {
                color = 'yellow'
            } else {
                color = ''
            }

            document.getElementById('containerOfAll').innerHTML += `
            <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent" style = "margin-top: 40px;">
                <div class = 'vagaComponent' style="box-shadow:  2px 4px 5px var(--shadow-${color}), -2px 4px 5px var(--shadow-${color});">
                <h3 class="empresaVagaHubVagas">${vaga.name_company}</h3>
                    <div class="row mainWidGet">
                        <div class="col-5 imgHubVagas">
                            <img src = "${vaga.logo_company}" style = "width: 100px; heigth: 100px; border-radius: 50%;">
                        </div>
                        <div class="col-7">
                            <div class="divRightHubVagasComponent">
                                <h1 class="nomeVagaHubVagas">${vaga.name}</h1>
                                <p class="pForHubVagas"><i class="fa fa-map-marker" aria-hidden="true"></i>${vaga.location}</p>
                                <p class="pForHubVagas d-flex"><i class="fa fa-briefcase briefcase-yellow" aria-hidden="true"></i>${vaga.type}</p>
                                <div class = 'divBtnSeeMore'>
                                    <button class="btnSeeMore" onclick = "redirectToVagaId('${vaga.id}')">Ver Mais</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        }
    })
}

function redirectToVagaId(param) {
    if(window.localStorage.getItem('3e3c48b00c353bd2e99423f6a173a4b4') >= 100) {
        $.ajax({
            url: "https://matchagas.herokuapp.com/User/SendNotify",
            type: "POST",
            datatype: "json",
            data: {
                qntVagas: qntOffersGood
            },
            headers: {"Authorization": `Bearer ${auth}`},
            success: function () {
                console.log('Noficação Enviada')
                window.localStorage.setItem('3e3c48b00c353bd2e99423f6a173a4b4', 0)
                document.location.href = `../view/vagaExpandida.html?id=${param}`
            }
        }).fail(function(err) {
            console.log(err)
        })
    } else {
        document.location.href = `../view/vagaExpandida.html?id=${param}`
    }
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 100)
}

function popUpVisibility(visible) {
    let displayToEdit = ''

    if(visible == true) {
        document.getElementById('bodyFiltersHubVagas').style.display = 'flex'

        document.getElementById('toScroll').scrollIntoView();
    } else {
        displayToEdit = 'none'
        document.getElementById('bodyFiltersHubVagas').style.display = 'none'
    }

    
}