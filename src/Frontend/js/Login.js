// $(document).ready(function(){
//     //Inicia os valores quando o botão for clicado
//     $(".btnEntrarLogin").click(function(){
//         console.log('rodou')
//         var email = $(".inputLogin").val();
//         alert(email);
//     });

function verifyLogin() {
    $.post("http://localhost:3001/User/Login",
    {"email" : $("#email").val(), 
    "password" : $("#passWord").val()}
    , function(msg){
        if(msg.token) {
            console.log('teste')
            // document.location.href = '../view/createCurriculum.html'
            setInfos(msg.id, msg.name, msg.email, msg.token)
        }
    }).fail(function(err) {
        errorMessage(err.responseJSON.error)
    })

    // if (email == 'test@test.com' && password == 'abc123456') {
    //     document.location.href = '../view/createCurriculum.html'
    //     window.localStorage.setItem('userName', 'Usuário Teste')
    // } else {
    //     errorMessage('Usuário e/ou senha inválidos')
    // }
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