class Particle extends PIXI.Graphics {
    constructor(x, y, color) {
        super();
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 3;
        this.alpha = 1;

        this.beginFill(color);
        this.drawCircle(0, 0, this.radius);
        this.endFill();

        this.life = 1; //Seconds
        this.fadeSpeed = 0.02;
        this.velocityX = (Math.random() - 0.5) * 2;
        this.velocityY = (Math.random() - 0.5) * 2;

        this.pivot.x = this.radius;
        this.pivot.y = this.radius;

    }

    update(delta) {
        this.alpha -= this.fadeSpeed * delta;
        this.x += this.velocityX * delta * 5;
        this.y += this.velocityY * delta * 5;

        if (this.alpha <= 0) {
            this.destroy();
            return true;
        }
        return false;
    }

}

class ParticleSystem {

    constructor(app) {
        this.app = app;
        this.particles = [];
    }

    explode(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const particle = new Particle(x, y, color);
            this.app.stage.addChild(particle);
            this.particles.push(particle);
        }
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if (particle.update(delta)) {
                this.particles.splice(i, 1);
            }
        }
    }

}