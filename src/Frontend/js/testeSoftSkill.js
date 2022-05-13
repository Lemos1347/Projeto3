/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        window.localStorage.setItem('question', 0)
        document.getElementById('questionNumber').innerHTML = 'Questão 1/10'
        document.getElementById('questionMessage').innerHTML = Perguntas[0].pergunta
    }
}

const Perguntas = [
    {
        'id': 0,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 1 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 1,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 2 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 2,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 3 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 3,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 4 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 4,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 5 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 5,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 6 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 6,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 7 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },{
        'id': 7,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 8 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 8,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 9 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
    {
        'id': 9,
        'selectedAnswer': '',
        'pergunta': 'Esse é um teste para a pergunta que irá vir na página de número 10 do nosso teste de SoftSkill, sendo assim conseguimos verificar se está tudo funcionadno corretamente, para que de tude de bom na apresentação :)'
    },
]

//Chamado toda vez que um dos botões é pressionado
function passPage(operationType) {
    let numQuestion = window.localStorage.getItem('question')

    if (numQuestion == '0') {
        if (operationType == 'back') {
            operationType = ''
        }
    } else if (numQuestion == '9') {
        if (operationType == 'pass') {
            operationType = ''
        } 
    }

    if(numQuestion == null || numQuestion == undefined || numQuestion == '') {
        window.localStorage.setItem('question', 0)
        passPage()
    } else if (operationType === 'pass') {
        numQuestion = Number(numQuestion)
        var newNumQuestion = numQuestion + 1;
        window.localStorage.setItem('question', newNumQuestion)
        let answer = verifyAnswer()
        recordAnswer(numQuestion, answer)
        resetAnswers()
        renderQuestion(newNumQuestion)
    } else if (operationType === 'back') {
        numQuestion = Number(numQuestion)
        var newNumQuestion = numQuestion - 1;
        window.localStorage.setItem('question', newNumQuestion)
        let answer = verifyAnswer()
        recordAnswer(numQuestion, answer)
        resetAnswers()
        renderQuestion(newNumQuestion)
    }
}

function renderQuestion(number) {
    var numForUser = number + 1
    document.getElementById('questionNumber').innerHTML = `Questão ${numForUser}/10`
    document.getElementById('questionMessage').innerHTML = Perguntas[number].pergunta
    if (Perguntas[number].selectedAnswer == '') {
        return
    } else {
        document.getElementById(Perguntas[number].selectedAnswer).checked = true
    }
    
}

function recordAnswer(number, answer) {
    Perguntas[number].selectedAnswer = answer
}

function verifyAnswer() {
    if (document.getElementById('concTotal').checked == true) {
        let answer = 'concTotal'
        return answer
    } else if (document.getElementById('concParc').checked == true) {
        let answer = 'concParc'
        return answer
    } else if (document.getElementById('meio').checked == true) {
        let answer = 'meio'
        return answer
    } else if (document.getElementById('disParc').checked == true) {
        let answer = 'disParc'
        return answer
    } else if (document.getElementById('disTotal').checked == true) {
        let answer = 'disTotal'
        return answer
    } else {
        let answer = ''
        return answer
    }
}

function resetAnswers() {
    document.getElementById('concTotal').checked = false
    document.getElementById('concParc').checked = false
    document.getElementById('meio').checked = false
    document.getElementById('disParc').checked = false
    document.getElementById('disTotal').checked = false
}