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
            <div>
                <button id="get-player-stats" type="submit">Mis estadisticas</button>
            </div>
            <div id="player-stats"></div>
            <div>
                <button id="get-all-players-stats" type="submit">Estadisticas de todos</button>
                <div id="all-players-stats-container">           
                </div>
            </div>
            <div>
                <button id="logout" type="submit">Logout</button>
            </div>
        </div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

//Aqui agrego un Listener para el evento de hacer click en el boton
const addPlayListener = () => {
    const playForm = document.getElementById('play-button')
    playForm.onclick = (e) => {
        e.preventDefault()
        addLogoutListener() 
        addPlayerStatsListener()
        addAllPlayerStatsListener()
        goToPlay(localStorage.getItem('user'))      
    }
}

//Aqui juega y guarda el resultado en la Base de datos
const goToPlay = async () => {
    //Hace fetch con el endpoint de /play
    const response = await fetch('/play', {
        method: 'POST',
        body: userString,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt')
        }
    })
    const responseData = await response.text()
    const data = JSON.parse(responseData)
    let state = ""
    if(data.games[data.games.length - 1].win){
        state = 'Ganaste'
    } else {
        state = "Perdiste"
    }

    //Muestro el resultado por pantalla
    const template = `
    <ul id="player-stats-list">
        <li class="player-stats-item">Primer dado</li>
        <li class="player-stats-item">${data.games[data.games.length - 1].first}</li>
        <li class="player-stats-item">Segundo dado</li>
        <li class="player-stats-item">${data.games[data.games.length - 1].second}</li>
        <li class="player-stats-item"></li>
        <li class="player-stats-item">${state}</li>
        <li class="player-stats-item">Porcentaje de victorias</li>
        <li class="player-stats-item">${data.successRate}%</li>
    </ul>
    <div>
    </div>
    `
        const resultDiv = document.getElementById('result')
        resultDiv.innerHTML = template 
        const playerStats = document.getElementById('player-stats')
        playerStats.innerHTML = ``
        const allPlayersStats = document.getElementById('all-players-stats-container')
        allPlayersStats.innerHTML = ``
    if(response.status > 300){
        const errorNode = document.getElementById('error')
        errorNode.innerHTML = responseData
    } 
}

//Muestro por pantalla las estadisticas del jugador
const addPlayerStatsListener = () => {
    const statsButton = document.getElementById('get-player-stats')
    userString = localStorage.getItem('user')
    const user = JSON.parse(userString)
    const userId = user._id;
    statsButton.onclick = async (e) => {
        e.preventDefault()
        const response = await fetch(`/getPlayer/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            }
        })
        const user = await response.json()
        const template = `
        <ul id="player-stats-list">
            <li class="player-stats-item">Jugaste</li>
            <li class="player-stats-item">${user.games.length}</li>
            <li class="player-stats-item">Ganaste</li>
            <li class="player-stats-item">${user.games.filter(game => game.win).length}</li>
            <li class="player-stats-item">Perdiste</li>
            <li class="player-stats-item">${user.games.length - user.games.filter(game => game.win).length}</li>
            <li class="player-stats-item">Porcentaje de victorias</li>
            <li class="player-stats-item">${user.successRate}%</li>
        </ul>
        <button data-id="${user._id}">Reiniciar mis estadisticas</button>
        `
        const playerStats = document.getElementById('player-stats')
        playerStats.innerHTML = template
        const gameStats = document.getElementById('result')
        gameStats.innerHTML = ``
        const allPlayersStats = document.getElementById('all-players-stats-container')
        allPlayersStats.innerHTML = ``
        const deleteButton = document.querySelector(`[data-id="${userId}"]`)
        deleteButton.onclick = async del => {
            await fetch(`/player/${userId}`, {
                method: 'POST',
                headers: {
                    Authorization: localStorage.getItem('jwt')
                }
            })
            alert('Se reiniciaron tus estadisticas')
        }
    }
}

//Muestro por pantalla las estadisticas de todos los jugadores
const addAllPlayerStatsListener = () => {
    const allStatsButton = document.getElementById('get-all-players-stats')
    const playersStatsContainer = document.getElementById('all-players-stats-container');
    const tableTemplate = `
        <ul id="all-players-stats-menu"> 
            <li class="all-players-stats-menu-items">Jugador</li>
            <li class="all-players-stats-menu-items">Porcentaje de victorias</li>
        </ul>
        <ul id="all-players-stats-list"></ul>
    `
    allStatsButton.onclick = async (e) => {
        playersStatsContainer.innerHTML = tableTemplate
        e.preventDefault()
        const response = await fetch('/getAllPlayersStats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            }
        })
        const users = await response.json()   
        const template = user => `
        <li class="all-players-stats-list-items">
            ${user.email}
        </li>
        <li class="all-players-stats-list-items">
            ${user.successRate}%
        </li>
        `
    const usersList = document.getElementById('all-players-stats-list')
    usersList.innerHTML = users.map(user => template(user)).join('')
    const playerStats = document.getElementById('player-stats')
    playerStats.innerHTML = ``
    const gameStats = document.getElementById('result')
    gameStats.innerHTML = ``
    }
}

//Añado el Listener para hacer el logout, elimino lo que esta guardado en el localStorage
const addLogoutListener = () => {
    const logout = document.getElementById('logout')
    logout.onclick = (e) =>{
        e.preventDefault()
        localStorage.setItem('user', '')
        localStorage.setItem('jwt', '')
        loadLogoutTemplate(() => loginPage())
    }    
}


const loadLogoutTemplate = (callback) => {
        const template = `
        <div id="container">
            <h1 id=title">GRACIAS POR JUGAR, HASTA LA PROXIMA</h1>
        </div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
    setTimeout(callback, 3000)
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
                'Content-Type': 'application/json',
            }
        })
        if(!response.ok){
            const errorData = await response.json()
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = errorData.message
        } else {
            const responseData = await response.json();
            localStorage.setItem('jwt', `Bearer ${responseData.signed}`)
            localStorage.setItem('user', JSON.stringify(responseData.user))
            if(action == 'register'){
                loadWelcomeTemplate(() => {
                    loginPage()
                })                
            }
            else {
                loadPlayTemplate()
                addPlayListener()
                addLogoutListener()
                addPlayerStatsListener()
                addAllPlayerStatsListener()
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
        addLogoutListener() 
        addPlayerStatsListener()
        addAllPlayerStatsListener()
    } else {
        loginPage()
    }        
}









