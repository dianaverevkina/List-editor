/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/App.js
class App {
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
    items.forEach(item => item.remove());
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
;// CONCATENATED MODULE: ./src/js/data.json
const data_namespaceObject = JSON.parse('[{"name":"iPhone XR","price":60000,"id":1},{"name":"Samsung Galaxy S10+","price":80000,"id":2},{"name":"Huawei View","price":50000,"id":3}]');
;// CONCATENATED MODULE: ./src/js/Product.js
class Product {
  constructor(name, price, id) {
    this.name = name;
    this.price = price;
    this.id = id;
  }
}
;// CONCATENATED MODULE: ./src/js/Tooltip.js
class Tooltip {
  constructor() {
    this.tooltips = [];
    this.errors = {
      'product-name': {
        valueMissing: 'Введите имя товара'
      },
      'product-price': {
        valueMissing: 'Введите цену товара',
        patternMismatch: 'Поле может содержать только цифры'
      }
    };
  }

  // Создаем подсказку
  renderTooltip(message, input) {
    const tooltipEl = document.createElement('div');
    tooltipEl.classList.add('form__tooltip');
    tooltipEl.textContent = message;
    const id = performance.now();
    this.tooltips.push({
      id,
      element: tooltipEl
    });
    const {
      left,
      bottom
    } = input.getBoundingClientRect();
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${bottom}px`;
    document.body.append(tooltipEl);
    return id;
  }

  // Удаляем подсказку
  removeTooltip(id) {
    const tooltip = this.tooltips.find(obj => obj.id === id);
    tooltip.element.remove();
    this.tooltips = this.tooltips.filter(obj => obj.id !== id);
  }
}
;// CONCATENATED MODULE: ./src/js/Popover.js




class Popover {
  constructor(renewItems) {
    this.popover = null;
    this.form = null;
    this.currentProduct = null;
    this.renewItems = renewItems;
    this.tooltip = new Tooltip();
    this.actualTooltips = [];
    this.showTooltip = this.showTooltip.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  // Открываем popover
  showPopover(formName) {
    this.popover = App.drawPopover(formName);
    document.body.append(this.popover);
    this.form = this.popover.querySelector('.form');
    this.inputName = this.form.querySelector('[name="product-name"]');
    this.inputPrice = this.form.querySelector('[name="product-price"]');
    this.btnSave = this.form.querySelector('.form__btn-save');
    this.btnCancel = this.form.querySelector('.form__btn-cancel');
    this.addEvents();
  }

  // Добавляем обработчики событий
  addEvents() {
    this.form.addEventListener('submit', this.saveItem);
    this.inputName.addEventListener('input', this.showTooltip);
    this.inputPrice.addEventListener('input', this.showTooltip);
    this.btnSave.addEventListener('click', this.saveItem);
    this.btnCancel.addEventListener('click', this.closePopover);
  }

  // Показываем подсказку
  showTooltip(e) {
    const {
      target
    } = e;
    const existingTooltip = this.actualTooltips.find(tip => tip.name === target.name);
    const currentError = this.getError(target);

    // Если есть уже такая же ошибка, ничего не меняем
    if (existingTooltip && existingTooltip.error === currentError) {
      return;
    }

    // Если есть подсказка, но ошибка другая, удаляем старую подсказку
    if (existingTooltip) {
      this.tooltip.removeTooltip(existingTooltip.id);
      this.actualTooltips = this.actualTooltips.filter(tip => tip.name !== target.name);
    }

    // Если есть новая ошибка, создаем новую подсказку
    if (currentError) {
      this.createTooltip(target, currentError);
    }
  }

  // Создаем подсказку
  createTooltip(el, errorText) {
    this.actualTooltips.push({
      name: el.name,
      id: this.tooltip.renderTooltip(errorText, el),
      error: errorText
    });
  }

  // Находим тип ошибки
  getError(el) {
    const errorKey = Object.keys(ValidityState.prototype).find(key => {
      if (!el.name) return false;
      if (key === 'valid') return false;
      return el.validity[key];
    });
    if (!errorKey) return null;
    return this.tooltip.errors[el.name][errorKey];
  }

  // Сохраняем данные товара
  saveItem(e) {
    e.preventDefault();
    const {
      name
    } = this.form;
    const nameValue = this.inputName.value;
    const priceValue = +this.inputPrice.value;
    if (this.actualTooltips.length > 0) {
      this.actualTooltips.forEach(tip => this.tooltip.removeTooltip(tip.id));
      this.actualTooltips = [];
    }
    const {
      elements
    } = this.form;
    const hasInvalidInput = [...elements].some(el => {
      const error = this.getError(el);
      if (error) {
        this.createTooltip(el, error);
        return true;
      }
      return false;
    });
    if (hasInvalidInput) return;
    if (name === 'add-product') {
      const productName = nameValue;
      const productPrice = priceValue;
      const id = Math.ceil(Math.random() * 100000);
      const product = new Product(productName, productPrice, id);
      data_namespaceObject.push(product);
    }
    if (name === 'edit-product') {
      this.currentProduct.name = nameValue;
      this.currentProduct.price = priceValue;
    }
    this.renewItems();
    this.closePopover();
  }

  // Удаляем popover
  closePopover() {
    if (this.actualTooltips.length > 0) {
      this.actualTooltips.forEach(tip => this.tooltip.removeTooltip(tip.id));
      this.actualTooltips = [];
    }
    this.popover.remove();
    this.popover = null;
  }
}
;// CONCATENATED MODULE: ./src/js/Crm.js


class Crm {
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
    data_namespaceObject.forEach(item => {
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
    const {
      target
    } = e;
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
    const product = data_namespaceObject.find(obj => obj.id === +productId);
    this.popover.inputName.value = product.name;
    this.popover.inputPrice.value = product.price;
    this.popover.currentProduct = product;
  }

  // Удаляем товар
  deleteItem(element) {
    const product = element.closest('.item');
    const productId = product.getAttribute('data-id');
    const index = data_namespaceObject.findIndex(obj => obj.id === +productId);
    if (index !== -1) {
      data_namespaceObject.splice(index, 1);
      this.renderProducts();
    }
  }
}
;// CONCATENATED MODULE: ./src/js/startApp.js


const container = document.querySelector('.crm__container');
const app = new App(container);
app.bindToDOM();
const crm = new Crm(app);
crm.renderProducts();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map