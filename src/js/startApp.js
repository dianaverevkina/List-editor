import App from './App';
import Crm from './Crm';

const container = document.querySelector('.crm__container');
const app = new App(container);

app.bindToDOM();

const crm = new Crm(app);
crm.renderProducts();
