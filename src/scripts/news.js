// Referência ao botão de logout
const logoutButton = document.getElementById("logoutButton");

// Adiciona o evento de clique ao botão de logout
logoutButton.addEventListener("click", function () {
    // Remove o usuário logado do sessionStorage
    sessionStorage.removeItem("loggedInUser");

    // Redireciona para a página de login
    window.location.href = "./index.html";
});

// Verifica se o usuário está logado
const loggedInUser = sessionStorage.getItem("loggedInUser");
if (!loggedInUser) {
    // Se não houver usuário logado, redireciona para a página de login
    window.location.href = "./index.html";
}

// Exibe o formulário de notícias apenas para o admin
const newsForm = document.getElementById("newsForm");
if (loggedInUser === "admin") {
    newsForm.style.display = "block";
} else {
    newsForm.style.display = "none";
}

// Referência ao contêiner de notícias
const newsList = document.getElementById("newsList");

// Função para salvar notícias no Local Storage
function saveNewsToLocalStorage(news) {
    const savedNews = JSON.parse(localStorage.getItem("news")) || [];
    savedNews.push(news);
    localStorage.setItem("news", JSON.stringify(savedNews));
}

// Função para carregar notícias do Local Storage
function loadNewsFromLocalStorage() {
    const savedNews = JSON.parse(localStorage.getItem("news")) || [];
    newsList.innerHTML = ""; // Limpa a lista de notícias
    savedNews.forEach((news, index) => {
        addNewsToDOM(news.title, news.content, news.mediaUrl, news.mediaType, index);
    });
}

// Função para adicionar uma notícia ao DOM
function addNewsToDOM(title, content, mediaUrl, mediaType, index) {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");

    newsItem.innerHTML = `
        ${
            mediaType === "image"
                ? `<img src="${mediaUrl}" alt="Imagem da notícia">`
                : mediaType === "video"
                ? `<video controls><source src="${mediaUrl}" type="video/mp4">Seu navegador não suporta o formato de vídeo.</video>`
                : mediaType === "youtube"
                ? `<iframe src="${mediaUrl}" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                : ""
        }
        <h3>${title}</h3>
        <p>${content}</p> <!-- Renderiza o conteúdo como HTML -->
        ${
            loggedInUser === "admin"
                ? `<button class="delete-button" data-index="${index}">Apagar</button>`
                : ""
        }
    `;

    newsList.appendChild(newsItem);

    // Adiciona o evento de exclusão ao botão (apenas se o botão existir)
    const deleteButton = newsItem.querySelector(".delete-button");
    if (deleteButton) {
        deleteButton.addEventListener("click", () => {
            deleteNews(index);
        });
    }
}

// Função para excluir uma notícia
function deleteNews(index) {
    const savedNews = JSON.parse(localStorage.getItem("news")) || [];
    savedNews.splice(index, 1); // Remove a notícia pelo índice
    localStorage.setItem("news", JSON.stringify(savedNews));
    loadNewsFromLocalStorage(); // Recarrega as notícias no DOM
}

// Evento de envio do formulário
newsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("newsTitle").value;
    const content = document.getElementById("newsContent").value
        .replace(/\n/g, "<br>") // Permite quebra de linha
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>'); // Converte links em HTML clicável
    const imageUrlInput = document.getElementById("newsImageUrl").value;
    const imageFile = document.getElementById("newsImageFile").files[0];
    const videoUrlInput = document.getElementById("newsVideoUrl").value;
    const videoFile = document.getElementById("newsVideoFile").files[0];
    const youtubeUrl = document.getElementById("youtubeVideoUrl").value.trim();

    let mediaUrl = "";
    let mediaType = "";

    // Prioriza o vídeo do YouTube, depois outros vídeos e imagens
    if (youtubeUrl && isValidYouTubeUrl(youtubeUrl)) {
        const videoId = extractYouTubeVideoId(youtubeUrl);
        if (videoId) {
            mediaUrl = `https://www.youtube.com/embed/${videoId}`;
            mediaType = "youtube";
        } else {
            alert("Não foi possível extrair o ID do vídeo do YouTube. Verifique a URL.");
            return;
        }
    } else if (videoUrlInput) {
        mediaUrl = videoUrlInput;
        mediaType = "video";
    } else if (videoFile) {
        mediaUrl = URL.createObjectURL(videoFile);
        mediaType = "video";
    } else if (imageUrlInput) {
        mediaUrl = imageUrlInput;
        mediaType = "image";
    } else if (imageFile) {
        mediaUrl = URL.createObjectURL(imageFile);
        mediaType = "image";
    }

    // Verifica se o tipo de mídia é válido
    if (mediaType === "video" && !mediaUrl.endsWith(".mp4")) {
        alert("Por favor, insira um vídeo no formato MP4.");
        return;
    }

    const news = { title, content, mediaUrl, mediaType };
    saveNewsToLocalStorage(news);
    addNewsToDOM(title, content, mediaUrl, mediaType, JSON.parse(localStorage.getItem("news")).length - 1);

    newsForm.reset(); // Limpa o formulário
    document.getElementById("youtubeVideoUrl").value = ""; // Limpa o campo de URL do YouTube
});

// Carrega as notícias ao iniciar
loadNewsFromLocalStorage();

// Função para validar URLs do YouTube
function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([a-zA-Z0-9_-]{11})/;
    const isValid = youtubeRegex.test(url);
    console.log('Validando URL:', url, 'Resultado:', isValid);
    return isValid;
}

// Função para extrair o ID do vídeo do YouTube
function extractYouTubeVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = match ? match[1] : null;
    console.log('Extraindo ID do vídeo:', url, 'ID:', videoId);
    return videoId;
}