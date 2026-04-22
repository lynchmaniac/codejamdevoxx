import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() { super('Preloader'); }

    init() {
        this.cameras.main.setBackgroundColor(0x111111);
        this.add.rectangle(640, 360, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(640 - 230, 360, 4, 28, 0xffffff);
        this.add.text(640, 410, 'Loading...', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setOrigin(0.5);
        this.load.on('progress', (progress: number) => { bar.width = 4 + (460 * progress); });
    }

    preload() { /* all generated in create() */ }

    create() {
        this.generateTextures();
        this.scene.start('MainMenu');
    }

    private drawStar(g: Phaser.GameObjects.Graphics, cx: number, cy: number, points: number, outerR: number, innerR: number) {
        const pts: { x: number; y: number }[] = [];
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
        }
        g.fillPoints(pts, true);
    }

    private generateTextures() {
        const g = this.add.graphics();

        // ── PLAYER — Ellen Ripley (80×128) ──────────────────────────────
        // Tough woman: tank top, cargo pants, short hair, combat boots
        g.clear();
        // Shadow / depth base
        g.fillStyle(0x1a1a1a, 0.25);
        g.fillEllipse(40, 122, 50, 10);

        // Combat boots
        g.fillStyle(0x2A1A0A);
        g.fillRect(16, 108, 20, 18);
        g.fillRect(44, 108, 20, 18);
        g.fillStyle(0x3A2A1A);
        g.fillRect(14, 114, 22, 6);
        g.fillRect(42, 114, 22, 6);

        // Cargo pants (dark olive green)
        g.fillStyle(0x3A4A28);
        g.fillRect(18, 72, 20, 40);
        g.fillRect(42, 72, 20, 40);
        // Cargo pockets
        g.fillStyle(0x2E3A20);
        g.fillRect(18, 82, 14, 14);
        g.fillRect(48, 82, 14, 14);
        // Belt
        g.fillStyle(0x1A1200);
        g.fillRect(16, 70, 48, 6);
        g.fillStyle(0xBB9900);
        g.fillRect(34, 71, 12, 4); // buckle

        // Tank top (olive/military tan)
        g.fillStyle(0x6B7A44);
        g.fillRect(20, 36, 40, 38);
        // Muscle shading on arms
        g.fillStyle(0xD4956A);
        g.fillRect(8, 38, 14, 30);  // left arm
        g.fillRect(58, 38, 14, 30); // right arm
        // Arm highlight
        g.fillStyle(0xE8AE84);
        g.fillRect(10, 38, 6, 14);
        g.fillRect(60, 38, 6, 14);
        // Tank straps
        g.fillStyle(0x6B7A44);
        g.fillRect(22, 30, 8, 10);
        g.fillRect(50, 30, 8, 10);

        // Neck
        g.fillStyle(0xD4956A);
        g.fillRect(34, 26, 12, 12);

        // Head / face
        g.fillStyle(0xD4956A);
        g.fillEllipse(40, 16, 30, 28);
        // Face highlight
        g.fillStyle(0xE8AE84);
        g.fillEllipse(38, 13, 16, 14);

        // Short dirty-blonde hair
        g.fillStyle(0xB8922A);
        g.fillEllipse(40, 8, 30, 18); // top of hair
        g.fillRect(25, 6, 30, 10);    // hairline
        g.fillStyle(0xA07820);
        g.fillRect(25, 4, 30, 6);     // darker roots
        // Ear
        g.fillStyle(0xC48060);
        g.fillEllipse(26, 17, 7, 9);
        g.fillEllipse(54, 17, 7, 9);

        // Eyes (intense)
        g.fillStyle(0x1A1A1A);
        g.fillEllipse(33, 15, 8, 6);
        g.fillEllipse(47, 15, 8, 6);
        g.fillStyle(0x4A8ABE); // blue-grey iris
        g.fillEllipse(33, 15, 5, 4);
        g.fillEllipse(47, 15, 5, 4);
        g.fillStyle(0x000000);
        g.fillEllipse(33, 15, 3, 3);
        g.fillEllipse(47, 15, 3, 3);
        // Eye highlight
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(34, 14, 2, 2);
        g.fillEllipse(48, 14, 2, 2);

        // Eyebrows (determined)
        g.fillStyle(0x8A6A18);
        g.fillRect(28, 10, 10, 2);
        g.fillRect(42, 10, 10, 2);

        // Mouth (set jaw)
        g.fillStyle(0xA06850);
        g.fillRect(33, 20, 14, 3);

        // Fists at sides
        g.fillStyle(0xC48060);
        g.fillRect(8, 66, 14, 12);
        g.fillRect(58, 66, 14, 12);

        g.generateTexture('player', 80, 128);

        // ── PLAYER ATTACKING (80×128) ──
        g.clear();
        // Shadow
        g.fillStyle(0x1a1a1a, 0.25);
        g.fillEllipse(40, 122, 50, 10);

        // Boots
        g.fillStyle(0x2A1A0A);
        g.fillRect(16, 108, 20, 18);
        g.fillRect(44, 108, 20, 18);
        g.fillStyle(0x3A2A1A);
        g.fillRect(14, 114, 22, 6);
        g.fillRect(42, 114, 22, 6);

        // Pants (wide stance — left leg forward)
        g.fillStyle(0x3A4A28);
        g.fillRect(14, 72, 20, 40);
        g.fillRect(46, 68, 20, 44);
        g.fillStyle(0x2E3A20);
        g.fillRect(14, 82, 14, 14);
        g.fillRect(48, 80, 14, 14);
        g.fillStyle(0x1A1200);
        g.fillRect(12, 70, 52, 5);
        g.fillStyle(0xBB9900);
        g.fillRect(34, 71, 10, 3);

        // Body leaning forward
        g.fillStyle(0x6B7A44);
        g.fillRect(20, 34, 40, 40);

        // LEFT arm pulled back
        g.fillStyle(0xD4956A);
        g.fillRect(4, 40, 16, 28);
        g.fillStyle(0xC48060);
        g.fillRect(4, 66, 16, 12); // fist back

        // RIGHT arm punching forward (extended)
        g.fillStyle(0xD4956A);
        g.fillRect(58, 38, 18, 14); // forearm extended
        // Big fist
        g.fillStyle(0xC48060);
        g.fillRect(74, 34, 20, 18);
        g.fillStyle(0xA05030);
        g.fillRect(76, 36, 16, 14); // knuckle shading

        // Neck
        g.fillStyle(0xD4956A);
        g.fillRect(34, 26, 12, 10);

        // Head (turned slightly forward)
        g.fillStyle(0xD4956A);
        g.fillEllipse(38, 16, 30, 28);
        g.fillStyle(0xE8AE84);
        g.fillEllipse(36, 13, 16, 14);

        // Hair
        g.fillStyle(0xB8922A);
        g.fillEllipse(38, 8, 30, 18);
        g.fillRect(23, 6, 30, 10);
        g.fillStyle(0xA07820);
        g.fillRect(23, 4, 30, 6);
        g.fillStyle(0xC48060);
        g.fillEllipse(24, 17, 7, 9);

        // Eyes (fierce)
        g.fillStyle(0x1A1A1A);
        g.fillEllipse(31, 15, 8, 5);
        g.fillEllipse(45, 15, 8, 5);
        g.fillStyle(0x4A8ABE);
        g.fillEllipse(31, 15, 5, 3);
        g.fillEllipse(45, 15, 5, 3);
        g.fillStyle(0x000000);
        g.fillEllipse(31, 15, 3, 3);
        g.fillEllipse(45, 15, 3, 3);
        g.fillStyle(0x8A6A18);
        g.fillRect(26, 10, 10, 2);
        g.fillRect(40, 9, 10, 2); // eyebrow raised on punch side
        g.fillStyle(0xA06850);
        g.fillRect(31, 20, 12, 3);

        g.generateTexture('player-attack', 96, 128);

        // ── ENEMY — Ninja (72×120) ──────────────────────────────────────
        g.clear();
        // Shadow
        g.fillStyle(0x000000, 0.2);
        g.fillEllipse(36, 114, 44, 8);

        // Tabi boots (black split-toe)
        g.fillStyle(0x111111);
        g.fillRect(12, 100, 18, 18);
        g.fillRect(42, 100, 18, 18);
        g.fillStyle(0x222222);
        g.fillRect(10, 106, 20, 6);
        g.fillRect(40, 106, 20, 6);
        // Boot split toe
        g.fillStyle(0x0A0A0A);
        g.fillRect(19, 108, 3, 10);
        g.fillRect(49, 108, 3, 10);

        // Legs — black gi pants
        g.fillStyle(0x151515);
        g.fillRect(12, 66, 20, 38);
        g.fillRect(40, 66, 20, 38);
        // Leg wrappings (shin guards)
        g.fillStyle(0x1A1A1A);
        g.fillRect(12, 80, 20, 16);
        g.fillRect(40, 80, 20, 16);
        g.fillStyle(0x252525);
        for (let y = 82; y < 96; y += 4) {
            g.fillRect(12, y, 20, 1);
            g.fillRect(40, y, 20, 1);
        }

        // Body — black gi
        g.fillStyle(0x151515);
        g.fillRect(14, 30, 44, 38);
        // Gi overlap / lapel
        g.fillStyle(0x0A0A0A);
        g.fillRect(28, 30, 16, 36);
        // Sash belt (dark red)
        g.fillStyle(0x660000);
        g.fillRect(12, 60, 48, 8);
        g.fillStyle(0x880000);
        g.fillRect(28, 60, 10, 8); // knot

        // Arms — black gi sleeves
        g.fillStyle(0x151515);
        g.fillRect(2, 30, 14, 34); // left arm
        g.fillRect(56, 30, 14, 34); // right arm
        // Hand wrappings
        g.fillStyle(0x1A1A1A);
        g.fillRect(2, 52, 14, 10);
        g.fillRect(56, 52, 14, 10);
        // Hands (gloved)
        g.fillStyle(0x0D0D0D);
        g.fillRect(2, 60, 14, 10);
        g.fillRect(56, 60, 14, 10);

        // Shuriken held in right hand
        g.fillStyle(0xAAAAAA);
        this.drawStar(g, 64, 56, 4, 10, 4); // 4-point shuriken
        g.fillStyle(0x888888);
        g.fillCircle(64, 56, 3); // center hub

        // Neck
        g.fillStyle(0xC09070);
        g.fillRect(30, 22, 12, 10);

        // Head — hooded (black hood)
        g.fillStyle(0x0D0D0D);
        g.fillEllipse(36, 14, 36, 32);
        g.fillRect(18, 14, 36, 14); // hood shadow
        // Face visible above mask (just eyes region)
        g.fillStyle(0xC09070); // skin strip around eyes
        g.fillRect(20, 12, 32, 10);

        // White eye-band mask (strips around eyes)
        g.fillStyle(0xEEEEEE);
        g.fillRect(18, 13, 36, 8);
        // Mask below eyes (black)
        g.fillStyle(0x111111);
        g.fillRect(18, 18, 36, 10);

        // Eyes (menacing, visible through mask slit)
        g.fillStyle(0x000000);
        g.fillEllipse(28, 17, 9, 6);
        g.fillEllipse(44, 17, 9, 6);
        g.fillStyle(0xDD2200); // red eyes for ninjas!
        g.fillEllipse(28, 17, 6, 4);
        g.fillEllipse(44, 17, 6, 4);
        g.fillStyle(0x000000);
        g.fillEllipse(28, 17, 3, 3);
        g.fillEllipse(44, 17, 3, 3);
        // Eye gleam
        g.fillStyle(0xFF6644, 0.7);
        g.fillEllipse(29, 16, 2, 2);
        g.fillEllipse(45, 16, 2, 2);

        g.generateTexture('enemy', 72, 120);

        // ── ENEMY HURT (72×120) ──
        g.clear();
        g.fillStyle(0x000000, 0.2);
        g.fillEllipse(36, 114, 44, 8);

        // Same ninja but staggered, orange hurt flash
        g.fillStyle(0x111111);
        g.fillRect(12, 100, 18, 18);
        g.fillRect(42, 100, 18, 18);
        g.fillStyle(0x151515);
        g.fillRect(14, 30, 44, 38);
        g.fillRect(2, 30, 14, 34);
        g.fillRect(56, 30, 14, 34);
        g.fillStyle(0x660000);
        g.fillRect(12, 60, 48, 8);
        g.fillStyle(0x151515);
        g.fillRect(12, 66, 20, 38);
        g.fillRect(40, 66, 20, 38);

        // Head tilted/staggered (orange tint)
        g.fillStyle(0xFF6600, 0.6);
        g.fillEllipse(36, 14, 36, 32);
        g.fillStyle(0xEEEEEE);
        g.fillRect(18, 13, 36, 8);
        g.fillStyle(0xFF4400); // hurt red eyes
        g.fillEllipse(28, 17, 6, 4);
        g.fillEllipse(44, 17, 6, 4);

        // Stars (impact)
        g.fillStyle(0xFFFF00, 0.9);
        this.drawStar(g, 8, 20, 5, 12, 5);
        this.drawStar(g, 60, 10, 5, 10, 4);

        g.generateTexture('enemy-hurt', 72, 120);

        // ── SHURIKEN (28×28) ─────────────────────────────────────────────
        g.clear();
        // 4-pointed throwing star
        g.fillStyle(0xCCCCCC);
        this.drawStar(g, 14, 14, 4, 13, 5);
        // Center hub
        g.fillStyle(0x888888);
        g.fillCircle(14, 14, 4);
        // Metal sheen
        g.fillStyle(0xEEEEEE, 0.7);
        g.fillCircle(11, 11, 2);
        // Dark edge
        g.lineStyle(1, 0x555555, 0.8);
        // strokeStar not available; outline handled by fillStar with smaller inner radius
        g.generateTexture('shuriken', 28, 28);

        // ── SODA BOTTLE (38×56) ──────────────────────────────────────────
        g.clear();
        g.fillStyle(0x007A30);
        g.fillRoundedRect(8, 16, 22, 34, 5);
        g.fillStyle(0x009940);
        g.fillRect(12, 8, 14, 10);
        g.fillStyle(0xEE3300);
        g.fillRoundedRect(11, 4, 16, 6, 2); // cap
        g.fillStyle(0xFFFFFF);
        g.fillRect(10, 22, 20, 16); // label
        g.fillStyle(0xFF2200);
        g.fillRect(12, 24, 16, 12); // label text color
        g.fillStyle(0xFFFFFF, 0.9);
        g.fillRect(12, 26, 6, 8); // "SF" letters placeholder
        g.fillStyle(0x55FFAA, 0.6);
        g.fillRect(26, 18, 3, 26); // shine
        g.generateTexture('soda', 38, 56);

        // ── HEART FULL (32×28) ───────────────────────────────────────────
        g.clear();
        g.fillStyle(0xFF2244);
        g.fillCircle(9, 9, 9);
        g.fillCircle(23, 9, 9);
        g.fillTriangle(0, 11, 32, 11, 16, 30);
        g.fillStyle(0xFF6688, 0.7);
        g.fillCircle(7, 7, 4); // shine
        g.generateTexture('heart-full', 32, 28);

        // ── HEART EMPTY (32×28) ──────────────────────────────────────────
        g.clear();
        g.fillStyle(0x333333);
        g.fillCircle(9, 9, 9);
        g.fillCircle(23, 9, 9);
        g.fillTriangle(0, 11, 32, 11, 16, 30);
        g.lineStyle(1, 0x555555, 1);
        g.strokeCircle(9, 9, 9);
        g.strokeCircle(23, 9, 9);
        g.generateTexture('heart-empty', 32, 28);

        // ── FURY ICON (28×28) ─────────────────────────────────────────────
        g.clear();
        // Lightning bolt
        g.fillStyle(0xFFDD00);
        g.fillTriangle(18, 2, 8, 14, 14, 14);
        g.fillTriangle(14, 14, 20, 14, 10, 26);
        g.fillStyle(0xFF8800, 0.5);
        g.fillTriangle(16, 4, 10, 14, 14, 14);
        g.generateTexture('fury-icon', 28, 28);

        g.destroy();
    }
}
