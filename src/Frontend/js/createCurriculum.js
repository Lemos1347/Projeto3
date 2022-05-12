
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
    let lastCard = cards.slice(-1)

    if (lastCard == '') {
        cards.push({'message': message, 'id': 1})
    } else {
        var lastId = lastCard[0].id
        var id = lastId + 1
        cards.push({'message': message, 'id': id})
    }
    renderCards()
    console.log(cards)
}

function deleteCard(id) {
    var cardDeleted = cards.filter((card) => {
        card.id != id        
    })

    cards = cardDeleted

    renderCards()
}

function renderCards() {
    cards.map((card) => {
        document.getElementById('skillCard').innerHTML += `
        <div class="balao-skill d-flex">
            <p>${card.message}</p><button type = 'button' onclick = deleteCard(${card.id})>x</button>
        </div>
        `
    })
}

addCards('Testeeeee')
addCards('Testeeeee2')

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
        document.location.href = '../view/hubVagas.html'
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

