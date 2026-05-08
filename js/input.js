class InputHandler {
    constructor(app, moveLeft, moveRight, rotate) {
        this.app = app;
        this.moveLeft = moveLeft;
        this.moveRight = moveRight;
        this.rotate = rotate;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isTouchDown = false;

        this.app.stage.interactive = true;
        this.app.stage.hitArea = this.app.renderer.screen; // Make the whole screen interactive

        this.app.stage.on('touchstart', this.onTouchStart.bind(this));
        this.app.stage.on('touchmove', this.onTouchMove.bind(this));
        this.app.stage.on('touchend', this.onTouchEnd.bind(this));
        this.app.stage.on('touchendoutside', this.onTouchEnd.bind(this));
    }

    onTouchStart(e) {
        this.touchStartX = e.data.global.x;
        this.touchStartY = e.data.global.y;
        this.isTouchDown = true;
    }

    onTouchMove(e) {
        if (!this.isTouchDown) return;

        const touchMoveX = e.data.global.x;
        const touchMoveY = e.data.global.y;
        const deltaX = touchMoveX - this.touchStartX;
        const deltaY = touchMoveY - this.touchStartY;

        if (Math.abs(deltaX) > 20) { // Horizontal swipe threshold
            if (deltaX > 0) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
            this.touchStartX = touchMoveX; // Reset start X to prevent continuous movement
        }

        if (Math.abs(deltaY) > 30) { // Vertical swipe threshold
             this.rotate();
           this.touchStartY = touchMoveY;
        }
    }

    onTouchEnd() {
        this.isTouchDown = false;
    }
}