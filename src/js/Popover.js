import data from './data.json';
import Product from './Product';
import Tooltip from './Tooltip';
import App from './App';

export default class Popover {
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
    const { target } = e;

    const existingTooltip = this.actualTooltips.find((tip) => tip.name === target.name);
    const currentError = this.getError(target);

    // Если есть уже такая же ошибка, ничего не меняем
    if (existingTooltip && existingTooltip.error === currentError) {
      return;
    }

    // Если есть подсказка, но ошибка другая, удаляем старую подсказку
    if (existingTooltip) {
      this.tooltip.removeTooltip(existingTooltip.id);
      this.actualTooltips = this.actualTooltips.filter((tip) => tip.name !== target.name);
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
      error: errorText,
    });
  }

  // Находим тип ошибки
  getError(el) {
    const errorKey = Object.keys(ValidityState.prototype).find((key) => {
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
    const { name } = this.form;
    const nameValue = this.inputName.value;
    const priceValue = +this.inputPrice.value;
    if (this.actualTooltips.length > 0) {
      this.actualTooltips.forEach((tip) => this.tooltip.removeTooltip(tip.id));
      this.actualTooltips = [];
    }

    const { elements } = this.form;
    const hasInvalidInput = [...elements].some((el) => {
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
      data.push(product);
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
      this.actualTooltips.forEach((tip) => this.tooltip.removeTooltip(tip.id));
      this.actualTooltips = [];
    }

    this.popover.remove();
    this.popover = null;
  }
}
