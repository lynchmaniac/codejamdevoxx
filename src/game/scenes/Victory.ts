import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Victory extends Scene {
    constructor() { super('Victory'); }

    create() {
        this.cameras.main.setBackgroundColor(0x1a0a2e);

        this.add.text(512, 250, '🏆 YOU WIN! 🏆', {
            fontFamily: 'Arial Black', fontSize: 56, color: '#ffd700',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 360, 'The streets are safe again!\nOur heroine prevails!', {
            fontFamily: 'Arial', fontSize: 28, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 500, 'Press SPACE to play again', {
            fontFamily: 'Arial', fontSize: 22, color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard!.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        });

        EventBus.emit('current-scene-ready', this);
    }
}
