var auth = window.localStorage.getItem('auth')
var User

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        // $.ajax({
        //     url: "http://localhost:3001/User/Verify/Infos",
        //     headers: {"Authorization": `Bearer ${auth}`},
        //     success: function(resul) { 
        //         nome = resul.name
        //         email = resul.email,
        //         id = resul.id
        //         hardSkills = resul.hardSkills,
        //         softSkills = resul.softSkills,
        //         isVerified = Boolean(resul.isVerified),
        //         imgUser = resul.imgUser

        //         if(!isVerified) {
        //             window.location.href = '/view/verifyAccount.html'
        //         }

        //         document.getElementById('userNameNavBar').innerHTML = `${nome}`
        //         if (imgUser) {
        //             document.getElementById('userImage').src = imgUser 
        //         }
        //     }
        // }).fail(function(err) {
        //     console.log(err.responseJSON.message);
        //     // window.location.href = '../view/login.html'
        // })

        await $.ajax({
            url: "http://localhost:3001/User/User",
            type: "POST",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                User = resul.user

                if(!Boolean(User.isVerified)) {
                    window.location.href = '/view/verifyAccount.html'
                }

                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                if (User.imgUser) {
                    document.getElementById('userImage').src = imgUser 
                }
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '/view/login.html'
        })

        console.log(User)
        document.getElementById('nomeUserCreateForm').value = User.name
        document.getElementById('emailUserCreateForm').value = User.email
        document.getElementById('bornDateUserCreateForm').value = User.bornDate
        document.getElementById('genderUserCreateForm').value = User.gender
        document.getElementById("cpfUserCreateForm").value = formatCnpjCpf(String(User.cpf))
        var firstNumber = String(User.phoneNumber).slice(0, 2);
        var restNumber = String(User.phoneNumber).slice(2)
        console.log(firstNumber, restNumber)
        document.getElementById("number55Input").value = firstNumber
        document.getElementById("number11Input").value = formatacaoNumberFirst(restNumber)
    }
}

async function verifyUserInfos() {
    var nome = document.getElementById("nomeUserCreateForm").value
    var email = document.getElementById("emailUserCreateForm").value
    var bornDate = document.getElementById("bornDateUserCreateForm").value
    var gender = document.getElementById("genderUserCreateForm").value
    var cpf = cpfToDb(document.getElementById("cpfUserCreateForm").value)
    var number
    var prefixNumber = document.getElementById("number55Input").value
    var numberNormal = numberToDb(document.getElementById("number11Input").value);
    number = prefixNumber + numberNormal
    var inputFile = document.getElementById('imageUser').files[0]

    const validate = validateInformations(email, cpf)
    console.log(validate)

    if (validate === true) {
        $.ajax({
            url: "http://localhost:3001/User/Update",
            type: "PUT",
            headers: {"Authorization": `Bearer ${auth}`},
            data: {
                name: nome,
                email: email,
                bornDate: bornDate,
                gender: gender,
                cpf: cpf,
                phoneNumber: number,
            },
            success: async function (resul) {
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "Conta atualizada com sucesso!",
                    showConfirmButton: false,
                    timer: 2000
                })
                encodeImageFileAsURL(inputFile)
                window.location.href = '/view/hubVagas.html'
            },
            error: function (err) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: err.responseJSON.error,
                    showConfirmButton: false,
                    timer: 2000
                })
                console.log(err.responseJSON.error)
            }
        })
    } else {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: validate,
            showConfirmButton: false,
            timer: 2000
        })
    }
}

function encodeImageFileAsURL(element) {
    var reader = new FileReader();

    if (element) {
        reader.onloadend = function () {
            $.ajax({
                url: "http://localhost:3001/User/Update",
                type: "PUT",
                headers: { "Authorization": `Bearer ${auth}` },
                data: {
                    imgUser: reader.result
                },
                success: async function (resul) {
                    console.log('Imagem no Banco')
                    window.location.href = '/view/verifyAccount.html'
                },
                error: function (err) {
                    console.log(err.responseJSON.error)
                }
            })
        }
    } else {
        console.log('Teste')
    }


    reader.readAsDataURL(element);
}

function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, '');
  
  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
  } 
  
  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
}

function formatacaoNumberFirst(num) {
    const phoneNumber = num;
    const length = phoneNumber.length;

    //Efetuando Validações
    if (length < 3) {
        return phoneNumber;
    } 


    if (length < 8) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }

    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`;
}

function numberFormat() {
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

function cpfFormat(i) {
    var v = i.value;

    if (isNaN(v[v.length - 1])) { // impede entrar outro caractere que não seja número
        i.value = v.substring(0, v.length - 1);
        return;
    }

    i.setAttribute("maxlength", "14");
    if (v.length == 3 || v.length == 7) i.value += ".";
    if (v.length == 11) i.value += "-";

}

function numberToDb(number) {
    number = number.replaceAll('(', '');
    number = number.replaceAll(')', '');
    number = number.replaceAll('-', '');
    number = number.replaceAll(' ', '');
    return number
}

function cpfToDb(cpf) {
    cpf = cpf.replaceAll('.', '');
    cpf = cpf.replaceAll('-', '');
    return cpf
}

function validateInformations(email, cpf) {
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return "Email inválido"
    }

    function CPF() { "user_strict"; function r(r) { for (var t = null, n = 0; 9 > n; ++n)t += r.toString().charAt(n) * (10 - n); var i = t % 11; return i = 2 > i ? 0 : 11 - i } function t(r) { for (var t = null, n = 0; 10 > n; ++n)t += r.toString().charAt(n) * (11 - n); var i = t % 11; return i = 2 > i ? 0 : 11 - i } var n = false, i = true; this.gera = function () { for (var n = "", i = 0; 9 > i; ++i)n += Math.floor(9 * Math.random()) + ""; var o = r(n), a = n + "-" + o + t(n + "" + o); return a }, this.valida = function (o) { for (var a = o.replace(/\D/g, ""), u = a.substring(0, 9), f = a.substring(9, 11), v = 0; 10 > v; v++)if ("" + u + f == "" + v + v + v + v + v + v + v + v + v + v + v) return n; var c = r(u), e = t(u + "" + c); return f.toString() === c.toString() + e.toString() ? i : n } }

    let CPFvalidator = new CPF();

    if (!CPFvalidator.valida(cpf)) {
        return "CPF inválido"
    }

    return true
}