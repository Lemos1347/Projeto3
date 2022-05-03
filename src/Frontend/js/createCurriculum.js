function verifyInfos() {
    document.getElementById('alertContainer').style.display = 'flex'

    document.getElementById('alertContainer').scrollIntoView();
    window.scroll(0, -150)

    setTimeout(() => {
        document.getElementById('alertContainer').style.display = 'none'
    }, "4000")
}