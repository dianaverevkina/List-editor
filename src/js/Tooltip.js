export default class Tooltip {
  constructor() {
    this.tooltips = [];
    this.errors = {
      'product-name': {
        valueMissing: 'Введите имя товара',
      },
      'product-price': {
        valueMissing: 'Введите цену товара',
        patternMismatch: 'Поле может содержать только цифры',
      },
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
      element: tooltipEl,
    });

    const { left, bottom } = input.getBoundingClientRect();

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${bottom}px`;
    document.body.append(tooltipEl);

    return id;
  }

  // Удаляем подсказку
  removeTooltip(id) {
    const tooltip = this.tooltips.find((obj) => obj.id === id);
    tooltip.element.remove();

    this.tooltips = this.tooltips.filter((obj) => obj.id !== id);
  }
}
