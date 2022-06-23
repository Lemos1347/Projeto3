var auth = window.localStorage.getItem('auth')
var nome
var numero
var cnpj
var email

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        await $.ajax({
            url: "http://localhost:3001/Company",
            type: "GET",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                console.log(resul)
                nome = resul.name_company
                numero = resul.phoneNumber
                cnpj = resul.cnpj
                email = resul.email
                var isVerified = resul.isVerified
                var logo = resul.logo

                if(!Boolean(isVerified)) {
                    window.location.href = '/view/verifyAccount.html'
                }

                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                if (logo) {
                    document.getElementById('userImage').src = logo
                }
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '/view/login.html'
        })

        // console.log(User)
        document.getElementById("company_name").value = nome
        document.getElementById("email").value = email
        document.getElementById("cnpj").value = formatCnpjCpf(String(cnpj))
        var firstNumber = String(numero).slice(0, 2);
        var restNumber = String(numero).slice(2)
        document.getElementById("number55Input").value = firstNumber
        document.getElementById("number11Input").value = formatacaoNumberFirst(restNumber)
    }
}

async function verifyCompanyInfos() {
    var razaoSoc = document.getElementById("company_name").value
    var email = document.getElementById("email").value
    var cnpj = cnpjToDb(document.getElementById("cnpj").value)
    var number
    var prefixNumber = document.getElementById("number55Input").value
    var numberNormal = numberToDb(document.getElementById("number11Input").value);
    number = prefixNumber + numberNormal
    var inputFile = document.getElementById('logo').files[0]

    const validate = validateInformations(email, cnpj)
    console.log(validate)

    if (validate === true) {
        $.ajax({
            url: "http://localhost:3001/Company/Update",
            type: "PUT",
            headers: {"Authorization": `Bearer ${auth}`},
            data: {
                name: razaoSoc,
                email: email,
                cnpj: cnpj,
                phoneNumber: number,
            },
            success: async function (resul) {
                console.log(resul.message)
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "Conta atualizada com sucesso!",
                    showConfirmButton: false,
                    timer: 2000
                })
                encodeImageFileAsURL(inputFile)
                window.location.href = '/view/perfilCompany.html'
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
                url: "http://localhost:3001/Company/Update",
                type: "PUT",
                headers: { "Authorization": `Bearer ${auth}` },
                data: {
                    logo: reader.result
                },
                success: async function (resul) {
                    console.log('Logo no Banco')
                    window.location.href = '/view/verifyAccount.html'
                },
                error: function (err) {
                    console.log(err.responseJSON.error)
                }
            })
        }
    } else {
        console.log('Nenhuma logo passada')
    }


    reader.readAsDataURL(element);
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

function cnpjFormat(i) {
    var v = i.value;

    if (isNaN(v[v.length - 1])) { // impede entrar outro caractere que não seja número
        i.value = v.substring(0, v.length - 1);
        return;
    }

    i.setAttribute("maxlength", "18");
    if (v.length == 2 || v.length == 6) i.value += ".";
    if (v.length == 10) i.value += "/";
    if (v.length == 15) i.value += "-";
}

function numberToDb(number) {
    number = number.replaceAll('(', '');
    number = number.replaceAll(')', '');
    number = number.replaceAll('-', '');
    number = number.replaceAll(' ', '');
    return number
}

function cnpjToDb(cpf) {
    cpf = cpf.replaceAll('.', '');
    cpf = cpf.replaceAll('-', '');
    cpf = cpf.replaceAll('/', '');
    return cpf
}

function validateInformations(email, cnpj, senha) {
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return "Email inválido"
    }


    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return "CNPJ inválido";

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return "CNPJ inválido";

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return "CNPJ inválido";
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return "CNPJ inválido";

    
    return true
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