import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() { super('GameOver'); }

    create() {
        this.cameras.main.setBackgroundColor(0x1a0000);

        this.add.text(512, 220, 'GAME OVER', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#FF2244',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 340, "She'll be back!", {
            fontFamily: 'Arial', fontSize: 30, color: '#ffaaaa',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 500, 'Press SPACE to try again\nPress M for main menu', {
            fontFamily: 'Arial', fontSize: 22, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3, align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start('Game', { level: 1 }));
        this.input.keyboard!.once('keydown-M', () => this.scene.start('MainMenu'));

        EventBus.emit('current-scene-ready', this);
    }
}
