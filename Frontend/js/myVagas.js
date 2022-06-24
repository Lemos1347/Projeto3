let nome
let email
let id
let hardSkills
let softSkills
let isVerified
let imgUser
var vagasFiltered = []

let auth = window.localStorage.getItem('auth')
window.onload = (event) => {
    console.log('page is fully loaded');
};

function startTimer(duration) {
    var timer = duration, seconds;
    var setIntervalo = setInterval(function () {
        seconds = parseInt(timer % 60, 10);
        if (--timer <= 0) {
            clearInterval(setIntervalo);
            document.getElementById("curriculo").style.display = 'block';
            document.getElementById("loader").style.display = 'none';
        }
    }, 1000);
}
/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        $.ajax({
            url: "https://matchagas.herokuapp.com/User/Verify/Infos",
            type: "GET",
            headers: { "Authorization": `Bearer ${auth}` },
            success: async function (resul) {
                console.log(resul)
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

                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                if (imgUser) {
                    document.getElementById('userImage').src = imgUser 
                }

                await $.ajax({
                    url: "https://matchagas.herokuapp.com/Offer/OfferUser",
                    headers: { "authorization": `Bearer ${auth}` },
                    success: function (resul) {
                        console.log(resul)
                        vagas = resul.offers
                    }
                }).fail(function (err) {
                    console.log('teste')
                    console.log(err.responseJSON.message)
                })

                vagasFiltered = vagas

                checkVagas()
            }
        }).fail(function (err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })
    }
}

let vagas = [
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

function searchInput(valToSearch) {
    if(vagas) {
        if (valToSearch == "") {
            vagasFiltered = vagas
            document.getElementById('containerOfAll').innerHTML = ''
        } else {
            if (vagasFiltered == '') {
                vagasFiltered = vagas
            }
            vagasFiltered = vagasFiltered.filter((val) => {
                return val.name.toLowerCase().includes(valToSearch.toLowerCase())
            })
            document.getElementById('containerOfAll').innerHTML = ''
        }
        checkVagas()
    }
}

function orderedFilters(valToSearch1, valToSearch2) {
    document.getElementById('applytBtn').style.display = 'none'
    document.getElementById('declineBtn').style.display = 'block'
    var vagasFiltered1 = []
    var vagasFiltered2 = []
    if (valToSearch1 == "Selecione") {
        vagasFiltered = vagas
        document.getElementById('containerOfAll').innerHTML = ''
    } else {
        vagasFiltered1 = vagasFiltered.filter((val) => {
            return val.type.toLowerCase().includes(valToSearch1.toLowerCase())
        })
        document.getElementById('containerOfAll').innerHTML = ''
    }

    if (valToSearch2 == "Selecione") {
        vagasFiltered = vagas
        document.getElementById('containerOfAll').innerHTML = ''
    } else {
        vagasFiltered2 = vagasFiltered.filter((val) => {
            return val.location.toLowerCase().includes(valToSearch2.toLowerCase())
        })
        document.getElementById('containerOfAll').innerHTML = ''
    }

    vagasFiltered = vagasFiltered1.concat(vagasFiltered2)

    vagasFiltered = [...new Set(vagasFiltered)];
    checkVagas()
}

function clearFilter() {
    document.getElementById('applytBtn').style.display = 'block'
    document.getElementById('declineBtn').style.display = 'none'
    document.getElementById('type').value = 'Selecione'
    document.getElementById('localVaga').value = 'Selecione'
    vagasFiltered = vagas
    document.getElementById('containerOfAll').innerHTML = ''
    checkVagas()
}

async function checkVagas() {

    console.log(auth)

    if (vagas == "") {
        document.getElementById('containerOfAll').innerHTML += `<h3 class = "" style = "margin-top: 120px;">OPS! Verificamos que você ainda não se candidatou a nenhuma vaga. Recomandamos a você acessar a página de "VAGAS".</h3>`
    } else {
        vagasFiltered.map((vaga) => {

            if (!vaga.logo_company) {
                vaga.logo_company = "../images/userTest.png"
            }

            let color = 'black'
    
            document.getElementById('containerOfAll').innerHTML += `
            <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent" id="vaga">
                <div class = 'vagaComponent' style="box-shadow:  2px 4px 5px var(--shadow-${color}), -2px 4px 5px var(--shadow-${color});">
                    <div class="row mainWidGet">
                        <div class="col-5 imgHubVagas">
                            <img src = ${vaga.logo_company} style = "width: 100px; heigth: 100px; border-radius: 50%;">
                        </div>
                        <div class="col-7">
                            <div class="divRightHubVagasComponent">
                                <h1 class="nomeVagaHubVagas">${vaga.name}</h1>
                                <p class="pForHubVagas"><i class="fa fa-map-marker" aria-hidden="true"></i>São Paulo</p>
                                <p class="pForHubVagas d-flex"><i class="fa fa-briefcase briefcase-yellow" aria-hidden="true"></i>${vaga.type}</p>
                                <p class="pForHubVagas d-flex"><i class="fa fa-info-circle info-circle-yellow" aria-hidden="true"></i>${vaga.status}</p>
                                <div class = 'divBtnSeeMore'>
                                    <button class="btnSeeMore" type="button" onclick="redirectToVagaId('${vaga.id}')">Ver Mais</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        })
    }

   
}

function redirectToVagaId(param) {
    document.location.href = `../view/vagaExpandida.html?id=${param}`
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 100)
}

var filter = false
function popUpVisibility() {
    filter = !filter;
    if (filter == true) {
        document.getElementById('filterVagas').style.display = 'flex'

    } else {

        document.getElementById('filterVagas').style.display = 'none'
    }
}