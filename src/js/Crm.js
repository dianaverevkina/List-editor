import data from './data.json';
import Popover from './Popover';

export default class Crm {
  constructor(app) {
    this.app = app;
    this.list = this.app.productsList;
    this.renderProducts = this.renderProducts.bind(this);
    this.popover = new Popover(this.renderProducts);

    this.addItem = this.addItem.bind(this);
    this.modifyItem = this.modifyItem.bind(this);

    this.addEvents();
  }

  // Отображаем товары
  renderProducts() {
    this.app.clearProducts();

    data.forEach((item) => {
      const itemHTML = this.app.renderItem(item);
      this.list.insertAdjacentHTML('beforeend', itemHTML);
    });
  }

  // Добвляем обработчики событий
  addEvents() {
    this.app.buttonToAdd.addEventListener('click', this.addItem);
    this.list.addEventListener('click', this.modifyItem);
  }

  // Открываем popover при нажатии кнопки "добавить" для добавления товара
  addItem(e) {
    e.preventDefault();
    this.popover.showPopover('add-product');
  }

  // Если кнопка "удалить" - удаляем товар,
  // если "редактировать" - открываем popover для изменения товара
  modifyItem(e) {
    e.preventDefault();
    const { target } = e;
    if (target.closest('.item__control-delete')) {
      this.deleteItem(target);
    }
    if (target.closest('.item__control-edit')) {
      const product = target.closest('.item');
      this.editItem(product);
    }
  }

  // Редактируем данные товара
  editItem(itemEl) {
    this.popover.showPopover('edit-product');
    const productId = itemEl.getAttribute('data-id');
    const product = data.find((obj) => obj.id === +productId);
    this.popover.inputName.value = product.name;
    this.popover.inputPrice.value = product.price;
    this.popover.currentProduct = product;
  }

  // Удаляем товар
  deleteItem(element) {
    const product = element.closest('.item');
    const productId = product.getAttribute('data-id');
    const index = data.findIndex((obj) => obj.id === +productId);
    if (index !== -1) {
      data.splice(index, 1);
      this.renderProducts();
    }
  }
}
