var auth
var isCompany

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        auth = window.localStorage.getItem('auth')

        await $.ajax({
            url: "https://matchagas.herokuapp.com/Company",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                console.log(resul)
                if (resul.isCompany == true) {
                    isCompany = true
                } else {
                    isCompany = false
                }
            }
        }).fail(function(err) {
            console.log(err);
            window.location.href = '../view/login.html'
        })

        console.log(isCompany)

        if (isCompany) {
            $.ajax({
                url: "https://matchagas.herokuapp.com/Company",
                headers: {"Authorization": `Bearer ${auth}`},
                success: function(resul) { 
                    var isVerified = resul.isVerified
                    if (Boolean(isVerified)) {
                        window.location.href = '/view/myVagasCompany.html'
                    }
                }
            }).fail(function(err) {
                console.log(err.responseJSON.message);
                window.location.href = '../view/login.html'
            })
        } else {
            $.ajax({
                url: "https://matchagas.herokuapp.com/User/Verify/Infos",
                headers: {"Authorization": `Bearer ${auth}`},
                success: function(resul) { 
                    var isVerified = Boolean(resul.isVerified)

                    if(isVerified) {
                        window.location.href = '/view/createCurriculum.html'
                    }
                }
            }).fail(function(err) {
                console.log(err)
                window.location.href = '../view/login.html'
            }) 
        }
        
        const params = new URLSearchParams(window.location.search)
        token = params.get('token')
    
        if (token) {
            document.getElementById('text-lock').style.display = 'block'
            $.ajax({
                url: "https://matchagas.herokuapp.com/User/VerifyAccount",
                headers: {"Authorization": `Bearer ${auth}`},
                data: {
                    token: token
                },
                method: "POST",
                success: async function(resul) { 
                    console.log(resul)
                    document.getElementById('text-lock').style.display = 'none'
                    document.getElementById('text-unlock').style.display = 'block'
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: resul.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).fail(async function(err) {
                console.log(err.responseJSON.error)
                await Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: err.responseJSON.error,
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.href = '/view/verifyAccount.html'
            })
        } else {
            document.getElementById('text-unlock').style.display = 'none'
            document.getElementById('text-lock').style.display = 'block'
        }
    }
}

function resend() {
    if (isCompany) {
        $.ajax({
            url: "https://matchagas.herokuapp.com/Company/VerifyCode",
            headers: {"Authorization": `Bearer ${auth}`},
            data: {
                token: token
            },
            method: "GET",
            success: async function(resul) { 
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: resul.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }).fail(async function(err) {
            console.log(err.responseJSON.error)
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: err.responseJSON.error,
                showConfirmButton: false,
                timer: 1500
            })
        })
    } else {
        $.ajax({
            url: "https://matchagas.herokuapp.com/User/VerifyCode",
            headers: {"Authorization": `Bearer ${auth}`},
            data: {
                token: token
            },
            method: "GET",
            success: async function(resul) { 
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: resul.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }).fail(async function(err) {
            console.log(err.responseJSON.error)
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: err.responseJSON.error,
                showConfirmButton: false,
                timer: 1500
            })
        }) 
    }
    
}

function start(){
    if (isCompany) {
        $.ajax({
            url: "https://matchagas.herokuapp.com/Company",
            headers: {"Authorization": `Bearer ${auth}`},
            success: async function(resul) { 
                var isVerified = resul.isVerified
                if (!Boolean(isVerified)) {
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Empresa ainda não verificada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    window.location.href = '../view/myVagasCompany.html'
                }
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message);
            window.location.href = '../view/login.html'
        })
    } else {
        $.ajax({
            url: "https://matchagas.herokuapp.com/User/Verify/Infos",
            headers: {"Authorization": `Bearer ${auth}`},
            success: async function(resul) { 
                var isVerified = Boolean(resul.isVerified)

                if(!isVerified) {
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Usuário ainda não verificado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    window.location.href = '../view/createCurriculum.html'
                }
            }
        }).fail(function(err) {
            window.location.href = '../view/login.html'
        }) 
    }
}