class Store {
    constructor() {
        this.subscribers = [];

        const saved = localStorage.getItem('shapes');
        this.state = saved
            ? JSON.parse(saved)
            : {
                  shapes: [],
              };
    }

    subscribe(fn) {
        this.subscribers.push(fn);
    }

    notify() {
        localStorage.setItem('shapes', JSON.stringify(this.state));
        this.subscribers.forEach((fn) => fn(this.state));
    }

    addShape(shape) {
        this.state.shapes.push(shape);
        this.notify();
    }

    removeShape(id) {
        this.state.shapes = this.state.shapes.filter((s) => s.id !== id);
        this.notify();
    }

    recolor(type, fn) {
        this.state.shapes = this.state.shapes.map((s) =>
            s.type === type ? { ...s, color: fn() } : s
        );
        this.notify();
    }

    clearShapes() {
        this.state.shapes = [];
        this.notify();
    }

    getCounts() {
        return {
            squares: this.state.shapes.filter((s) => s.type === 'square')
                .length,
            circles: this.state.shapes.filter((s) => s.type === 'circle')
                .length,
            total: this.state.shapes.length,
        };
    }
}

export const store = new Store();
