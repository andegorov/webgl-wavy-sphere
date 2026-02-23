class Clock {
    constructor(autoStart = true) {
        this.startTime = 0;
        this.currentTime = 0;
        this.elapsedTime = 0;
        this.running = false;
        if (autoStart) {
            this.start();
        }
    }
    start() {
        this.startTime = performance.now();
        this.running = true;
    }
    stop() {
        this.update();
        this.running = false;
    }
    update() {
        if (this.running) {
            this.currentTime = performance.now();
            this.elapsedTime = (this.currentTime - this.startTime) / 1000;
        }
    }
    getElapsedTime() {
        this.update();
        return this.elapsedTime;
    }
    deltaTime() {
        const currentTime = performance.now();
        const delta = (currentTime - this.currentTime) / 1000;
        this.currentTime = currentTime;
        return delta;
    }
}
export { Clock };
