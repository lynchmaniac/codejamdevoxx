import { Scene, GameObjects } from 'phaser';

export class HUD {
    scene: Scene;
    hearts: GameObjects.Image[] = [];
    levelText: GameObjects.Text;
    enemyText: GameObjects.Text;
    furyBarBg: GameObjects.Rectangle;
    furyBar: GameObjects.Rectangle;
    furyLabel: GameObjects.Text;
    furyIcon: GameObjects.Image;
    furyTween: Phaser.Tweens.Tween | null = null;

    constructor(scene: Scene) {
        this.scene = scene;

        // ── Hearts (10) ─────────────────────────────────────────────
        for (let i = 0; i < 10; i++) {
            const heart = scene.add.image(20 + i * 36, 24, 'heart-full')
                .setScrollFactor(0)
                .setDepth(100);
            this.hearts.push(heart);
        }

        // ── Level (center) ──────────────────────────────────────────
        this.levelText = scene.add.text(640, 12, 'LEVEL 1', {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        // ── Enemy counter (right) ────────────────────────────────────
        this.enemyText = scene.add.text(1260, 12, 'Ninjas: 10', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ff4444',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        // ── FURY bar (below hearts) ──────────────────────────────────
        this.furyIcon = scene.add.image(20, 55, 'fury-icon')
            .setScrollFactor(0).setDepth(100).setOrigin(0, 0.5);

        this.furyLabel = scene.add.text(50, 48, 'FURY', {
            fontFamily: 'Arial Black', fontSize: 13, color: '#FFD700',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(100);

        // Background bar
        this.furyBarBg = scene.add.rectangle(130 + 110, 55, 220, 14, 0x333333)
            .setScrollFactor(0).setDepth(100).setOrigin(0.5, 0.5);
        scene.add.rectangle(130 + 110, 55, 222, 16, 0x000000, 0.6)
            .setScrollFactor(0).setDepth(99).setOrigin(0.5, 0.5);

        // Fill bar
        this.furyBar = scene.add.rectangle(130, 55, 220, 14, 0x00CC44)
            .setScrollFactor(0).setDepth(101).setOrigin(0, 0.5);
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
        this.enemyText.setText(`Ninjas: ${remaining}`);
    }

    /** ratio 0=depleted, 1=ready */
    updateFury(ratio: number) {
        const maxW = 220;
        this.furyBar.width = Math.max(2, maxW * ratio);
        if (ratio >= 1) {
            this.furyBar.setFillStyle(0x00FF66);
            this.furyLabel.setColor('#00FF99');
            if (!this.furyTween) {
                this.furyTween = this.scene.tweens.add({
                    targets: this.furyBar,
                    alpha: 0.5,
                    duration: 400,
                    yoyo: true,
                    repeat: -1
                });
            }
        } else {
            if (this.furyTween) {
                this.furyTween.stop();
                this.furyTween = null;
            }
            this.furyBar.setFillStyle(0xCC4400);
            this.furyLabel.setColor('#FF8800');
            this.furyBar.setAlpha(1);
        }
    }

    destroy() {
        if (this.furyTween) { this.furyTween.stop(); this.furyTween = null; }
        this.hearts.forEach(h => h.destroy());
        this.levelText.destroy();
        this.enemyText.destroy();
        this.furyBarBg.destroy();
        this.furyBar.destroy();
        this.furyLabel.destroy();
        this.furyIcon.destroy();
    }
}
