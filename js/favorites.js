import { GithubUser } from './githubUser.js'

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('maykbrito').then
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)
      if (user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEnteries = this.entries.filter(
      entry => entry.login !== user.login
    )
    this.entries = filteredEnteries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.newAdd()
  }

  newAdd() {
    const addButton = this.root.querySelector('.addFavorite')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  image() {
    this.entries.length === 0
      ? document.querySelector('.image').classList.remove('sr-only')
      : document.querySelector('.image').classList.add('sr-only')
  }

  update() {
    this.removeAllTr()
    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esse usuário?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
    this.image()
  }

  createRow() {
    const dataTr = document.createElement('tr')

    dataTr.style.cssText = 'border-radius: 1.3rem'

    dataTr.innerHTML = ` 
    <td class="user">
      <img src="https://github.com/Luiz-Ricardo-Lopes.png" alt="" />
      <a href="https://github.com/Luiz-Ricardo-Lopes" target="_blank">
        <p>Luiz Ricardo Lopes</p>
        <span>Luiz</span>
      </a>
    </td>
    <td class="repositories">50</td>
    <td class="followers">965</td>
    <td>
      <button class="remove">Remover</button>
    </td>  `

    return dataTr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
