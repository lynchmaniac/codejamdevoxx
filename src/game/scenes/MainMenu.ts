import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    constructor() { super('MainMenu'); }

    create() {
        // Sky
        this.cameras.main.setBackgroundColor(0x87CEEB);

        // Ground
        this.add.rectangle(512, 720, 1024, 80, 0x888888);
        this.add.rectangle(512, 760, 1024, 20, 0x666666);

        // Buildings silhouette
        this.drawBuildings();

        // Title
        this.add.text(512, 120, 'STREET FURY', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#FF2244',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 210, 'A woman fights back!', {
            fontFamily: 'Arial', fontSize: 26, color: '#FFD700',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // Instructions
        this.add.text(512, 580, '← → ↑ ↓   Move\nZ or SPACE   Punch', {
            fontFamily: 'Arial', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3, align: 'center'
        }).setOrigin(0.5);

        const pressStart = this.add.text(512, 660, 'Press SPACE to start', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        // Blink
        this.tweens.add({ targets: pressStart, alpha: 0, duration: 600, yoyo: true, repeat: -1 });

        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start('Game', { level: 1 }));

        EventBus.emit('current-scene-ready', this);
    }

    drawBuildings() {
        const buildingData = [
            { x: 80, w: 100, h: 250, color: 0x334455 },
            { x: 200, w: 80, h: 200, color: 0x445566 },
            { x: 310, w: 130, h: 300, color: 0x223344 },
            { x: 480, w: 90, h: 220, color: 0x334455 },
            { x: 600, w: 150, h: 350, color: 0x1A2A3A },
            { x: 760, w: 110, h: 280, color: 0x334455 },
            { x: 900, w: 95, h: 190, color: 0x445566 },
        ];

        buildingData.forEach(b => {
            this.add.rectangle(b.x, 680 - b.h / 2, b.w, b.h, b.color);
            // Windows
            for (let wx = b.x - b.w / 2 + 10; wx < b.x + b.w / 2 - 10; wx += 20) {
                for (let wy = 680 - b.h + 15; wy < 680 - 20; wy += 25) {
                    if (Math.random() > 0.3) {
                        this.add.rectangle(wx, wy, 10, 12, 0xFFCC44).setAlpha(0.8);
                    }
                }
            }
        });
    }
}
