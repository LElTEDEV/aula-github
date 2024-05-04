const inputUsername = document.querySelector("#input-search");
const buttonFavoritar = document.querySelector(".search button");

function load() {
  let lista_usuarios;
  lista_usuarios = JSON.parse(localStorage.getItem("usuariosGitFav:")) || [];
  return lista_usuarios;
}
let lista_usuarios = load();
renderizarUsersNaTela();

function removeTodosItensDaTela() {
  const listaDeTr = document.querySelectorAll("table tbody tr");

  if (listaDeTr) {
    listaDeTr.forEach((tr) => tr.remove());
  }
}

function renderizarUsersNaTela() {
  removeTodosItensDaTela();
  const tbody = document.querySelector("table tbody");

  if (lista_usuarios.length > 0) {
    lista_usuarios.forEach((user) => {
      const { login, name, public_repos, followers } = user;
      const tr = createRow(login, name, public_repos, followers);

      tbody.appendChild(tr);

      tr.querySelector(".remove").onclick = () => {
        deleteUser(user);
      };
    });
  } else {
    const tr = document.createElement("tr");
    const tbody = document.querySelector("table tbody");

    tr.innerHTML = `
        <td colspan="4" style="height: 62.4rem; text-align: center;">
            <img src="./img/estrela.svg" alt="foto de uma estrela com a boca aperta supresa porque você não tem amigos" />
            <h1 style="color: #4E5455; font-size: 2.48rem">Nenhum favorito ainda</h1>
        </td>
    `;
    tbody.appendChild(tr);
  }
}

function createRow(login, name, public_repos, followers) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
  <td class="user">
    <img src="https://github.com/${login}.png" alt="" />
    <a href="https://github.com/${login}">
        <p>${name}</p>
        <span>/${login}</span>
    </a>
  </td>
  <td class="repositories">${public_repos}</td>
  <td class="followers">${followers}</td>
  <td><button class="remove">Remover</button></td>
`;

  return tr;
}

function fetchParaBuscarUsuario(username) {
  return fetch(`https://api.github.com/users/${username}`)
    .then((response) => response.json())
    .then((data) => data);
}

function deleteUser(user) {
  lista_usuarios = lista_usuarios.filter((item) => item.name !== user.name);
  save();
  renderizarUsersNaTela();
}

function save() {
  localStorage.setItem("usuariosGitFav:", JSON.stringify(lista_usuarios));
}

buttonFavoritar.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = inputUsername.value;
  const usuarioJaExiste = lista_usuarios.find(
    (user) => user.login === username
  );

  if (usuarioJaExiste) {
    alert("Esse usuário já existe.");
    return;
  }

  const resultadoUser = await fetchParaBuscarUsuario(username);
  lista_usuarios = [resultadoUser, ...lista_usuarios];
  save();
  renderizarUsersNaTela();
  inputUsername.value = "";
});
