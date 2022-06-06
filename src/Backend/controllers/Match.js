const match = (req, res) => {
    // const teste1 = {
    //     skill1: 'teste',
    //     skill2: 'teste2',
    //     skill3: 'teste3'
    // }
    let teste1 = 'skill1, skill2, skill3'
    let { softSkillUser, softSkillOffer } = req.body;

    softSkillOffer = JSON.parse(String(softSkillOffer))
    softSkillUser = JSON.parse(String(softSkillUser))

    var teste = teste1.split(" ")

    console.log(softSkillOffer)
    console.log(softSkillUser)
    console.log(teste)
}

module.exports = {
    match
}
    