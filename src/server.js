const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const dataFile = path.join(__dirname, "youtube_urls.json"); // Arquivo para armazenar as URLs
const imagesFile = path.join(__dirname, "images.json"); // Arquivo para armazenar as URLs de imagens

console.log("Iniciando o servidor...");

// Middleware para processar dados enviados no corpo da requisição
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Rota para o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Rota para o news.html
app.get("/news", (req, res) => {
    res.sendFile(path.join(__dirname, "news.html"));
});

// Rota para salvar uma URL de vídeo do YouTube
app.post("/save-video-url", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send("URL é obrigatória.");
    }

    // Leia as URLs existentes no arquivo JSON
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err && err.code !== "ENOENT") {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro no servidor");
        }

        const urls = data ? JSON.parse(data) : [];
        urls.push(url);

        // Salve as URLs atualizadas no arquivo JSON
        fs.writeFile(dataFile, JSON.stringify(urls, null, 2), (err) => {
            if (err) {
                console.error("Erro ao salvar as URLs:", err);
                return res.status(500).send("Erro no servidor");
            }

            res.status(200).send("URL salva com sucesso!");
        });
    });
});

// Rota para listar as URLs salvas
app.get("/video-urls", (req, res) => {
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err && err.code !== "ENOENT") {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro no servidor");
        }

        const urls = data ? JSON.parse(data) : [];
        res.json(urls);
    });
});

// Rota para salvar uma URL de imagem
app.post("/save-image", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send("URL da imagem é obrigatória.");
    }

    // Leia as URLs existentes no arquivo JSON
    fs.readFile(imagesFile, "utf8", (err, data) => {
        if (err && err.code !== "ENOENT") {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro no servidor");
        }

        const images = data ? JSON.parse(data) : [];
        images.push(url);

        // Salve as URLs atualizadas no arquivo JSON
        fs.writeFile(imagesFile, JSON.stringify(images, null, 2), (err) => {
            if (err) {
                console.error("Erro ao salvar as URLs:", err);
                return res.status(500).send("Erro no servidor");
            }

            res.status(200).send("URL da imagem salva com sucesso!");
        });
    });
});

// Rota para listar as URLs de imagens salvas
app.get("/images", (req, res) => {
    fs.readFile(imagesFile, "utf8", (err, data) => {
        if (err && err.code !== "ENOENT") {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro no servidor");
        }

        const images = data ? JSON.parse(data) : [];
        res.json(images);
    });
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});