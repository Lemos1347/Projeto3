

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