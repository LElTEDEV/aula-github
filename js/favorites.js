export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }));
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuário já existe");
      }

      const githubUser = await GithubUser.search(username);

      if (githubUser.login === undefined) {
        throw new Error("Usuário não encontrado");
      }

      this.entries = [githubUser, ...this.entries];
      this.save();
      this.update();
    } catch (error) {
      console.log(error);
    }
  }

  delete(user) {
    this.entries = this.entries.filter((opa) => opa !== user);
    this.save();
    this.update();
  }
}

export default class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.addEventListener("click", () => {
      const { value } = this.root.querySelector("#input-search");
      this.add(value);
    });
  }

  update() {
    //Está removendo todas as minhas linhas da tabela
    this.removeAllTr();

    // para cada usuário eu estou criando uma linha e estou adicionando no tbody (tabela)
    this.entries.forEach((user) => {
      const { login, name, public_repos, followers } = user;
      const row = this.createRow(login, name, public_repos, followers);

      this.tbody.append(row);

      row.querySelector(".remove").onclick = () => {
        confirm(`Tem certeza que deseja deletar ${name} ?`) &&
          this.delete(user);
      };
    });
  }

  createRow(login, name, public_repos, followers) {
    //criação de cada linha.
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/${login}.png" alt="" />
          <a href="https://github.com/${login}">
              <p>${name}</p>
              <span>${login}</span>
          </a>
        </td>
        <td class="repositories">${public_repos}</td>
        <td class="followers">${followers}</td>
        <td><button class="remove">&times;</button></td>
    `;

    return tr;
  }

  removeAllTr() {
    //function que irá deletar todas as linhas quando o meu programa for iniciado
    this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove());
  }
}
