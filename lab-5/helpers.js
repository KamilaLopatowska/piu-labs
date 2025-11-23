export function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
