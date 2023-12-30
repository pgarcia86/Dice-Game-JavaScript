const loadInitialTemplate = () => {
    const template = `
        <h1 id="title">Register</h1>
        <form id="register-form">
            <div>
                <label>Email: </label>
                <input name="email" type="email">
            </div>
            <div>
                <label>Password: </label>
                <input name=password type="text">
            </div>
            <button type="submit">Register</button>
        </form>
        <a href="#" id="login">Iniciar sesión</a>
        <div id="error"></div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const loadLoginTemplate = () => {
    const template = `
    <h1 id="title">Login</h1>
    <form id="login-form">
        <div>
            <label>Email: </label>
            <input name="to" type="email">
        </div>
        <div>
            <label>Password: </label>
            <input type="text">
        </div>
        <button type="submit">Login</button>
    </form>
    <a href="#" id="login">Register</a>
    <div id="error"></div>
    `
}

const checkLogin = () => {
    localStorage.getItem('jwt')
}

const loadPlayTemplate = () => {
    const template = `
        <h1>ESTA ES LA PAGINA DE JUEGO</h1>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

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
        console.log('Linea 66: ', response.status);
        if(response.status > 300){
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            loadPlayTemplate()
        }        
    }
}

const addRegisterListener = authListener('register')
const addLoginListener = authListener('login')

const goToRegisterListener = () => {
    const goToRegister = document.getElementById('register-form')
    goToRegister.onclick = (e) => {
        e.preventDefault()
        loadInitialTemplate()
    }
}

window.onload = () => {
        loadInitialTemplate()
        addRegisterListener()
        //loadPlayTemplate()
}









