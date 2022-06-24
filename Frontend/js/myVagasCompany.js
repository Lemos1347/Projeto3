let auth
let company_name
let companyId
let isVerified
let logo_company
var vagasFiltered = []

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        auth = window.localStorage.getItem('auth')
        $.ajax({
            url: "https://matchagas.herokuapp.com/Company",
            headers: {"Authorization": `Bearer ${auth}`},
            success: async function(resul) { 
                console.log(resul)
                company_name = resul.name_company
                companyId = resul.id
                isVerified = resul.isVerified
                logo_company = resul.logo_company
                if (resul.isCompany == false) {
                    window.location.href = '/view/hubVagas.html'
                }

                if (!Boolean(isVerified)) {
                    window.location.href = '/view/verifyAccount.html'
                }

                document.getElementById('userNameNavBar').innerHTML = company_name
                document.getElementById('companyLogo').src = logo_company

                await $.ajax({
                    url: "https://matchagas.herokuapp.com/Offer/getOfferCompany",
                    headers: { "authorization": `Bearer ${auth}` },
                    success: function (resul) {
                        console.log(resul)
                        vagas = resul.offers
                        console.log(vagas)
                    }
                }).fail(function (err) {
                    console.log(err.responseJSON.message)
                })

                vagasFiltered = vagas

                checkVagas()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message);
            window.location.href = '../view/hubVagas.html'
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
    console.log('teste')
    document.getElementById('applytBtn').style.display = 'block'
    document.getElementById('declineBtn').style.display = 'none'
    document.getElementById('type').value = 'Selecione'
    document.getElementById('localVaga').value = 'Selecione'
    vagasFiltered = vagas
    document.getElementById('containerOfAll').innerHTML = ''
    checkVagas()
}

async function checkVagas() {
    vagasFiltered.map((vaga) => {

        if (!vaga.logo_company) {
            vaga.logo_company = "../images/userTest.png"
        }
        
        document.getElementById('containerOfAll').innerHTML += `
        <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent" style = "margin-top: 20px;">
            <div class = 'vagaComponent'>
                <div class="row mainWidGet">
                    <div class="col-5 imgHubVagas">
                        <img src = ${vaga.logo_company} style = "width: 100px; heigth: 100px; border-radius: 50%;">
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent">
                            <p>${vaga.name}</p>
                            <p class="pForHubVagas d-flex"><i class="fa fa-briefcase briefcase-yellow" aria-hidden="true"></i>${vaga.location}</p>
                            <p class="pForHubVagas d-flex"><i class="fa fa-clock-o" aria-hidden="true"></i>${vaga.type}</p>
                            <div class = 'divBtnSeeMore'>
                                <button class="btnSeeMore" onclick="redirectToVagaId('${vaga.id}')">Ver Mais</button>
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
    document.location.href = `../view/vagaExpandidaEmpresa.html?id=${param}`
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