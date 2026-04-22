import { Scene, GameObjects, Math as PhaserMath } from 'phaser';

const SHURIKEN_SPEED = 360;

export class Shuriken {
    scene: Scene;
    sprite: GameObjects.Image;
    vx: number;
    vy: number;
    active: boolean = true;

    constructor(scene: Scene, fromX: number, fromY: number, toX: number, toY: number) {
        this.scene = scene;

        const dx = toX - fromX;
        const dy = toY - fromY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        this.vx = (dx / dist) * SHURIKEN_SPEED;
        this.vy = (dy / dist) * SHURIKEN_SPEED;

        this.sprite = scene.add.image(fromX, fromY, 'shuriken').setDepth(15);

        // Spin animation
        scene.tweens.add({
            targets: this.sprite,
            angle: 360,
            duration: 400,
            repeat: -1
        });
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }

    update(delta: number, worldWidth: number) {
        if (!this.active) return;
        const dt = delta / 1000;
        this.sprite.x += this.vx * dt;
        this.sprite.y += this.vy * dt;

        // Destroy if off screen
        if (
            this.sprite.x < -50 || this.sprite.x > worldWidth + 50 ||
            this.sprite.y < -50 || this.sprite.y > 800
        ) {
            this.deactivate();
        }
    }

    /** Returns true if the shuriken hits the player */
    checkHit(playerX: number, playerY: number): boolean {
        if (!this.active) return false;
        const dx = Math.abs(playerX - this.sprite.x);
        const dy = Math.abs(playerY - this.sprite.y);
        if (dx < 28 && dy < 36) {
            this.deactivate();
            return true;
        }
        return false;
    }

    deactivate() {
        this.active = false;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 150,
            onComplete: () => this.sprite.destroy()
        });
    }

    destroy() {
        this.active = false;
        if (this.sprite && this.sprite.active) this.sprite.destroy();
    }
}
