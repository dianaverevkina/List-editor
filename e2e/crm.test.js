import puppeteer from 'puppeteer';

const childProcess = require('child_process');

describe('CRM', () => {
  let browser;
  let page;
  let server;

  const baseUrl = 'http://localhost:9000';
  beforeAll(async () => {
    server = await childProcess.fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });
    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 100,
      // devtools: false,
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  jest.setTimeout(60000);

  test('A new product should appear after clicking add button and filling out the form', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.crm__list');

    const crm = await page.$('.crm');
    const addBtn = await crm.$('.crm__add');
    await addBtn.click();

    await page.waitForSelector('.popover');

    const form = await page.$('.form');
    const inputName = await form.$('[name="product-name"]');
    const inputPrice = await form.$('[name="product-price"]');

    const saveBtn = await form.$('.form__btn-save');

    const initialRowCount = await page.evaluate(() => document.querySelectorAll('.crm__list .item').length);

    await inputName.type('Samsung Galaxy S24');
    await inputPrice.type('100000');
    await saveBtn.click();

    const updatedRowCount = await page.evaluate(() => document.querySelectorAll('.crm__list .item').length);

    await page.waitForSelector('.popover', { hidden: true });

    expect(updatedRowCount).toBe(initialRowCount + 1);
  });

  test('Popover should disapperar after clicking cancel button', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.crm__list');

    const crm = await page.$('.crm');
    const addBtn = await crm.$('.crm__add');
    await addBtn.click();

    const form = await page.$('.form');
    const cancelBtn = await form.$('.form__btn-cancel');

    await cancelBtn.click();

    await page.waitForSelector('.popover', { hidden: true });
  });

  test('If the input is filled incorrectly, the tooltip should appear.', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.crm__list');

    const crm = await page.$('.crm');
    const addBtn = await crm.$('.crm__add');
    await addBtn.click();

    const form = await page.$('.form');
    const inputName = await form.$('[name="product-name"]');
    const inputPrice = await form.$('[name="product-price"]');

    await inputName.type('Samsung');
    await inputPrice.type('');
    await form.press('Enter');

    await page.waitForSelector('.form__tooltip');

    const tooltip = await page.evaluate(() => document.querySelector('.form .form__tooltip'));
    expect(tooltip).toBeDefined();
  });

  test('The form fields should be populated with product data', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.crm__list');

    const crm = await page.$('.crm');
    const product = await crm.$('.item');
    const editBtn = await product.$('.item__control-edit');
    await editBtn.click();

    await page.waitForSelector('.popover');

    const inputNameValue = await page.evaluate(() => {
      const name = document.querySelector('[name="product-name"]');
      return name.value;
    });
    const inputPriceValue = await page.evaluate(() => {
      const price = document.querySelector('[name="product-price"]');
      return price.value;
    });

    expect(inputNameValue).toEqual('iPhone XR');
    expect(inputPriceValue).toEqual('60000');
  });

  test('The form fields should be populated with product data', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.crm__list');

    const crm = await page.$('.crm');
    const product = await crm.$('.item');
    const editBtn = await product.$('.item__control-edit');
    await editBtn.click();

    await page.waitForSelector('.popover');

    const form = await page.$('.form');
    const inputName = await form.$('[name="product-name"]');
    const inputPrice = await form.$('[name="product-price"]');

    for (let i = 0; i < 2; i++) {
      await inputName.press('Backspace');
    }

    await inputPrice.type('0');

    const inputNameValue = await page.evaluate(() => {
      const name = document.querySelector('[name="product-name"]');
      return name.value.trim();
    });

    const inputPriceValue = await page.evaluate(() => {
      const price = document.querySelector('[name="product-price"]');
      return price.value.trim();
    });

    await form.press('Enter');
    await page.waitForSelector('.popover', { hidden: true });

    const productName = await page.evaluate(() => {
      const item = document.querySelectorAll('.crm__list .item')[0];
      const itemName = item.querySelector('.item__name');
      return itemName.textContent.trim();
    });

    const productPrice = await page.evaluate(() => {
      const itemEl = document.querySelectorAll('.crm__list .item')[0];
      const itemPrice = itemEl.querySelector('.item__price');
      return itemPrice.textContent.trim();
    });

    expect(inputNameValue).toEqual(productName);
    expect(inputPriceValue).toEqual(productPrice);
  });

  test('Product should deleted after clicking delete button', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.crm__list');

    const crm = await page.$('.crm');
    const product = await crm.$('.item');
    const deleteBtn = await product.$('.item__control-delete');

    const initialRowCount = await page.evaluate(() => document.querySelectorAll('.crm__list .item').length);

    await deleteBtn.click();

    const updatedRowCount = await page.evaluate(() => document.querySelectorAll('.crm__list .item').length);

    expect(updatedRowCount).toBe(initialRowCount - 1);
  });
});
