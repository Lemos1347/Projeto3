let auth = window.localStorage.getItem('auth')
let curriculum
let isVerified

let cards = [
  // {
  //     "message": "teste",
  //     "id": 1
  // },
  // {
  //     "message": "teste1",
  //     "id": 2
  // }
]

document.onreadystatechange = async function () {
  if (document.readyState == "complete") {
    $.ajax({
      url: "https://matchagas.herokuapp.com/User/Verify/Infos",
      headers: { "Authorization": `Bearer ${auth}` },
      success: function (resul) {
        console.log(resul)
        curriculum = resul.curriculum
        isVerified = resul.isVerified
        if (!Boolean(isVerified)) {
          window.location.href = '/view/verifyAccount.html'
        }
        if (curriculum) {
          window.location.href = '/view/hubVagas.html'
        }
      }
    }).fail(function (err) {
      console.log(err.responseJSON.message)
      window.location.href = '../view/login.html'
    })
  }
}



function addCards(message) {

  document.getElementById('inputForCard').value = ''

  let lastCard = cards.slice(-1)

  if (lastCard == '') {
    cards.push({ 'message': message, 'id': 1 })
  } else {
    var lastId = lastCard[0].id
    var id = lastId + 1
    cards.push({ 'message': message, 'id': id })
    console.log(cards)
  }

  renderCards()
}

function deleteCard(id) {
  console.log(id)

  var cardDeleted = cards.filter((card) => {
    return card.id == id
  })

  const index = cards.indexOf(cardDeleted[0]);

  if (index > -1) {
    cards.splice(index, 1); // 2nd parameter means remove one item only
  }

  renderCards()
}

function renderCards() {
  document.getElementById('skillCard').innerHTML = ''

  cards.map((card) => {

    console.log('teste')

    document.getElementById('skillCard').innerHTML += `
        <div class="balao-skill d-flex">
            <p>${card.message}</p><button type = 'button' onclick = deleteCard(${card.id})>x</button>
        </div>
        `
  })
}




/* Criar campo para uma nova formação */
var cont = 1
var cont1 = 1
document.getElementById('menos').style.display = "none"

function novaFormacao() {
  cont++
  if (cont > 1) {
    console.log()
    document.getElementById("menos").style.display = "inline"
  }
  newFormation =
    ` <div class="row" id='instru${cont}'>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Instituição<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="instituicao${cont}"type="text" placeholder="digite o nome da instituição"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Diploma<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" type="text" id = 'diploma${cont}' placeholder="Ex.: Bacharelado"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Área de estudos<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="area${cont}" type="text" placeholder="Ex.: Administração"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Data de início<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="dataInicio${cont}" type="date"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Data de término<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="dataTermino${cont}" type="date"></input>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById("newFormation").insertAdjacentHTML("beforeend", newFormation);
}
function removerFormacao() {
  if (cont > 1) {
    let a = document.getElementById(`instru${cont}`)
    a.remove()
    cont--
    if (cont <= 1) {
      document.getElementById("menos").style.display = "none"
    }
  }
}

/* Criar campo para uma nova experiência */
document.getElementById("menos1").style.display = "none"

function novaExperiencia() {
  cont1++
  if (cont1 > 1) {
    console.log()
    document.getElementById("menos1").style.display = "inline"
  }
  newExperience =

    `<div class="row" id='exp${cont1}'>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Empresa<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="empresa${cont1}" type="text" placeholder="digite o nome da empresa"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Cargo<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="cargo${cont1}" type="text" placeholder="digite o nome do cargo"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Local<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="local${cont1}" type="text" placeholder="Ex.: São Paulo, São Paulo"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Data de início<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="experienciaInicio${cont1}" type="date" ></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Data de término<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" id="experienciaTermino${cont1}" type="date"></input>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById("newExperience").insertAdjacentHTML("beforeend", newExperience);
}

function removerExperiencia() {
  if (cont1 > 1) {
    let a = document.getElementById(`exp${cont1}`)
    a.remove()
    cont1--
    if (cont1 <= 1) {
      document.getElementById("menos1").style.display = "none"
    }
  }
}

function verifyInfos() {
  cont = cont + 1;
  cont1 = cont1 + 1;
  let instrucao = []
  let experiencia = []
  let hardSkills = []
  let descricao = document.getElementById('descricao').value;
  let objetivo = document.getElementById('objetivo').value;

  for (i = 1; i != cont; i++) {
    debugger
    const instituicao = document.getElementById(`instituicao${i}`).value
    const diploma = document.getElementById(`diploma${i}`).value
    const area = document.getElementById(`area${i}`).value
    const dataInicio = document.getElementById(`dataInicio${i}`).value
    const dataTermino = document.getElementById(`dataTermino${i}`).value
    if (instituicao == "" || diploma == "" || area == "" || dataInicio == "" || dataTermino == "" || descricao == "" || objetivo == "") {
      cont = cont - 1;
      cont1 = cont1 - 1;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Campos obrigatórios vazios!",
        showConfirmButton: false,
        timer: 2000
      })
      return false
    } else {
      const inst = {
        instituicao: instituicao,
        diploma: diploma,
        area: area,
        dataInicio: dataInicio,
        dataTermino: dataTermino
      }
      instrucao.push(inst)
    }

  }

  for (i = 1; i != cont1; i++) {
    const empresa = document.getElementById(`empresa${i}`).value
    const cargo = document.getElementById(`cargo${i}`).value
    const local = document.getElementById(`local${i}`).value
    const dataInicio = document.getElementById(`experienciaInicio${i}`).value
    const dataTermino = document.getElementById(`experienciaTermino${i}`).value
    if (empresa == "" || cargo == "" || local == "" || dataInicio == "" || dataTermino == "") {
      cont = cont - 1;
      cont1 = cont1 - 1;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Campos obrigatórios vazios!",
        showConfirmButton: false,
        timer: 2000
      })
      return false
    } else {
      const exp = {
        empresa: empresa,
        cargo: cargo,
        local: local,
        dataInicio: dataInicio,
        dataTermino: dataTermino
      }
      experiencia.push(exp)
    }

  }

  cards.map((card) => {
    hardSkills.push(card.message)
  })

  if (hardSkills.length == 0) {
    cont = cont - 1;
    cont1 = cont1 - 1;
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: "Campos obrigatórios vazios!",
      showConfirmButton: false,
      timer: 2000
    })
    return false
  } else {

    let curriculum = {
      instrucao: instrucao,
      experiencia: experiencia,
      descricao: descricao,
      objetivo: objetivo
    }

    curriculum = JSON.stringify(curriculum)

    $.ajax({
      url: "https://matchagas.herokuapp.com/User/Update",
      type: "PUT",
      headers: { "Authorization": `Bearer ${auth}` },
      data: {
        curriculum: curriculum,
        hardSkills: hardSkills
      },
      success: async function (resul) {
        await Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Currículo Registrado com sucesso",
          showConfirmButton: false,
          timer: 2000
        })
        window.location.href = '/view/testeSoftSkill.html'
      },
      error: function (err) {
        console.log(err.responseJSON.error)
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.responseJSON.error,
          showConfirmButton: false,
          timer: 2000
        })
      }
    })
  }
}

function skipCreate() {
  window.location = "/view/hubVagas.html";
}