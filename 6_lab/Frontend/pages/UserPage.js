export class UserPage {
  constructor(parent, user, onBack) {
    this.parent = parent;
    this.user = user;
    this.onBack = onBack;
  }

  render() {
    this.parent.innerHTML = `
      <div class="container mt-4">
        <button class="btn btn-secondary mb-3" id="backBtn">← Назад</button>
        <div id="profile"></div>
      </div>
    `;

    document.getElementById('backBtn').addEventListener('click', this.onBack);

    const userDiv = document.getElementById('profile');
    const imgSrc = this.user.photo_400 || 'https://vk.com/images/camera_400.png';
    const city = this.user.city?.title || '—';
    const phone = this.user.mobile_phone || '—';
    const sex = this.user.sex === 1 ? 'Женский' : this.user.sex === 2 ? 'Мужской' : '—';
    const lastSeen = this.user.last_seen?.time 
      ? new Date(this.user.last_seen.time * 1000).toLocaleString()
      : 'Скрыт';

    userDiv.innerHTML = `
      <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${imgSrc}" class="img-fluid rounded-start">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h4>${this.user.first_name} ${this.user.last_name}</h4>
              <p><strong>ID:</strong> ${this.user.id}</p>
              <p><strong>Пол:</strong> ${sex}</p>
              <p><strong>Город:</strong> ${city}</p>
              <p><strong>Телефон:</strong> ${phone}</p>
              <p><strong>Последний онлайн:</strong> ${lastSeen}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}