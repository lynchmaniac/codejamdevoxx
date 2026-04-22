import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Math as PhaserMath, Geom } from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { SodaBottle } from '../objects/SodaBottle';
import { HUD } from '../objects/HUD';

const WORLD_WIDTH = 3072;
const SCREEN_WIDTH = 1024;
const SCREEN_HEIGHT = 768;
const GROUND_Y = 580;

interface LevelConfig {
    skyColor: number;
    groundColor: number;
    buildingColors: number[];
    waveX: number[];
}

const LEVELS: LevelConfig[] = [
    {
        skyColor: 0x87CEEB,
        groundColor: 0x888888,
        buildingColors: [0x334455, 0x445566, 0x223344],
        waveX: [600, 1400, 2200],
    },
    {
        skyColor: 0xE8A0A0,
        groundColor: 0x776655,
        buildingColors: [0x553322, 0x664433, 0x442211],
        waveX: [600, 1400, 2200],
    },
    {
        skyColor: 0x1A1A3E,
        groundColor: 0x444444,
        buildingColors: [0x1A2A3A, 0x0D1F3C, 0x223344],
        waveX: [600, 1400, 2200],
    },
];

const WAVES = [[3, 3, 4], [3, 3, 4], [3, 3, 4]];

export class Game extends Scene {
    player!: Player;
    enemies: Enemy[] = [];
    sodaBottles: SodaBottle[] = [];
    hud!: HUD;

    currentLevel: number = 1;
    enemiesDefeated: number = 0;
    totalEnemies: number = 10;
    waveIndex: number = 0;
    waveTriggered: boolean[] = [false, false, false];

    constructor() { super('Game'); }

    init(data: { level?: number }) {
        this.currentLevel = data?.level ?? 1;
        this.enemiesDefeated = 0;
        this.waveIndex = 0;
        this.waveTriggered = [false, false, false];
        this.enemies = [];
        this.sodaBottles = [];
    }

    create() {
        const cfg = LEVELS[this.currentLevel - 1];

        this.cameras.main.setBackgroundColor(cfg.skyColor);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, SCREEN_HEIGHT);

        this.buildBackground(cfg);

