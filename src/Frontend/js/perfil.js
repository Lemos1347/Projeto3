let nome
let email
let id

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        $.ajax({
            url: "http://localhost:3001/User/Verify/Infos",
            headers: {"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlhdCI6MTY1MzUzNzQ5OCwiZXhwIjoxNjUzNTQxMDk4LCJzdWIiOiI5ZWNkZGM0NC04NDA5LTRlMTktYjc2Yi0xOTVlZjg0Mzk2NWIifQ.ztTqmDdke_wiWp1i0-wtgY6TXiBhYH1m656RftACIjw`},
            success: function(resul) { 
                console.log(resul)
                nome = resul.name
                email = resul.email,
                id = resul.id
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                checkUser()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
        })
    }
}

let User

async function checkUser() {

    console.log(id)

    await $.ajax({
        url: "http://localhost:3001/User/User",
        type: "POST",
        data: { 
            id: id
        },
        headers: {"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlhdCI6MTY1MzUzNzQ5OCwiZXhwIjoxNjUzNTQxMDk4LCJzdWIiOiI5ZWNkZGM0NC04NDA5LTRlMTktYjc2Yi0xOTVlZjg0Mzk2NWIifQ.ztTqmDdke_wiWp1i0-wtgY6TXiBhYH1m656RftACIjw`},
        success: function(resul) { 
            User = resul.user
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    document.getElementById('descricaoUser').innerHTML = User.name
}