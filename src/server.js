const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000; // Render usa essa variável de ambiente

const IMAGES_FILE = path.join(__dirname, "images.json");

// Middleware para servir arquivos estáticos e processar JSON
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Função para ler imagens do arquivo JSON
const readImages = () => {
    if (!fs.existsSync(IMAGES_FILE)) return [];
    const data = fs.readFileSync(IMAGES_FILE, "utf-8");
    return JSON.parse(data);
};

// Função para salvar imagens no arquivo JSON
const saveImages = (images) => {
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(images, null, 2), "utf-8");
};

// Rota principal para exibir o site
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "news.html"));
});

// Rota para obter imagens
app.get("/images", (req, res) => {
    res.json(readImages());
});

// Rota para adicionar imagem
app.post("/save-image", (req, res) => {
    const { url, title, caption } = req.body;
    if (!url || !title || !caption) {
        return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const images = readImages();
    const newImage = { id: Date.now(), url, title, caption };
    images.push(newImage);
    saveImages(images);

    res.status(201).json(newImage);
});

// Rota para excluir imagem (apenas admin)
app.delete("/delete-image/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let images = readImages();
    const imageIndex = images.findIndex(img => img.id === id);

    if (imageIndex === -1) {
        return res.status(404).send("Imagem não encontrada.");
    }

    images.splice(imageIndex, 1);
    saveImages(images);

    res.send("Imagem removida com sucesso.");
});

// Iniciar servidor no Render
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});