        // Ground
        this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y + 80, WORLD_WIDTH, 160, cfg.groundColor).setDepth(1);
        this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, 6, 0x555555).setDepth(2);

        // Sidewalk lines
        for (let x = 0; x < WORLD_WIDTH; x += 60) {
            this.add.rectangle(x, GROUND_Y + 40, 2, 120, 0x777777).setDepth(2).setAlpha(0.3);
        }

        // Soda bottles
        this.sodaBottles.push(new SodaBottle(this, WORLD_WIDTH * 0.33, GROUND_Y - 30));
        this.sodaBottles.push(new SodaBottle(this, WORLD_WIDTH * 0.66, GROUND_Y - 30));

        // Player
        this.player = new Player(this, 150, GROUND_Y - 20, () => this.handlePlayerDeath());

        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.0);

        // Spawn first wave
        this.spawnWave(0);

        // HUD
        this.hud = new HUD(this);
        this.hud.updateLevel(this.currentLevel);
        this.hud.updateEnemies(this.totalEnemies);

        EventBus.emit('current-scene-ready', this);
    }

    buildBackground(cfg: LevelConfig) {
        const buildingTemplates = [
            { w: 120, h: 300 }, { w: 90, h: 220 }, { w: 150, h: 380 },
            { w: 100, h: 260 }, { w: 130, h: 340 }, { w: 80, h: 200 },
            { w: 110, h: 290 },
        ];

        let bx = 0;
        let idx = 0;
        while (bx < WORLD_WIDTH + 200) {
            const tmpl = buildingTemplates[idx % buildingTemplates.length];
            const color = cfg.buildingColors[idx % cfg.buildingColors.length];
            this.add.rectangle(bx + tmpl.w / 2, GROUND_Y - tmpl.h / 2, tmpl.w, tmpl.h, color).setDepth(0);

            for (let wx = bx + 10; wx < bx + tmpl.w - 10; wx += 22) {
                for (let wy = GROUND_Y - tmpl.h + 15; wy < GROUND_Y - 20; wy += 28) {
                    if (Math.random() > 0.35) {
                        const lit = cfg.skyColor === 0x1A1A3E ? Math.random() > 0.4 : Math.random() > 0.6;
                        this.add.rectangle(wx, wy, 12, 14, lit ? 0xFFCC44 : 0x223355).setDepth(0).setAlpha(0.9);
                    }
                }
            }

            bx += tmpl.w + PhaserMath.Between(5, 20);
            idx++;
        }
    }

    spawnWave(waveIdx: number) {
        const levelIdx = this.currentLevel - 1;
        const count = WAVES[levelIdx][waveIdx];
        const waveX = LEVELS[levelIdx].waveX[waveIdx];
        const spread = 300;

        for (let i = 0; i < count; i++) {
            const ex = waveX + PhaserMath.Between(-spread / 2, spread / 2);
            const ey = GROUND_Y - PhaserMath.Between(0, 40);
            this.enemies.push(new Enemy(this, ex, ey, () => this.handleEnemyDeath()));
        }
    }

    handleEnemyDeath() {
        this.enemiesDefeated++;
        const remaining = this.totalEnemies - this.enemiesDefeated;
        this.hud.updateEnemies(Math.max(0, remaining));

        if (this.enemiesDefeated >= this.totalEnemies) {
            this.time.delayedCall(1000, () => this.levelComplete());
        }
    }

    handlePlayerDeath() {
        this.time.delayedCall(500, () => {
            this.cleanUp();
            this.scene.start('GameOver');
        });
    }

    levelComplete() {
        this.cameras.main.flash(500, 255, 255, 255);

        const msg = this.currentLevel >= 3 ? 'YOU WIN!' : `LEVEL ${this.currentLevel} CLEAR!`;
        const text = this.add.text(
            SCREEN_WIDTH / 2,
            SCREEN_HEIGHT / 2,
            msg,
            { fontFamily: 'Arial Black', fontSize: 52, color: '#FFD700', stroke: '#000000', strokeThickness: 8 }
        ).setOrigin(0.5).setDepth(200).setScrollFactor(0);

        this.tweens.add({ targets: text, scaleX: 1.2, scaleY: 1.2, duration: 300, yoyo: true, repeat: 2 });

        this.time.delayedCall(2000, () => {
            this.cleanUp();
            if (this.currentLevel >= 3) {
                this.scene.start('Victory');
            } else {
                this.scene.start('Game', { level: this.currentLevel + 1 });
            }
        });
    }

    cleanUp() {
        this.enemies.forEach(e => { if (e.active) e.destroy(); });
        this.sodaBottles.forEach(s => { if (s.active) s.destroy(); });
        this.hud.destroy();
    }

    update(_time: number, delta: number) {
        if (!this.player) return;

        this.player.update(delta);

        // Clamp player X to world
        this.player.sprite.x = PhaserMath.Clamp(this.player.sprite.x, 30, WORLD_WIDTH - 30);

        // Check wave triggers based on camera position
        const camX = this.cameras.main.scrollX;
        for (let wi = 1; wi < 3; wi++) {
            if (!this.waveTriggered[wi] && camX + SCREEN_WIDTH > LEVELS[this.currentLevel - 1].waveX[wi] - 400) {
                this.waveTriggered[wi] = true;
                this.spawnWave(wi);
            }
        }

        // Update enemies
        const activeEnemies = this.enemies.filter(e => e.active);
        for (const enemy of activeEnemies) {
            enemy.update(delta, this.player.x, this.player.y);

            // Enemy attacks player
            if (enemy.isAdjacentTo(this.player.x, this.player.y) && enemy.canAttack()) {
                enemy.triggerAttack();
                this.player.takeDamage();
                this.hud.updateHearts(this.player.hp);
            }

            // Player attacks enemy
            if (this.player.isAttacking) {
                const hit = Geom.Rectangle.Contains(this.player.attackHitbox, enemy.x, enemy.y);
                if (hit) {
                    enemy.takeHit();
                }
            }
        }

        // Soda pickups
        for (const soda of this.sodaBottles) {
            if (soda.active && soda.checkPickup(this.player.x, this.player.y)) {
                this.player.heal(3);
                this.hud.updateHearts(this.player.hp);
                const txt = this.add.text(soda.x, soda.y - 20, '+3 HP', {
                    fontFamily: 'Arial Black', fontSize: 20, color: '#00FF88',
                    stroke: '#000000', strokeThickness: 3
                }).setDepth(200);
                this.tweens.add({ targets: txt, y: txt.y - 40, alpha: 0, duration: 800, onComplete: () => txt.destroy() });
            }
        }
    }
}
