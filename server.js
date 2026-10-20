import express from "express";
import cors from "cors";
import abrirConexao from "./db.js";
import "dotenv/config"; // pegando as informações do arquivo .env

const app = express();

app.use(express.json());
app.use(express.static("./"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const conexao = abrirConexao();

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
    const [result] = await com.query(
      "INSERT INTO livro (titulo, descricao, autor) VALUES (?, ?, ?)",
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

app.put("/livro/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descricao, autor } = req.body;
  const sql =
    "UPDATE livro SET titulo = ?, descricao = ? autor = ? WHERE id_livro = ?";
  const [resp] = await conexao.query(sql, [titulo, descricao, autor, id]);
  if (resp.affectedRows > 0) {
    res.json({ msg: "Livro atulizado com sucesso" });
  } else {
    res.status(400).json({ msg: "Livros não enconytrado" });
  }
});

app.delete("/livro/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const sql = "DELETE FROM livro WHERE id_livro = ?"; // define o query
    const [resp] = await conexao.query(sql, [id]); // chama o query e da o valor do id para deletar

    if (resp.affectedRows === 0) {
      return res.status(404).json({ msg: "Id inserido não existe" });
    }

    res.status(200).json({ msg: "Livro deletado com sucesso!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Erro interno no servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
