function recoveryPassword() {
    const email = document.getElementById('emailForgot').value;

    console.log('teste')

    $.ajax({
        url: "http://localhost:3001/User/Reset/Password",
        method: "POST",
        data: {
            email: email
        },
        success: function(resul) { 
            if(resul.trueMessage === false) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: "Email informado não está verificado",
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                window.sessionStorage.setItem('emailForRecovery', email)
                window.location.href = '/view/changePassword.html'
            }
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })
}