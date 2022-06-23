let nome
let email
let id
let cont = 1
let logo_company

let user = []

let idOffer

let auth = window.localStorage.getItem('auth')

const getCandidatos = () => {
    user.map((user) => {
        console.log(user)
        document.getElementById("newUser").innerHTML += `<div class="col-lg-3 col-md-4 col-sm-12">
            <div class="container-ver-vaga-perfil">
            <div class="d-flex">
                <div>Candidato ${cont}</div>
                <button class="btn-ver" onclick="redirectUserPage('${idOffer}','${user.id}')"><i class="fa fa-eye" aria-hidden="true"></i></button>
            </div>
            </div>
        </div>`
        cont ++
    })
}

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        const params = new URLSearchParams(window.location.search)
        idOffer = params.get('id')
        $.ajax({
            url: "http://localhost:3001/Company",
            type: "GET",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                console.log(resul)
                isCompany = resul.isCompany
                nome = resul.name_company
                logo_company = resul.logo_company

                if (isCompany === false) {
                    window.location.href = "view/hubVagas.html"
                }

                document.getElementById('companyLogo').src = logo_company
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                checkVaga()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })
    }
}

let Offer

async function checkVaga() {

    console.log(idOffer)

    await $.ajax({
        url: "http://localhost:3001/Offer/offerExpanded",
        type: "POST",
        data: { 
            id: idOffer
        },
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            Offer = resul.offer[0]
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    $.ajax({
        url: "http://localhost:3001/Offer/usersApplied",
        type: "POST",
        headers: {"Authorization": `Bearer ${auth}`},
        data: {idVaga: idOffer},
        success: function(resul) { 
            user = resul.users
            getCandidatos()

        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
        window.location.href = '../view/login.html'
    })

    document.getElementById('nameCompOffer').innerHTML = Offer.name_company
    document.getElementById('localOffer').innerHTML = Offer.location
    document.getElementById('typeOffer').innerHTML = Offer.type
    document.getElementById('descriptionOffer').innerHTML = Offer.description
    document.getElementById('nameOffer').innerHTML = Offer.name
    document.getElementById('vagaCompanyLogo').src = Offer.logo_company

    let requirements = Offer.requirements.split(",")

    requirements.map((requirements) => {
        document.getElementById('requirementsOffer').innerHTML += `<li>${requirements}</li>`
    })
    
    let skills = Offer.hardSkills
    console.log(Offer)
    let softSkills = skills.split(",")

    console.log(softSkills)

    softSkills.map((softSkills) => {
        document.getElementById('softSkillsOffer').innerHTML += `<li>${softSkills}</li>`
    })
}

function deleteOffer() {
    $.ajax({
        url: "http://localhost:3001/Offer/Delete",
        type: "DELETE",
        headers: {"Authorization": `Bearer ${auth}`},
        data: {id: idOffer},
        success: async function(resul) { 
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: resul.message,
                showConfirmButton: false,
                timer: 1500
            })
            window.location.href = '/view/myVagasCompany.html'
        }
    }).fail(function(err) {
        console.log(err)
    })
}

function editOffer() {
    window.location.href = `/view/createVaga.html?id=${idOffer}`
}

function redirectUserPage(idVaga, idUser) {
    console.log(idVaga)
    console.log(idUser)
    window.location.href = `/view/perfilUsuaria.html?userId=${idUser}&vagaId=${idVaga}`
}