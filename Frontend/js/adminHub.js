function redirectPage(page) {
    document.location.href = `../view/${page}`
}

let nome
let email
let id
let isAdmin

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
                imgUser = resul.imgUser
                isAdmin = Boolean(resul.isAdmin)
                if (isAdmin == false) {
                    window.location.href = '../view/hubVagas.html'
                }
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                if (imgUser) {
                    document.getElementById('userImage').src = imgUser 
                }
                checkVagas()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })
    }
}

let companiesAndUsers = []
let users = []
let companies = []

async function checkVagas() {

    await $.ajax({
        url: "https://matchagas.herokuapp.com/User/Users",
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            users = resul.message
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    await $.ajax({
        url: "https://matchagas.herokuapp.com/Company/Companies",
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            companies = resul.message
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    console.log(users)
    console.log(companies)
    companiesAndUsers = users.concat(companies)
    console.log(companiesAndUsers)
    
    companiesAndUsers.map((user) => {
        document.getElementById('containerOfAll').innerHTML += `
        <div class="col-sm-12 col-md-6 col-lg-4 bodyVagaComponent">
            <div class='vagaComponent'>
                <div class="row mainWidGet">
                    <div class="col-5 imgHubVagas">
                        <img src='../images/userTest.png'>
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent" style="justify-content: space-between;">
                            <h1 class="nomeVagaHubVagas" style="font-size: 15pt;">${user.name}</h1>
                            <div class='divBtnSeeMore'>
                                <button class="btnSeeMoreTrash" onclick = "deleteUser('${user.id}')"><i class="fa fa-trash" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    })

    // users.map((user) => {
    //     document.getElementById('containerOfAll').innerHTML += `
    //     <div class="col-sm-12 col-md-6 col-lg-4 bodyVagaComponent">
    //         <div class='vagaComponent'>
    //             <div class="row mainWidGet">
    //                 <div class="col-5 imgHubVagas">
    //                     <img src='../images/userTest.png'>
    //                 </div>
    //                 <div class="col-7">
    //                     <div class="divRightHubVagasComponent" style="justify-content: space-between;">
    //                         <h1 class="nomeVagaHubVagas" style="font-size: 15pt;">${user.name}</h1>
    //                         <div class='divBtnSeeMore'>
    //                             <button class="btnSeeMoreTrash" onclick = "deleteUser('${user.id}')"><i class="fa fa-trash" aria-hidden="true"></i></button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // `
    // })

    // companies.map((company) => {
    //     document.getElementById('containerOfAll').innerHTML += `
    //     <div class="col-sm-12 col-md-6 col-lg-4 bodyVagaComponent">
    //         <div class='vagaComponent'>
    //             <div class="row mainWidGet">
    //                 <div class="col-5 imgHubVagas">
    //                     <img src='../images/userTest.png'>
    //                 </div>
    //                 <div class="col-7">
    //                     <div class="divRightHubVagasComponent" style="justify-content: space-between;">
    //                         <h1 class="nomeVagaHubVagas" style="font-size: 15pt;">${company.name}</h1>
    //                         <div class='divBtnSeeMore'>
    //                         <button class="btnSeeMoreTrash" onclick="deleteUser('${company.id}')"><i class="fa fa-trash" aria-hidden="true"></i></button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // `
    // })
}

function redirectToVagaId(param) {
    document.location.href = `../view/vagaExpandida.html?id=${param}`
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

async function deleteUser(id) {
    await $.ajax({
        url: "https://matchagas.herokuapp.com/User/Delete/Admin",
        type: "DELETE",
        headers: {"Authorization": `Bearer ${auth}`},
        data: {
            id: id
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
        console.log(err.responseJSON.message)
    })
}