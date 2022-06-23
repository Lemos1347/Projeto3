let company_name
let email
let id
let cnpj
let isVerified
let logo_company

let auth = window.localStorage.getItem('auth')

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        auth = window.localStorage.getItem('auth')
        $.ajax({
            url: "http://localhost:3001/Company",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                console.log(resul)
                email = resul.email
                company_name = resul.name_company
                companyId = resul.id
                isVerified = resul.isVerified
                logo_company = resul.logo_company
                phoneNumber = resul.phoneNumber
                cnpj = resul.cnpj
                if (resul.isCompany == false) {
                    window.location.href = '/view/hubVagas.html'
                }

                if (!Boolean(isVerified)) {
                    window.location.href = '/view/verifyAccount.html'
                }
                document.getElementById('userNameNavBar').innerHTML = company_name
                document.getElementById('userImage').src = logo_company
                checkCompany()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message);
            window.location.href = '../view/hubVagas.html'
        })
    }
}

async function checkCompany() {
    document.getElementById('nomePerfil').innerHTML = company_name
    document.getElementById('userPhoto').src = logo_company
    document.getElementById('cnpj').innerHTML = formatCnpjCpf(String(cnpj))
    document.getElementById('telefone').innerHTML = formatacao(String(phoneNumber).slice(2))
    document.getElementById('email').innerHTML = email
}

function formatCnpjCpf(value)
{
  const cnpjCpf = value.replace(/\D/g, '');
  
  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
  } 
  
  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
}

function formatacao(num) {
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

function deleteAccount() {
    $.ajax({
        url: "http://localhost:3001/Company/Delete",
        headers: {"Authorization": `Bearer ${auth}`},
        type: "DELETE",
        success: async function(resul) { 
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Empresa deletada',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.href = '/view/Login.html'
        }
    }).fail(async function(err) {
        console.log(err.responseJSON.message);
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.responseJSON.message,
            showConfirmButton: false,
            timer: 1500
        })
    })
}

function redirectEdit() {
    window.location.href = '/view/editEmpresa.html'
}