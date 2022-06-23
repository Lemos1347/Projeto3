let nome
let email
let id
let hardSkills
let softSkills
let isVerified
let imgUser

const auth = window.localStorage.getItem('auth')

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        $.ajax({
            url: "http://localhost:3001/User/Verify/Infos",
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

                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                if (imgUser) {
                    document.getElementById('userImage').src = imgUser 
                }
                checkUser()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message);
            window.location.href = '../view/login.html'
        })
    }
}

let User

async function checkUser() {

    await $.ajax({
        url: "http://localhost:3001/User/User",
        type: "POST",
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            User = resul.user
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })
    console.log(User)

    document.getElementById('nomePerfil').innerHTML = User.name

    if (User.imgUser) {
        document.getElementById('userPhoto').src = User.imgUser
    }
    
    if (User.hardSkills) {
        document.getElementById('hardSkillList').innerHTML = ""
        let hardSkills = User.hardSkills.split(",")
        hardSkills.map((skill) => {
           document.getElementById('hardSkillList').innerHTML += `<li>${skill}</li>`
        })
    }
    
    if (User.curriculum){
        const curriculum = JSON.parse(User.curriculum)

        document.getElementById('descricaoUser').innerHTML = curriculum.descricao
        document.getElementById('objetivoUser').innerHTML = curriculum.objetivo
    }

    
}

function deleteAccount() {
    $.ajax({
        url: "http://localhost:3001/User/Delete",
        headers: {"Authorization": `Bearer ${auth}`},
        type: "DELETE",
        success: async function(resul) { 
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: resul.message,
                showConfirmButton: false,
                timer: 1500
            })
            window.location.href = '/view/Login.html'
        }
    }).fail(async function(err) {
        console.log(err.responseJSON.message);
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.responseJSON.message,
            showConfirmButton: false,
            timer: 1500
        })
    })
}

function redirectEdit() {
    window.location.href = '/view/editUser.html'
}