let User
let idUser
let idVaga

let auth = window.localStorage.getItem('auth')

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        $.ajax({
            url: "https://matchagas.herokuapp.com/Company",
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

                document.getElementById('userImage').src = logo_company
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                loadStatus()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })

        const params = new URLSearchParams(window.location.search)
        idUser = params.get('userId')
        idVaga = params.get('vagaId')
        console.log(idUser)
        $.ajax({
            url: "https://matchagas.herokuapp.com/Apply/User",
            type: "POST",
            headers: {"Authorization": `Bearer ${auth}`},
            data: {
                userID: idUser
            },
            success: function(resul) { 
                User = resul.user
                
                console.log(User)
                if (User.hardSkills) {
                    let hardSkills = User.hardSkills.split(",")
                    document.getElementById('hardSkillList').innerHTML = ''
                    hardSkills.map((skill) => {
                        document.getElementById('hardSkillList').innerHTML += `<li>${skill}</li>`
                    }) 
                }

                if (User.curriculum) {
                    let curriculum = JSON.parse(User.curriculum)
                    document.getElementById('descricaoUser').innerHTML = curriculum.descricao
                    document.getElementById('objetivoUser').innerHTML = curriculum.objetivo
                }
                
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })
    }
}

function accept() {
    $.ajax({
        url: "https://matchagas.herokuapp.com/Apply",
        type: "POST",
        headers: {"Authorization": `Bearer ${auth}`},
        data: {
            idUser: idUser,
            idVaga: idVaga,
            status: "Aprovado"
        },
        success: async function(resul) {
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
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.responseJSON.message,
            showConfirmButton: false,
            timer: 1500
        })
    })
}

function decline() {
    $.ajax({
        url: "https://matchagas.herokuapp.com/Apply",
        type: "POST",
        headers: {"Authorization": `Bearer ${auth}`},
        data: {
            idUser: idUser,
            idVaga: idVaga,
            status: "Reprovado"
        },
        success: async function(resul) {
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
        console.log(err)
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.responseJSON.message,
            showConfirmButton: false,
            timer: 1500
        })
    })
}


function loadStatus() {
    $.ajax({
        url: "https://matchagas.herokuapp.com/Apply/Status",
        type: "POST",
        headers: {"Authorization": `Bearer ${auth}`},
        data: {
            idVaga: idVaga,
            idUser: idUser
        },
        success: function(resul) {
            if (resul.user.status == 'Aprovado') {
                document.getElementById('acceptBtn').style.display = 'none'
            } else if (resul.user.status == 'Reprovado') {
                document.getElementById('declineBtn').style.display = 'none'
            }
        }
    }).fail(function(err) {
        console.log(err)
    })
}