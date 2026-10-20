const formProduto = document.getElementById("formulario");
const titulo = document.getElementById("txtTitulo");
const desc = document.getElementById("txtDesc");
const autor = document.getElementById("txtAutor");
const mensagem = document.getElementById("resposta");
const botao = document.getElementById("btnEnviar");

// ADICIONADO: Certifique-se de que este elemento HTML existe no seu seu arquivo index.html
const listaProdutos = document.getElementById("listaProdutos"); 

formProduto.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tituloV = titulo.value;
  const descV = desc.value;
  const autorV = autor.value;

  mensagem.textContent = "Enviando Para o Servidor...";
  mensagem.className = "Carregando";

  try {
    const resposta = await fetch("http://localhost:3000/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: tituloV,
        descricao: descV,
        autor: autorV,
      }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      mensagem.textContent = dados.mensagem;
      mensagem.className = "sucesso";

      // CORRIGIDO: Criando o elemento na lista com a variável correta (tituloV)
      if (listaProdutos) {
        const li = document.createElement("li");
        li.textContent = `ID ${dados.id_inserido}: ${tituloV}`;
        listaProdutos.appendChild(li);
      }

      // CORRIGIDO: Limpando os campos corretos do formulário após o sucesso
      titulo.value = "";
      desc.value = "";
      autor.value = "";

    } else {
      mensagem.textContent = `Erro: ${dados.erro}`;
      mensagem.className = "erro";
    }
  } catch (err) {
    console.error("Erro na requisição", err);
    mensagem.textContent = "Falha ao conectar com o servidor.";
    mensagem.className = "erro";
  }
});
