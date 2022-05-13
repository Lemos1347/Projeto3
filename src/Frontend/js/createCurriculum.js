
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

