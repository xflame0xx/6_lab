export class MainPage {
  constructor(parent, onUserClick) {
    this.parent = parent;
    this.onUserClick = onUserClick;
  }

  render() {
    this.parent.innerHTML = `
      <div class="container mt-4">
        <h2>Участники группы</h2>
        <button id="addBtn" class="btn btn-success mb-3">+ Добавить карточку</button>
        <div id="members" class="row row-cols-1 row-cols-md-3 g-4"></div>
      </div>
    `;

    document.getElementById('addBtn').addEventListener('click', () => this.addCard());
    this.loadCards();
  }

  async loadCards() {
    const container = this.parent.querySelector('#members');
    container.innerHTML = '<p class="text-center">Загрузка...</p>';
    
    try {
      const res = await fetch('http://localhost:8000/cards');
      if (!res.ok) throw new Error('Сервер не отвечает');
      const cards = await res.json();
      this.renderCards(container, cards);
    } catch (err) {
      container.innerHTML = `<p class="text-danger">❌ ${err.message}</p>`;
    }
  }

  renderCards(container, cards) {
    container.innerHTML = '';
    if (cards.length === 0) {
      container.innerHTML = '<p class="text-muted">Нет участников</p>';
      return;
    }

    cards.forEach(card => this.renderCard(container, card));
  }

  renderCard(container, card) {
    const imgSrc = card.photo_400 || 'https://vk.com/images/camera_400.png';
    let roleTag = '';
    if (card.role === 'owner') roleTag = '<span class="badge bg-danger">Владелец</span>';
    else if (card.role === 'administrator') roleTag = '<span class="badge bg-warning text-dark">Админ</span>';

    const div = document.createElement('div');
    div.className = 'col';
    div.innerHTML = `
      <div class="card h-100">
        <img src="${imgSrc}" class="card-img-top" onerror="this.src='https://vk.com/images/camera_400.png'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${card.first_name} ${card.last_name}</h5>
          <div class="mt-2">${roleTag}</div>
          <button class="btn btn-primary mt-auto">Подробнее</button>
          <div class="mt-2 d-grid gap-2">
            <button class="btn btn-outline-secondary edit-btn" data-id="${card.id}">✏️ Редактировать</button>
            <button class="btn btn-danger delete-btn" data-id="${card.id}">🗑️ Удалить</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);

    div.querySelector('.btn-primary').addEventListener('click', () => {
      this.onUserClick(card);
    });

    div.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Удалить карточку?')) {
        this.deleteCard(card.id);
      }
    });

    div.querySelector('.edit-btn').addEventListener('click', () => {
      this.showEditModal(card);
    });
  }

  // === МОДАЛЬНОЕ ОКНО: РЕДАКТИРОВАНИЕ ===
  showEditModal(card) {
    this.removeModal();
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
    `;
    modal.innerHTML = `
      <div class="bg-white p-4 rounded shadow" style="width: 90%; max-width: 500px;">
        <h4>Редактировать участника</h4>
        <div class="mb-3">
          <label class="form-label">Имя *</label>
          <input type="text" id="editFirstName" class="form-control" value="${card.first_name}">
        </div>
        <div class="mb-3">
          <label class="form-label">Фамилия *</label>
          <input type="text" id="editLastName" class="form-control" value="${card.last_name}">
        </div>
        <div class="mb-3">
          <label class="form-label">Роль</label>
          <select id="editRole" class="form-select">
            <option value="">Участник</option>
            <option value="administrator" ${card.role === 'administrator' ? 'selected' : ''}>Админ</option>
            <option value="owner" ${card.role === 'owner' ? 'selected' : ''}>Владелец</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Город</label>
          <input type="text" id="editCity" class="form-control" value="${card.city?.title || ''}">
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button id="cancelEdit" class="btn btn-secondary">Отмена</button>
          <button id="saveEdit" class="btn btn-success">Сохранить</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cancelEdit').onclick = () => this.removeModal();
    document.getElementById('saveEdit').onclick = () => {
      const first_name = document.getElementById('editFirstName').value.trim();
      const last_name = document.getElementById('editLastName').value.trim();
      if (!first_name || !last_name) {
        alert('Имя и фамилия обязательны!');
        return;
      }
      const updated = {
        first_name,
        last_name,
        role: document.getElementById('editRole').value || null,
        city: { title: document.getElementById('editCity').value }
      };
      this.updateCard(card.id, updated);
    };
  }

  // === МОДАЛЬНОЕ ОКНО: ДОБАВЛЕНИЕ ===
  addCard() {
    this.removeModal();
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
    `;
    modal.innerHTML = `
      <div class="bg-white p-4 rounded shadow" style="width: 90%; max-width: 500px;">
        <h4>Добавить нового участника</h4>
        <div class="mb-3">
          <label class="form-label">Имя *</label>
          <input type="text" id="newFirstName" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label">Фамилия *</label>
          <input type="text" id="newLastName" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label">Город</label>
          <input type="text" id="newCity" class="form-control">
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button id="cancelNew" class="btn btn-secondary">Отмена</button>
          <button id="saveNew" class="btn btn-success">Добавить</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cancelNew').onclick = () => this.removeModal();
    document.getElementById('saveNew').onclick = () => {
      const first_name = document.getElementById('newFirstName').value.trim();
      const last_name = document.getElementById('newLastName').value.trim();
      if (!first_name || !last_name) {
        alert('Имя и фамилия обязательны!');
        return;
      }
      const newCard = {
        first_name,
        last_name,
        photo_400: 'https://vk.com/images/camera_400.png',
        role: null,
        city: { title: document.getElementById('newCity').value },
        mobile_phone: '',
        sex: 0,
        last_seen: { time: Math.floor(Date.now() / 1000) }
      };
      this.createCard(newCard);
    };
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===
  removeModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.remove();
  }

  async createCard(card) {
    try {
      const res = await fetch('http://localhost:8000/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      });
      if (res.ok) {
        this.removeModal();
        this.loadCards();
      } else {
        const err = await res.json();
        alert('Ошибка: ' + (err.error || 'неизвестно'));
      }
    } catch (err) {
      alert('Не удалось добавить: ' + err.message);
    }
  }

  async updateCard(id, data) {
    try {
      const res = await fetch(`http://localhost:8000/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        this.removeModal();
        this.loadCards();
      } else {
        const err = await res.json();
        alert('Ошибка: ' + (err.error || 'неизвестно'));
      }
    } catch (err) {
      alert('Не удалось сохранить: ' + err.message);
    }
  }

  async deleteCard(id) {
    try {
      const res = await fetch(`http://localhost:8000/cards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        this.loadCards();
      } else {
        const err = await res.json();
        alert('Ошибка: ' + (err.error || 'неизвестно'));
      }
    } catch (err) {
      alert('Не удалось удалить: ' + err.message);
    }
  }
}