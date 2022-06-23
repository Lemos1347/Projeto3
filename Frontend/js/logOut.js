function logOut() {
    window.localStorage.removeItem('auth')
    window.location.href = '/view/login.html'
}