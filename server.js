import express from "express";
import cors from "cors";
import abrirConexao from "./db.js";
import "dotenv/config"; // pegando as informações do arquivo .env

const app = express();

app.use(express.json());
app.use(express.static("./"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" }); // manda para o usuario um arquivo de resposta
});

app.get("/livros", async (req, res) => {
  const sql = "SELECT * FROM livro";
  const [resp] = await conexao.query(sql);
  res.json(resp);
});

app.post("/cadastro", async (req, res) => {
  const { titulo, descricao, autor } = req.body;

  if (!titulo || !descricao || !autor) {
    return res.status(400).json({ msg: "O campo do livro é obrigatorio" });
  }

  let com;
  try {
    com = await abrirConexao().getConnection();
    const result = await com.query(
      "INSERT INTO lirvo (titulo, descricao, autor) VALUES (?)",
      [titulo, descricao, autor],
    );
    res.status(201).json({
      msg: "Produto Adicionado com sucesso",
      msgId: Number(result.insertId),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Erro interno no servidor" });
  } finally {
    if (com) com.release();
  }
});

const conexao = abrirConexao();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
