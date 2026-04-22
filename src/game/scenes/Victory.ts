import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Victory extends Scene {
    constructor() { super('Victory'); }

    create() {
        this.cameras.main.setBackgroundColor(0x1a0a2e);

        this.add.text(640, 220, 'YOU WIN!', {
            fontFamily: 'Arial Black', fontSize: 88, color: '#ffd700',
            stroke: '#000000', strokeThickness: 10, align: 'center'
        }).setOrigin(0.5);

        this.add.text(640, 350, 'The streets are safe again!\nOur heroine has defeated\nevery last ninja.', {
            fontFamily: 'Arial', fontSize: 26, color: '#ffffff',
            align: 'center', lineSpacing: 8
        }).setOrigin(0.5);

        const pressStart = this.add.text(640, 580, 'Press SPACE to play again', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#aaffaa',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({ targets: pressStart, alpha: 0, duration: 700, yoyo: true, repeat: -1 });

        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start('MainMenu'));

        EventBus.emit('current-scene-ready', this);
    }
}
