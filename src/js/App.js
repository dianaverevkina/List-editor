export default class App {
  constructor(container) {
    this.container = container;
  }

  drawCrm() {
    return `
      <div class="crm__block">
        <h2 class="crm__header">Товары</h2>
        <button type="button" class="crm__add">
          <img src="./images/add.svg" alt="Add item" class="crm__add-icon">
        </button>
      </div>
      <div class="crm__list list">
        <div class="list__row">
          <h3 class="list__col list__title">Название</h3>
          <h3 class="list__col list__title">Стоимость</h3>
          <h3 class="list__col list__title">Действия</h3>
        </div>         
      </div>
    `;
  }

  bindToDOM() {
    this.container.innerHTML = this.drawCrm();

    this.buttonToAdd = this.container.querySelector('.crm__add');
    this.productsList = this.container.querySelector('.list');
  }

  // Создаем HTML-элемент товара
  renderItem(item) {
    return `
      <div class="list__row item" data-id="${item.id}">
        <p class="list__col item__name"> ${item.name} </p>
        <p class="list__col item__price"> ${item.price} </p>
        <div class="list__col item__controls">
          <button type="button" class="item__control item__control-edit">
            <img src="./images/edit.svg" alt="Edit item" class="item__edit">
          </button>
          <button type="button" class="item__control item__control-delete">
            <img src="./images/delete.svg" alt="Delete item" class="item__delete">
          </button>
        </div>
      </div>
    `;
  }

  // Удаляем все товары
  clearProducts() {
    const items = this.productsList.querySelectorAll('.item');
    items.forEach((item) => item.remove());
  }

  // Отрисовываем popover
  static drawPopover(formName) {
    const popover = document.createElement('div');
    popover.classList.add('popover');

    popover.innerHTML = `
      <div class="popover__container">
        <form action="" name="${formName}" class="popover__form form novalidate">
          <div class="form__block">
            <div class="form__row form__name">
              <h2 class="form__input-title">Название</h2>
              <input type="text" name="product-name" class="form__input" required>
            </div>
            <div class="form__row form__price">
              <h2 class="form__input-title">Стоимость</h2>
              <input type="text" name="product-price" class="form__input" pattern="^[1-9][0-9]*$" required>
            </div>  
          </div>
          <div class="form__block form__buttons">
            <button class="form__btn form__btn-save">Сохранить</button>
            <button type="button" class="form__btn form__btn-cancel">Отмена</button>
          </div>
        </form>
      </div>
    `;
    return popover;
  }
}
