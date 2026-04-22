import { Scene, GameObjects } from 'phaser';

export class SodaBottle {
    scene: Scene;
    sprite: GameObjects.Image;
    active: boolean = true;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.sprite = scene.add.image(x, y, 'soda').setDepth(8);
        // Gentle bob animation
        scene.tweens.add({
            targets: this.sprite,
            y: y - 8,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }

    checkPickup(playerX: number, playerY: number): boolean {
        if (!this.active) return false;
        const dx = Math.abs(playerX - this.sprite.x);
        const dy = Math.abs(playerY - this.sprite.y);
        if (dx < 40 && dy < 50) {
            this.collect();
            return true;
        }
        return false;
    }

    collect() {
        this.active = false;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 300,
            onComplete: () => this.sprite.destroy()
        });
    }

    destroy() {
        this.sprite.destroy();
    }
}
