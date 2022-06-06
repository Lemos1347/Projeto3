const match = (req, res) => {
    let { userSoft, offerSoft } = req.body;

    //Substitui todos os elementos indesejáveis
    userSoft = userSoft.replaceAll('"', "")
    userSoft = userSoft.replaceAll('[', "")
    userSoft = userSoft.replaceAll(']', "")

    offerSoft = offerSoft.replaceAll('"', "")
    offerSoft = offerSoft.replaceAll('[', "")
    offerSoft = offerSoft.replaceAll(']', "")

    //Transforma uma lista "1,2,3,4,5,6,7" em [1,2,3,4,5,6,7]
    userSoft = JSON.parse("[" + userSoft + "]");
    offerSoft = JSON.parse("[" + offerSoft + "]");

    // const userSoft = [2, 1, 0, 2, 1, 3, 0, 4, 3, 2]
    // const offerSoft = [2, 3, 4, 0, 1, 1, 2, 0, 4, 0]
    let porcentagemTotal = 0
    let match

    match = 0
    porcentagemTotal = 0
    for (i in offerSoft){
        if (offerSoft[i] != 2){
            if (offerSoft[i] == userSoft[i]){
                porcentagemTotal += 100
            }
            let subtracao = offerSoft[i] - userSoft[i]
            if (subtracao < 0) {
                subtracao = String(subtracao).slice(1)
            }
            if (subtracao == 0){
                porcentagemTotal += 100
            } else if (subtracao == 1){
                porcentagemTotal += 95
            } else if (subtracao == 2) {
                porcentagemTotal += 68
            } else {
                porcentagemTotal += 0
            }
        } else {
            if (offerSoft[i] == userSoft[i]){
                porcentagemTotal += 100
            }
            let subtracao = offerSoft[i] - userSoft[i]
            if (subtracao < 0) {
                subtracao = String(subtracao).slice(1)
            }
            if (subtracao == 1) {
                porcentagemTotal += 95
            } else {
                porcentagemTotal += 0
            }
        }
    }
    match = porcentagemTotal/10
    console.log(match)
}

module.exports = {
    match
}
    