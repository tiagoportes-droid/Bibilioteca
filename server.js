import express from "express";
import cors from "cors";
import abrirConexao from "./db.js";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(express.static("./"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const conexao = abrirConexao();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

app.get("/livros", async (req, res) => {
  try {
    const sql = "SELECT * FROM livro";
    const resp = await conexao.query(sql);
    res.json(resp);
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao buscar livros" });
  }
});

app.post("/cadastro", async (req, res) => {
  const { titulo, descricao, autor } = req.body;

  if (!titulo || !descricao || !autor) {
    return res.status(400).json({ erro: "Todos os campos do livro são obrigatórios" });
  }

  let com;
  try {
    com = await conexao.getConnection(); 
    
    const [result] = await com.query(
      "INSERT INTO livro (titulo, descricao, autor) VALUES (?, ?, ?)",
      [titulo, descricao, autor],
    );
    
    res.status(201).json({
      mensagem: "Livro adicionado com sucesso!",
      id_inserido: Number(result.insertId),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro interno no servidor ao cadastrar" });
  } finally {
    if (com) com.release();
  }
});

app.put("/livro/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descricao, autor } = req.body;
  
  const sql = "UPDATE livro SET titulo = ?, descricao = ?, autor = ? WHERE id_livro = ?";
  
  try {
    const resp= await conexao.query(sql, [titulo, descricao, autor, id]);
    if (resp.affectedRows > 0) {
      res.json({ mensagem: "Livro atualizado com sucesso" });
    } else {
      res.status(404).json({ erro: "Livro não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro interno no servidor ao atualizar" });
  }
});

app.delete("/livro/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const sql = "DELETE FROM livro WHERE id_livro = ?";
    const resp = await conexao.query(sql, [id]);

    if (resp.affectedRows === 0) {
      return res.status(404).json({ erro: "O ID inserido não existe" });
    }

    res.status(200).json({ mensagem: "Livro deletado com sucesso!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro interno no servidor ao deletar" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
