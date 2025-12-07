import Ajax from '../ajax/ajax.js';

const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
});

const loadBtn = document.getElementById('loadData');
const errorBtn = document.getElementById('loadError');
const resetBtn = document.getElementById('resetView');
const loader = document.getElementById('loader');
const errorBox = document.getElementById('error');
const dataList = document.getElementById('dataList');

const showLoader = () => (loader.style.display = 'block');
const hideLoader = () => (loader.style.display = 'none');
const showError = (msg) => (errorBox.textContent = msg);
const resetView = () => {
    dataList.innerHTML = '';
    errorBox.textContent = '';
    hideLoader();
};

// Pobranie danych
const loadData = async () => {
    resetView();
    showLoader();
    try {
        const data = await api.get('/posts?_limit=5');
        data.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item.title;
            dataList.appendChild(li);
        });
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
    }
};

// Wywołanie błędu
const loadError = async () => {
    resetView();
    showLoader();
    try {
        await api.get('/invalid-endpoint');
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
    }
};

loadBtn.addEventListener('click', loadData);
errorBtn.addEventListener('click', loadError);
resetBtn.addEventListener('click', resetView);
