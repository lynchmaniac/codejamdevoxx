import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    constructor() { super('MainMenu'); }

    create() {
        this.cameras.main.setBackgroundColor(0x5A9FCC);

        this.drawBuildings();

        // Ground
        this.add.rectangle(640, 700, 1280, 80, 0x888888);
        this.add.rectangle(640, 738, 1280, 20, 0x666666);

        // Title
        this.add.text(640, 110, 'STREET FURY', {
            fontFamily: 'Arial Black', fontSize: 84, color: '#FF2244',
            stroke: '#000000', strokeThickness: 10, align: 'center'
        }).setOrigin(0.5);

        this.add.text(640, 215, 'She fights back.', {
            fontFamily: 'Arial', fontSize: 28, color: '#FFD700',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // Controls panel
        this.add.rectangle(640, 520, 500, 180, 0x000000, 0.55);
        this.add.text(640, 440, 'CONTROLS', {
            fontFamily: 'Arial Black', fontSize: 20, color: '#FFD700',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(640, 530,
            ['Arrow Keys   Move',
             'Z / SPACE    Punch',
             'X            STREET FURY (instant-kills all on-screen ninjas!)'].join('\n'),
            {
                fontFamily: 'Arial', fontSize: 18, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center', lineSpacing: 10
            }).setOrigin(0.5);

        const pressStart = this.add.text(640, 660, 'Press SPACE to start', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({ targets: pressStart, alpha: 0, duration: 600, yoyo: true, repeat: -1 });

        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start('Game', { level: 1 }));

        EventBus.emit('current-scene-ready', this);
    }

    drawBuildings() {
        const buildingData = [
            { x: 90, w: 110, h: 280, color: 0x334455 },
            { x: 220, w: 85, h: 210, color: 0x445566 },
            { x: 340, w: 145, h: 340, color: 0x223344 },
            { x: 510, w: 100, h: 240, color: 0x334455 },
            { x: 640, w: 160, h: 390, color: 0x1A2A3A },
            { x: 810, w: 120, h: 300, color: 0x334455 },
            { x: 960, w: 105, h: 260, color: 0x445566 },
            { x: 1090, w: 140, h: 310, color: 0x223344 },
            { x: 1230, w: 90, h: 220, color: 0x334455 },
        ];

        buildingData.forEach(b => {
            this.add.rectangle(b.x, 680 - b.h / 2, b.w, b.h, b.color);
            for (let wx = b.x - b.w / 2 + 10; wx < b.x + b.w / 2 - 10; wx += 22) {
                for (let wy = 680 - b.h + 15; wy < 680 - 20; wy += 28) {
                    if (Math.random() > 0.4) {
                        this.add.rectangle(wx, wy, 12, 14, 0xFFCC44).setAlpha(0.75);
                    }
                }
            }
        });
    }
}
