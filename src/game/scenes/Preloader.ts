import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() { super('Preloader'); }

    init() {
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        this.add.text(512, 430, 'Loading...', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setOrigin(0.5);
        this.load.on('progress', (progress: number) => { bar.width = 4 + (460 * progress); });
    }

    preload() {
        // No external assets needed — all generated in create()
    }

    create() {
        this.generateTextures();
        this.scene.start('MainMenu');
    }

    private generateTextures() {
        const g = this.add.graphics();

        // --- Player (woman) ---
        g.clear();
        // Body (burgundy dress)
        g.fillStyle(0x8B1A1A);
        g.fillRect(14, 20, 32, 44);
        // Skin (face)
        g.fillStyle(0xE8B88A);
        g.fillCircle(30, 14, 14);
        // Grey hair
        g.fillStyle(0xAAAAAA);
        g.fillRect(16, 2, 28, 14);
        // Arms
        g.fillStyle(0xE8B88A);
        g.fillRect(2, 22, 12, 28);
        g.fillRect(46, 22, 12, 28);
        // Legs
        g.fillStyle(0x4A3728);
        g.fillRect(14, 64, 13, 24);
        g.fillRect(33, 64, 13, 24);
        // Shoes
        g.fillStyle(0x222222);
        g.fillRect(12, 86, 16, 8);
        g.fillRect(32, 86, 16, 8);
        // Eyes
        g.fillStyle(0x333333);
        g.fillCircle(24, 13, 2);
        g.fillCircle(36, 13, 2);
        g.generateTexture('player', 60, 96);

        // --- Player attacking ---
        g.clear();
        // Body
        g.fillStyle(0x8B1A1A);
        g.fillRect(14, 20, 32, 44);
        // Face
        g.fillStyle(0xE8B88A);
        g.fillCircle(30, 14, 14);
        // Hair
        g.fillStyle(0xAAAAAA);
        g.fillRect(16, 2, 28, 14);
        // Punch arm (extended right)
        g.fillStyle(0xE8B88A);
        g.fillRect(46, 22, 30, 12);
        g.fillRect(2, 22, 12, 28);
        // Fist
        g.fillStyle(0xD4A060);
        g.fillRect(74, 20, 16, 16);
        // Legs
        g.fillStyle(0x4A3728);
        g.fillRect(14, 64, 13, 24);
        g.fillRect(33, 64, 13, 24);
        g.fillStyle(0x222222);
        g.fillRect(12, 86, 16, 8);
        g.fillRect(32, 86, 16, 8);
        g.generateTexture('player-attack', 90, 96);

        // --- Enemy (suited man) ---
        g.clear();
        // Body (blue suit)
        g.fillStyle(0x1A3A6E);
        g.fillRect(12, 20, 36, 48);
        // White shirt / tie
        g.fillStyle(0xFFFFFF);
        g.fillRect(24, 22, 12, 20);
        g.fillStyle(0xFF4444);
        g.fillRect(29, 22, 6, 24);
        // Skin (face)
        g.fillStyle(0xE0C090);
        g.fillCircle(30, 13, 13);
        // Styled hair (dark brown)
        g.fillStyle(0x3D2B1F);
        g.fillRect(17, 2, 26, 12);
        g.fillRect(17, 10, 6, 6);
        // Arms
        g.fillStyle(0x1A3A6E);
        g.fillRect(2, 22, 10, 28);
        g.fillRect(48, 22, 10, 28);
        // Hands
        g.fillStyle(0xE0C090);
        g.fillRect(2, 48, 10, 10);
        g.fillRect(48, 48, 10, 10);
        // Legs (dark trousers)
        g.fillStyle(0x0D1F3C);
        g.fillRect(12, 68, 14, 24);
        g.fillRect(34, 68, 14, 24);
        // Shoes
        g.fillStyle(0x111111);
        g.fillRect(10, 90, 18, 8);
        g.fillRect(32, 90, 18, 8);
        // Eyes + smirk
        g.fillStyle(0x333333);
        g.fillCircle(24, 13, 2);
        g.fillCircle(36, 13, 2);
        g.fillStyle(0x333333);
        g.fillRect(22, 19, 16, 3);
        g.generateTexture('enemy', 60, 98);

        // --- Enemy hurt ---
        g.clear();
        g.fillStyle(0x1A3A6E);
        g.fillRect(12, 20, 36, 48);
        g.fillStyle(0xE0C090);
        g.fillCircle(30, 13, 13);
        g.fillStyle(0x3D2B1F);
        g.fillRect(17, 2, 26, 12);
        g.fillStyle(0xFF8800);
        g.fillCircle(30, 13, 8);
        g.generateTexture('enemy-hurt', 60, 98);

        // --- Soda bottle ---
        g.clear();
        // Bottle body
        g.fillStyle(0x00AA44);
        g.fillRoundedRect(10, 14, 18, 36, 4);
        // Bottle neck
        g.fillStyle(0x00AA44);
        g.fillRect(14, 6, 10, 10);
        // Cap
        g.fillStyle(0xFF4400);
        g.fillRect(13, 2, 12, 6);
        // Label
        g.fillStyle(0xFFFFFF);
        g.fillRect(12, 22, 14, 14);
        // Shine
        g.fillStyle(0x88FFAA);
        g.fillRect(22, 16, 4, 20);
        g.generateTexture('soda', 38, 54);

        // --- Heart full ---
        g.clear();
        g.fillStyle(0xFF2244);
        g.fillCircle(8, 8, 8);
        g.fillCircle(22, 8, 8);
        g.fillTriangle(0, 10, 30, 10, 15, 28);
        g.generateTexture('heart-full', 30, 28);

        // --- Heart empty ---
        g.clear();
        g.fillStyle(0x444444);
        g.fillCircle(8, 8, 8);
        g.fillCircle(22, 8, 8);
        g.fillTriangle(0, 10, 30, 10, 15, 28);
        g.generateTexture('heart-empty', 30, 28);

        g.destroy();
    }
}
