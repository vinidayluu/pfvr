// File: /javascript-login-website/javascript-login-website/src/scripts/login.js
// Lista de usuários e senhas
const users = [
    { username: "admin", password: "4321" },
    { username: "user1", password: "1234" },
    { username: "user2", password: "5678" }
];

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verifica se o usuário e a senha correspondem a algum item na lista
    const userFound = users.find(user => user.username === username && user.password === password);

    if (userFound) {
        // Salva o usuário logado no sessionStorage
        sessionStorage.setItem("loggedInUser", userFound.username);

        // Redireciona para a página de notícias
        window.location.href = "./news.html";
    } else {
        // Exibe a mensagem de erro
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
        errorMessage.textContent = "Usuário ou senha incorretos!";
    }
});

