const LS_KEY = 'kanban-data';

function saveState() {
    const data = {};
    document.querySelectorAll('.column').forEach((col) => {
        const key = col.dataset.col;
        const cards = [...col.querySelectorAll('.card')].map((card) => ({
            id: card.dataset.id,
            text: card.querySelector('.card-content').innerText,
            color: card.style.backgroundColor || null,
        }));
        data[key] = cards;
    });
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function loadState() {
    const data = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    Object.keys(data).forEach((col) => {
        data[col].forEach((card) =>
            createCard(col, card.text, card.id, card.color)
        );
    });
    updateCounters();
}

function randomColor() {
    return `hsl(${Math.random() * 360},70%,85%)`;
}

function createCard(
    column,
    text = 'Nowa karta',
    id = Date.now(),
    color = randomColor()
) {
    const container = document.querySelector(`[data-col="${column}"] .cards`);

    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id;
    card.style.backgroundColor = color;

    card.innerHTML = `
    <div class="card-content" contenteditable="true">${text}</div>
    <button class="left">←</button>
    <button class="right">→</button>
    <button class="paint">🎨</button>
    <button class="del">x</button>
  `;

    container.appendChild(card);
    updateCounters();
    saveState();
}

function updateCounters() {
    document.querySelectorAll('.column').forEach((col) => {
        const count = col.querySelectorAll('.card').length;
        col.querySelector('.count').innerText = count;
    });
}

document.querySelectorAll('.add-card').forEach((btn) => {
    btn.addEventListener('click', () => {
        const col = btn.parentElement.dataset.col;
        createCard(col);
    });
});

document.querySelectorAll('.column').forEach((col) => {
    col.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;

        const colName = col.dataset.col;

        if (e.target.classList.contains('del')) {
            card.remove();
        }

        if (e.target.classList.contains('left')) {
            if (colName === 'doing')
                createCard(
                    'todo',
                    card.querySelector('.card-content').innerText,
                    card.dataset.id,
                    card.style.backgroundColor
                );
            if (colName === 'done')
                createCard(
                    'doing',
                    card.querySelector('.card-content').innerText,
                    card.dataset.id,
                    card.style.backgroundColor
                );
            card.remove();
        }

        if (e.target.classList.contains('right')) {
            if (colName === 'todo')
                createCard(
                    'doing',
                    card.querySelector('.card-content').innerText,
                    card.dataset.id,
                    card.style.backgroundColor
                );
            if (colName === 'doing')
                createCard(
                    'done',
                    card.querySelector('.card-content').innerText,
                    card.dataset.id,
                    card.style.backgroundColor
                );
            card.remove();
        }

        if (e.target.classList.contains('paint')) {
            card.style.backgroundColor = randomColor();
        }

        updateCounters();
        saveState();
    });
});

document.querySelectorAll('.color-col').forEach((btn) => {
    btn.addEventListener('click', () => {
        const cards = btn.parentElement.querySelectorAll('.card');
        cards.forEach((c) => (c.style.backgroundColor = randomColor()));
        saveState();
    });
});

document.querySelectorAll('.sort-col').forEach((btn) => {
    btn.addEventListener('click', () => {
        const container = btn.parentElement.querySelector('.cards');
        const cards = [...container.querySelectorAll('.card')];
        cards.sort((a, b) => a.innerText.localeCompare(b.innerText));
        cards.forEach((c) => container.appendChild(c));
        saveState();
    });
});

document.addEventListener('input', (e) => {
    if (e.target.classList.contains('card-content')) saveState();
});

loadState();
