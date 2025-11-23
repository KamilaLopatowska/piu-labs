import { randomColor, uid } from './helpers.js';

export function initUI(store) {
    const addSquareBtn = document.getElementById('addSquare');
    const addCircleBtn = document.getElementById('addCircle');
    const recolorSquaresBtn = document.getElementById('recolorSquares');
    const recolorCirclesBtn = document.getElementById('recolorCircles');

    const squareCount = document.getElementById('squareCount');
    const circleCount = document.getElementById('circleCount');
    const totalCount = document.getElementById('totalCount');

    const list = document.getElementById('shapeList');

    list.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (id) store.removeShape(id);
    });

    addSquareBtn.addEventListener('click', () =>
        store.addShape({
            id: uid(),
            type: 'square',
            color: randomColor(),
        })
    );

    addCircleBtn.addEventListener('click', () =>
        store.addShape({
            id: uid(),
            type: 'circle',
            color: randomColor(),
        })
    );

    recolorSquaresBtn.addEventListener('click', () =>
        store.recolor('square', randomColor)
    );

    recolorCirclesBtn.addEventListener('click', () =>
        store.recolor('circle', randomColor)
    );

    store.subscribe((state) => {
        const currentIds = [...list.children].map((el) => el.dataset.id);
        const newIds = state.shapes.map((s) => s.id);

        currentIds.forEach((id) => {
            if (!newIds.includes(id))
                list.querySelector(`[data-id="${id}"]`).remove();
        });

        state.shapes.forEach((s) => {
            if (!currentIds.includes(s.id)) {
                const div = document.createElement('div');
                div.classList.add('shape', s.type);
                div.dataset.id = s.id;
                div.style.background = s.color;
                list.appendChild(div);
            }
        });

        state.shapes.forEach((s) => {
            const el = list.querySelector(`[data-id="${s.id}"]`);
            if (el) el.style.background = s.color;
        });

        const counts = store.getCounts();
        squareCount.textContent = counts.squares;
        circleCount.textContent = counts.circles;
        totalCount.textContent = counts.total;
    });

    store.notify();
}
