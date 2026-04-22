import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() { super('GameOver'); }

    create() {
        this.cameras.main.setBackgroundColor(0x1a0000);

        this.add.text(640, 200, 'GAME OVER', {
            fontFamily: 'Arial Black', fontSize: 80, color: '#FF2244',
            stroke: '#000000', strokeThickness: 10, align: 'center'
        }).setOrigin(0.5);

        this.add.text(640, 330, "The ninjas got her this time...", {
            fontFamily: 'Arial', fontSize: 28, color: '#ffaaaa',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(640, 490, 'Press SPACE to try again', {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(640, 540, 'Press M for main menu', {
            fontFamily: 'Arial', fontSize: 20, color: '#aaaaaa',
        }).setOrigin(0.5);

        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start('Game', { level: 1 }));
        this.input.keyboard!.once('keydown-M', () => this.scene.start('MainMenu'));

        EventBus.emit('current-scene-ready', this);
    }
}
