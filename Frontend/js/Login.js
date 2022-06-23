// $(document).ready(function(){
//     //Inicia os valores quando o botão for clicado
//     $(".btnEntrarLogin").click(function(){
//         console.log('rodou')
//         var email = $(".inputLogin").val();
//         alert(email);
//     });

var pressEnter = document.getElementById('passWord')
pressEnter.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        verifyLogin()
    }
});

function verifyLogin() {
    $.post("https://matchagas.herokuapp.com/User/Login",
    {"email" : $("#email").val(), 
    "password" : $("#passWord").val()}
    , function(msg){
        if(msg.token) {
            window.localStorage.setItem('auth', msg.token)
            if (msg.typeOfUser == 'user') {
                $.ajax({
                    url: "https://matchagas.herokuapp.com/User/Verify/Curriculum",
                    type: "GET",
                    headers: {"Authorization": `Bearer ${msg.token}`},
                    success: function(resul) {
                        var test = window.localStorage.getItem('3e3c48b00c353bd2e99423f6a173a4b4')
                        if (!test) {
                            window.localStorage.setItem('3e3c48b00c353bd2e99423f6a173a4b4', 0)
                        }
                        var times = Number(window.localStorage.getItem('3e3c48b00c353bd2e99423f6a173a4b4'))
                        window.localStorage.setItem('3e3c48b00c353bd2e99423f6a173a4b4', times + 1)
                        if (resul.haveCurriculum === true) {
                            document.location.href = '../view/hubVagas.html'
                        } else {
                            document.location.href = '../view/createCurriculum.html'
                        }
                    }
                }).fail(function(err) {
                    console.log(err.responseJSON.error)
                    errorMessage(err.responseJSON.error)
                })
            } else {
                document.location.href = '../view/myVagasCompany.html'
            }
        }
    }).fail(function(err) {
        errorMessage(err.responseJSON.error)
    })
}

function errorMessage(content) {

    //Define o erro na MODAL
    document.getElementById('contentError').innerHTML = content

    document.getElementById('alertContainer').style.display = 'flex';

    document.getElementById('alertContainer').scrollIntoView();
    window.scroll(0, -150)

    setTimeout(() => {
        document.getElementById('alertContainer').style.display = 'none'
    }, "4000")
}