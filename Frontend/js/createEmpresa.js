var auth;

async function verifyCompanyInfos() {
    var razaoSoc = document.getElementById("company_name").value
    var email = document.getElementById("email").value
    var senha = document.getElementById("password").value
    var cnpj = cnpjToDb(document.getElementById("cnpj").value)
    var number
    var prefixNumber = document.getElementById("number55Input").value
    var numberNormal = numberToDb(document.getElementById("number11Input").value);
    number = prefixNumber + numberNormal
    var inputFile = document.getElementById('logo').files[0]

    const validate = validateInformations(email, cnpj, senha)
    console.log(validate)

    if (validate === true) {
        window.scroll(0, -5000)
        document.getElementById('loadTriangulo').style.display = 'flex';
        $.ajax({
            url: "https://matchagas.herokuapp.com/Company/Register",
            type: "POST",
            data: {
                name: razaoSoc,
                email: email,
                password: senha,
                cnpj: cnpj,
                phoneNumber: number,
                logo: ""
            },
            success: async function (resul) {
                console.log(resul.message)
                document.getElementById('loadTriangulo').style.display = 'none';
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "Conta criada com sucesso!",
                    showConfirmButton: false,
                    timer: 2000
                })
                $.post("https://matchagas.herokuapp.com/User/Login",
                    {
                        email: email,
                        password: senha
                    }
                    , function (msg) {
                        if (msg.token) {
                            window.localStorage.setItem('auth', msg.token)
                            auth = msg.token
                            encodeImageFileAsURL(inputFile)
                        }
                    }).fail(function (err) {
                        console.log(err.responseJSON.error)
                    })
            },
            error: function (err) {
                document.getElementById('loadTriangulo').style.display = 'none';
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
                url: "https://matchagas.herokuapp.com/Company/Update",
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
        $.ajax({
            url: "https://matchagas.herokuapp.com/User/Update",
            type: "PUT",
            headers: { "Authorization": `Bearer ${auth}` },
            data: {
                logo: ''
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

    // const cnpjCpf = value.replace(/\D/g, '');

    // if (cnpjCpf.length === 11) {
    //     return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
    // } 

    // return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
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


    if (!senha.match(/[a-z]+/)) {
        return "Senha deve possuir letras minúsculas"
    }
    if (!senha.match(/[A-Z]+/)) {
        return "Senha deve possuir letras maiúsculas"
    }
    if (!senha.match(/[0-9]+/)) {
        return "Senha deve possuir números"
    }
    if (!senha.match(/[$@#&!]+/)) {
        return "Senha deve possuir caracteres especíais"
    }

    return true
}