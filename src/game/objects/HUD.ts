import { Scene, GameObjects } from 'phaser';

export class HUD {
    scene: Scene;
    hearts: GameObjects.Image[] = [];
    levelText: GameObjects.Text;
    enemyText: GameObjects.Text;

    constructor(scene: Scene) {
        this.scene = scene;

        // Hearts (10 total)
        for (let i = 0; i < 10; i++) {
            const heart = scene.add.image(24 + i * 38, 28, 'heart-full')
                .setScrollFactor(0)
                .setDepth(100);
            this.hearts.push(heart);
        }

        this.levelText = scene.add.text(512, 16, 'LEVEL 1', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        this.enemyText = scene.add.text(980, 16, 'Enemies: 10', {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ff4444',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
    }

    updateHearts(hp: number) {
        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].setTexture(i < hp ? 'heart-full' : 'heart-empty');
        }
    }

    updateLevel(level: number) {
        this.levelText.setText(`LEVEL ${level}`);
    }

    updateEnemies(remaining: number) {
        this.enemyText.setText(`Enemies: ${remaining}`);
    }

    destroy() {
        this.hearts.forEach(h => h.destroy());
        this.levelText.destroy();
        this.enemyText.destroy();
    }
}
