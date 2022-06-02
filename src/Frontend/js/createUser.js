function verifyUserInfos() {
    var nome = document.getElementById("nomeUserCreateForm").value
    var email = document.getElementById("emailUserCreateForm").value
    var senha = document.getElementById("senhaUserCreateForm").value
    var bornDate = document.getElementById("bornDateUserCreateForm").value
    var gender = document.getElementById("genderUserCreateForm").value
    var cpf = document.getElementById("cpfUserCreateForm").value
    var number
    var prefixNumber = document.getElementById("number55Input").value
    var numberNormal = document.getElementById("number11Input").value;
    numberNormal = numberNormal.replaceAll('(', '');
    numberNormal = numberNormal.replaceAll(')', '');
    numberNormal = numberNormal.replaceAll('-', '');
    numberNormal = numberNormal.replaceAll(' ', '');
    number = prefixNumber + numberNormal

    $.ajax({
        url: "http://localhost:3001/User/Register",
        type: "POST",
        data: { 
            name: nome,
            email: email,
            password: senha,
            bornDate: bornDate,
            gender: gender,
            cpf: cpf,
            phoneNumber: number,
            typeOfUser: "user"
        },
        success: function(resul) {
            console.log(resul.message)
        },
        error: function(err) {
            console.log(err.responseJSON.error)
        }
    })
    console.log(nome, email, bornDate, gender, cpf, number)
}

function numberFormat() {
    console.log('foi')
    const input = document.getElementById('number11Input');
    const formatado = formatacao(input.value);
    console.log(formatado)
    input.value = formatado;
}

function formatacao(num) {
    const phoneNumber = num.replace(/[^\d]/g, '');
    const length = phoneNumber.length;

    //Efetuando Validações
    if (length < 3) {
        return phoneNumber;
    } 


    if (length < 8) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }

    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
      2,
      7
    )}-${phoneNumber.slice(7, 10)}`;
}
