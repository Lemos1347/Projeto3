
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


function addCards(message) {

    document.getElementById('inputForCard').value = ''
   
    let lastCard = cards.slice(-1)

    if (lastCard == '') {
        cards.push({'message': message, 'id': 1})
    } else {
        var lastId = lastCard[0].id
        var id = lastId + 1
        cards.push({'message': message, 'id': id})
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

// function updateCards() {
//     cards.map((card) => {
//         document.getElementById('skillCard').innerHTML += `
//         <div class="balao-skill d-flex">
//             <p>${card.message}</p><button>x</button>
//         </div>
//         `
//     })
//     console.log(cards)
// }

// cards.push = function() { Array.prototype.push.apply(this, arguments);  updateCards();};

function verifyInfos() {

    var randomNumber = generateRandomNumber()
    console.log(randomNumber)
    if (randomNumber != 0) {
        document.location.href = '../view/testeSoftSkill.html'
    } else {
        document.getElementById('alertContainer').style.display = 'flex';
    
        document.getElementById('alertContainer').scrollIntoView();
        window.scroll(0, -150)
    
        setTimeout(() => {
            document.getElementById('alertContainer').style.display = 'none'
        }, "4000")
    }
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 300)
}

/* Criar campo para uma nova formação */
var cont = 1
if(cont <= 1){
  document.getElementById("menos").style.display = "none"
}
function novaFormacao(){
    cont++
    if(cont > 1){
      console.log()
      document.getElementById("menos").style.display = "inline"
    }
    document.getElementById("newFormation").innerHTML +=
    `<div class="row" id=${cont}>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Formação<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" type="text" placeholder="Instituição de Ensino"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Curso<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" type="text" placeholder="Formação acadêmica"></input>
        </div>
      </div>
    </div>
  </div>`
}
function menos(){
  if(cont>1){
    let a = document.getElementById(`${cont}`)
    a.remove()
    cont--
    if(cont <= 1){
      document.getElementById("menos").style.display = "none"
    }
  }
}

/* Criar campo para uma nova experiência */
var cont1 = 1
if(cont1 <= 1){
  document.getElementById("menos1").style.display = "none"
}
function novaExperiencia(){
  cont1 ++
  if(cont1 > 1){
    console.log()
    document.getElementById("menos1").style.display = "inline"
  }
    document.getElementById("newExperience").innerHTML +=
    `<div class="row" id=${cont1}>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Empresa<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" type="text" placeholder="Empresa em que trabalhava"></input>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 listaInputs">
      <div class="row inputDiv">
        <div class="col-10 ">
          <span class="textGeneralInput">Cargo<span class="neededInput">*</span></span>
        </div>
        <div class="col-10">
          <input class="generalInput" type="text" placeholder="Cargo na empresa"></input>
        </div>
      </div>
    </div>
  </div>`
}
function menos1(){
  if(cont1>1){
    let a = document.getElementById(`${cont1}`)
    a.remove()
    cont1--
    if(cont1 <= 1){
      document.getElementById("menos1").style.display = "none"
    }
  }
}
