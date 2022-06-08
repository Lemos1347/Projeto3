function changeCode(key, event) {
    debugger
    if (event.keyCode == 8) {
        if (key != 1) {
            key = key - 1;
        }
        document.getElementById("code" + key).focus();
    } else {
        key = key + 1;
        document.getElementById("code" + key).focus();
    }

}

function saveChange(){
    window.location.href = '../view/Login.html';
}