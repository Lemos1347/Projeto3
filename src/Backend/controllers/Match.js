const match = (req, res) => {
    const { softSkillUser, softSkillOffer } = req.body;

    // softSkillOffer = JSON.parse(softSkillOffer)
    // softSkillUser = JSON.parse(softSkillUser)

    console.log(softSkillOffer)
    console.log(softSkillUser)
}

module.exports = {
    match
}
    