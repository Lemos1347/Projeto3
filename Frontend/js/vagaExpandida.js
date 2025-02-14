let nome
let email
let id
let logo_company

let idOffer

let auth = window.localStorage.getItem('auth')

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        const params = new URLSearchParams(window.location.search)
        idOffer = params.get('id')
        $.ajax({
            url: "https://matchagas.herokuapp.com/User/Verify/Infos",
            type: "GET",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                console.log(resul)
                nome = resul.name
                email = resul.email,
                id = resul.id
                imgUser = resul.imgUser
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                document.getElementById('imgUser').src = imgUser
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

    //Verifica se usuário está aplicado ou não para a determinada vaga
    await $.ajax({
        url: "https://matchagas.herokuapp.com/Offer/VerifyApply",
        type: "POST",
        data: { 
            idVaga: idOffer
        },
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            console.log(resul.applied)
            if (resul.applied === true) {
                document.getElementById("candidatarBtn").style.display = "none"
            } else {
                document.getElementById("removeCandidatarBtn").style.display = "none"
            }

        }
    }).fail(function(err) {
        console.log(err.responseJSON.error)
        alert(err.responseJSON.error)
    })

    await $.ajax({
        url: "https://matchagas.herokuapp.com/Offer/offerExpanded",
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

    document.getElementById('nameCompOffer').innerHTML = Offer.name_company
    document.getElementById('localOffer').innerHTML = Offer.location
    document.getElementById('typeOffer').innerHTML = Offer.type
    document.getElementById('descriptionOffer').innerHTML = Offer.description
    document.getElementById('nameOffer').innerHTML = Offer.name
    if (Offer.logo_company) {
        document.getElementById('logoCompany').src = Offer.logo_company
    }
    

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

function applyOffer() {
    $.ajax({
        url: "https://matchagas.herokuapp.com/Offer/Apply",
        type: "POST",
        data: { 
            idVaga: idOffer
        },
        headers: {"Authorization": `Bearer ${auth}`},
        success: async function(resul) {
            console.log(resul.message)
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: resul.message,
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload()
        },
        error: function(err) {
            console.log(err.responseJSON.error)
        }
    })
}

function removeOffer() {
    $.ajax({
        url: "https://matchagas.herokuapp.com/Offer/RemoveApply",
        type: "DELETE",
        data: { 
            idVaga: idOffer
        },
        headers: {"Authorization": `Bearer ${auth}`},
        success: async function(resul) { 
            console.log(resul.message)
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: resul.message,
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload()
        }
    }).fail(function(err) {
        console.log(err.responseJSON.error)
        alert((err.responseJSON.error))
    })
}