//Aqui cargo el template de inicio de sesion
const loadInitialTemplate = () => {
    const template = `
        <div id="container">
            <h1 id="title">BIENVENIDO AL JUEGO DE CHICHE</h1>
            <h2 id="subtitle">Si ya tenes usuario, podes loguearte justo abajo, sino abajo hay boton para registrarte</h2>
            <form id="login-form">
                <div class="data-container">
                    <label class="data-label">Email: </label>
                    <input class="data-box" name="email" type="email">
                </div>
                <div class="data-container">
                    <label class="data-label">Password: </label>
                    <input class="data-box" name=password type="text">
                </div>
                <div id="button-container">
                    <button type="submit">Login</button>
                </div>
                <div id="link-container">
                    <a href="#">Registrarse</a>
                </div>
                <div id="error"></div>
            </form>
        </div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

//Aqui cargo el template de registro
const loadRegisterTemplate = () => {
    const template = `
        <div id="container">
            <h1 id="title">BIENVENIDO AL JUEGO DE CHICHE</h1>
            <h2 id="subtitle">Aca te vas a poder registrar</h2>
            <form id="register-form">
                <div class="data-container">
                    <label class="data-label">Email: </label>
                    <input class="data-box" name="email" type="email">
                </div>
                <div class="data-container">
                    <label class="data-label">Password: </label>
                    <input class="data-box" name=password type="text">
                </div>
                <div id="button-container">
                    <button type="submit">Registrarse</button>
                </div>
                <div id="link-container">
                    <a href="#">Login</a>
                </div>
                <div id="error"></div>
            </form>
        </div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

//Aqui cargo un template que da la bienvenida durante unos segundos
const loadWelcomeTemplate = (callback) => {
    const template = `
        <div id="container">
            <h1 id=title">YA ESTAS DADO DE ALTA, AHORA LOGUEATE Y VAS A PODER JUGAR</h1>
        </div>

    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
    setTimeout(callback, 3000)
}

//Aqui cargo el template de juego
const loadPlayTemplate = () => {
    const template = `
        <div id="container">
            <h1 id="title">EL JUEGO DE CHICHE</h1>
            <h2 id="subtitle">Esto básicamente es azar, si los numeros suman 7, ganas, sino perdes, facil</h2>
            <div>
                <button id="play-button" type="submit">Jugar</button>
            </div>
            <div id="result"></div>
        </div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const addPlayListener = () => {
    const playForm = document.getElementById('play-button')
    playForm.onclick = async (e) => {
        const user = localStorage.getItem('user')
        console.log("Linea 92 - main.js: ", user);
        e.preventDefault()
        let win = false
        let state = "Perdiste"
        const num1 = Math.floor(Math.random() * 6) + 1
        const num2 = Math.floor(Math.random() * 6) + 1
        if((num1 + num2) == 7){
            win = true
            state = 'Ganaste'
        }
        const template = `
        <div>
            Primero : ${num1} 
        </div>
        <div>
            Segundo: ${num2}
        </div>
        <div>
            ${state}
        </div>
        `
        const resultDiv = document.getElementById('result')
        resultDiv.innerHTML = template        
        const data = {
            first: num1,
            second: num2,
            win: win
        }

        const response = await fetch('/play', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const responseData = await response.text()
        if(response.status > 300){
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } 
    }
}

//Aqui chequeo si el usuario esta loguedo
const checkLogin = () => {
    localStorage.getItem('jwt')
}

//Agrego un listener al evento submit dependiendo de la accion que quiero hacer
const authListener = action => () =>{
    const form = document.getElementById(`${action}-form`)
    form.onsubmit = async(e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        const response = await fetch(`/${action}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const responseData = await response.text()
        console.log('RESPONSE', responseData);
        if(response.status > 300){
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem('user', responseData)
            if(action == 'register'){
                loadWelcomeTemplate(() => {
                    loginPage()
                })                
            }
            else {
                loadPlayTemplate()
                addPlayListener()
            }
        }        
    }
}

const addRegisterListener = authListener('register')
const addLoginListener = authListener('login')

const goToRegisterListener = () => {
    const goToRegister = document.getElementById('link-container')
    goToRegister.onclick = (e) => {
        e.preventDefault()
        registerPage()
    }
}

const goToLoginListener = () => {
    const goToLogin = document.getElementById('link-container')
    goToLogin.onclick = (e) => {
        e.preventDefault()
        loginPage()
    }
}

const loginPage = () => {
    loadInitialTemplate()
    addLoginListener()
    goToRegisterListener()
}

const registerPage = () => {
    loadRegisterTemplate()
    addRegisterListener()
    goToLoginListener()
}

window.onload = () => {
    const isLoggedIn = checkLogin()
    if(isLoggedIn){
        loadPlayTemplate()
        addPlayListener()
    } else {
        loginPage()
    }        
}









