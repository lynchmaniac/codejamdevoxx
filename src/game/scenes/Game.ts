import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Math as PhaserMath, Geom } from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { SodaBottle } from '../objects/SodaBottle';
import { Shuriken } from '../objects/Shuriken';
import { HUD } from '../objects/HUD';


const brightenColor = (color: number, amount: number): number => {
    const r = Math.min(255, ((color >> 16) & 0xFF) + amount);
    const g = Math.min(255, ((color >> 8) & 0xFF) + amount);
    const b = Math.min(255, (color & 0xFF) + amount);
    return (r << 16) | (g << 8) | b;
};

const WORLD_WIDTH = 3840;
const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
const GROUND_Y = 560;

interface LevelConfig {
    skyColor: number;
    groundColor: number;
    buildingColors: number[];
    waveX: number[];
    name: string;
}

const LEVELS: LevelConfig[] = [
    {
        name: 'MIDTOWN',
        skyColor: 0x7ABFDD,
        groundColor: 0x888888,
        buildingColors: [0x334455, 0x445566, 0x223344, 0x3A4D60],
        waveX: [700, 1700, 2700],
    },
    {
        name: 'BROOKLYN',
        skyColor: 0xCC8050,
        groundColor: 0x776655,
        buildingColors: [0x553322, 0x664433, 0x442211, 0x5A3820],
        waveX: [700, 1700, 2700],
    },
    {
        name: 'NIGHT CITY',
        skyColor: 0x0A0A1E,
        groundColor: 0x333333,
        buildingColors: [0x1A2A3A, 0x0D1F3C, 0x223344, 0x111A28],
        waveX: [700, 1700, 2700],
    },
];

const WAVES = [[3, 3, 4], [3, 3, 4], [3, 3, 4]];

export class Game extends Scene {
    player!: Player;
    enemies: Enemy[] = [];
    shurikens: Shuriken[] = [];
    sodaBottles: SodaBottle[] = [];
    hud!: HUD;

    currentLevel: number = 1;
    enemiesDefeated: number = 0;
    totalEnemies: number = 10;
    waveTriggered: boolean[] = [false, false, false];
    levelEnding: boolean = false;

    constructor() { super('Game'); }

    init(data: { level?: number }) {
        this.currentLevel = data?.level ?? 1;
        this.enemiesDefeated = 0;
        this.waveTriggered = [false, false, false];
        this.enemies = [];
        this.shurikens = [];
        this.sodaBottles = [];
        this.levelEnding = false;
    }

    create() {
        const cfg = LEVELS[this.currentLevel - 1];

        this.cameras.main.setBackgroundColor(cfg.skyColor);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, SCREEN_HEIGHT);

        this.buildBackground(cfg);

        this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y + 90, WORLD_WIDTH, 200, cfg.groundColor).setDepth(1);
        this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, 4, 0x999999).setDepth(2);
        for (let x = 60; x < WORLD_WIDTH; x += 60) {
            this.add.rectangle(x, GROUND_Y + 50, 2, 100, 0x777777).setDepth(2).setAlpha(0.25);
        }

        this.sodaBottles.push(new SodaBottle(this, WORLD_WIDTH * 0.33, GROUND_Y - 35));
        this.sodaBottles.push(new SodaBottle(this, WORLD_WIDTH * 0.66, GROUND_Y - 35));

        this.player = new Player(
            this, 160, GROUND_Y - 25,
            () => this.handlePlayerDeath(),
            () => this.triggerFatalAttack()
        );

        this.cameras.main.startFollow(this.player.sprite, true, 0.07, 0);

        this.spawnWave(0);

        this.hud = new HUD(this);
        this.hud.updateLevel(this.currentLevel);
        this.hud.updateEnemies(this.totalEnemies);
        this.hud.updateFury(1);

        EventBus.emit('current-scene-ready', this);
    }

    buildBackground(cfg: LevelConfig) {
        const templates = [
            { w: 130, h: 320 }, { w: 95, h: 240 }, { w: 165, h: 400 },
            { w: 110, h: 280 }, { w: 140, h: 360 }, { w: 85, h: 210 },
            { w: 120, h: 300 }, { w: 155, h: 380 }, { w: 100, h: 260 },
        ];
        const isNight = cfg.skyColor === 0x0A0A1E;

        let bx = 0, idx = 0;
        while (bx < WORLD_WIDTH + 200) {
            const tmpl = templates[idx % templates.length];
            const color = cfg.buildingColors[idx % cfg.buildingColors.length];

            this.add.rectangle(bx + tmpl.w / 2, GROUND_Y - tmpl.h / 2, tmpl.w, tmpl.h, color).setDepth(0);
            this.add.rectangle(bx + tmpl.w / 2, GROUND_Y - tmpl.h - 4, tmpl.w + 6, 10,
                brightenColor(color, 40)).setDepth(0);

            for (let wx = bx + 12; wx < bx + tmpl.w - 12; wx += 22) {
                for (let wy = GROUND_Y - tmpl.h + 18; wy < GROUND_Y - 18; wy += 28) {
                    const lit = isNight ? Math.random() > 0.3 : Math.random() > 0.65;
                    const winColor = lit
                        ? (isNight ? 0xFFEE88 : 0xBBDDFF)
                        : (isNight ? 0x111122 : 0x445566);
                    this.add.rectangle(wx, wy, 14, 16, winColor).setDepth(0).setAlpha(isNight ? 0.95 : 0.85);
                }
            }

            bx += tmpl.w + PhaserMath.Between(4, 18);
            idx++;
        }
    }

    spawnWave(waveIdx: number) {
        const levelIdx = this.currentLevel - 1;
        const count = WAVES[levelIdx][waveIdx];
        const waveX = LEVELS[levelIdx].waveX[waveIdx];
        const spread = 350;

        for (let i = 0; i < count; i++) {
            const ex = waveX + PhaserMath.Between(-spread / 2, spread / 2);
            const ey = GROUND_Y - PhaserMath.Between(0, 50);
            this.enemies.push(new Enemy(
                this, ex, ey,
                () => this.handleEnemyDeath(),
                (ex2, ey2, px, py) => this.spawnShuriken(ex2, ey2, px, py)
            ));
        }
    }

    spawnShuriken(fromX: number, fromY: number, toX: number, toY: number) {
        this.shurikens.push(new Shuriken(this, fromX, fromY, toX, toY));
    }

    triggerFatalAttack() {
        const camLeft = this.cameras.main.scrollX;
        const camRight = camLeft + SCREEN_WIDTH;

        for (const enemy of this.enemies) {
            if (enemy.active && enemy.x >= camLeft - 100 && enemy.x <= camRight + 100) {
                enemy.instantDeath();
            }
        }

        this.cameras.main.shake(400, 0.015);
        this.cameras.main.flash(300, 255, 50, 50, false);

        const fx = SCREEN_WIDTH / 2;
        const fy = SCREEN_HEIGHT / 2 - 60;
        const text = this.add.text(fx, fy, 'STREET FURY!', {
            fontFamily: 'Arial Black', fontSize: 58, color: '#FFD700',
            stroke: '#FF0000', strokeThickness: 10, align: 'center'
        }).setOrigin(0.5).setDepth(500).setScrollFactor(0);

        this.tweens.add({
            targets: text,
            scaleX: 1.3, scaleY: 1.3,
            duration: 200, yoyo: true, repeat: 1,
            onComplete: () => {
                this.tweens.add({
                    targets: text, alpha: 0, duration: 600,
                    onComplete: () => text.destroy()
                });
            }
        });

        for (const s of this.shurikens) {
            if (s.active) s.deactivate();
        }
    }

    handleEnemyDeath() {
        this.enemiesDefeated++;
        const remaining = this.totalEnemies - this.enemiesDefeated;
        this.hud.updateEnemies(Math.max(0, remaining));

        if (this.enemiesDefeated >= this.totalEnemies && !this.levelEnding) {
            this.levelEnding = true;
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

        const cfg = LEVELS[this.currentLevel - 1];
        const nextMsg = this.currentLevel >= 3 ? 'YOU WIN!' : cfg.name + ' CLEAR!';
        const text = this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, nextMsg, {
            fontFamily: 'Arial Black', fontSize: 60, color: '#FFD700',
            stroke: '#000000', strokeThickness: 10
        }).setOrigin(0.5).setDepth(200).setScrollFactor(0);

        this.tweens.add({ targets: text, scaleX: 1.2, scaleY: 1.2, duration: 300, yoyo: true, repeat: 2 });

        this.time.delayedCall(2500, () => {
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
        this.shurikens.forEach(s => s.destroy());
        this.sodaBottles.forEach(s => { if (s.active) s.destroy(); });
        this.hud.destroy();
    }

    update(_time: number, delta: number) {
        if (!this.player || this.levelEnding) return;

        this.player.update(delta);

        this.player.sprite.x = PhaserMath.Clamp(this.player.sprite.x, 30, WORLD_WIDTH - 30);

        this.hud.updateFury(this.player.fatalCooldownRatio);

        const camX = this.cameras.main.scrollX;
        for (let wi = 1; wi < 3; wi++) {
            if (!this.waveTriggered[wi] && camX + SCREEN_WIDTH > LEVELS[this.currentLevel - 1].waveX[wi] - 500) {
                this.waveTriggered[wi] = true;
                this.spawnWave(wi);
            }
        }

        const activeEnemies = this.enemies.filter(e => e.active);
        for (const enemy of activeEnemies) {
            enemy.update(delta, this.player.x, this.player.y);

            if (enemy.isAdjacentTo(this.player.x, this.player.y) && enemy.canAttack()) {
                enemy.triggerAttack();
                this.player.takeDamage();
                this.hud.updateHearts(this.player.hp);
            }

            if (this.player.isAttacking) {
                const hit = Geom.Rectangle.Contains(this.player.attackHitbox, enemy.x, enemy.y);
                if (hit) enemy.takeHit();
            }
        }

        const activeShurikens = this.shurikens.filter(s => s.active);
        for (const shuriken of activeShurikens) {
            shuriken.update(delta, WORLD_WIDTH);
            if (shuriken.checkHit(this.player.x, this.player.y)) {
                this.player.takeDamage();
                this.hud.updateHearts(this.player.hp);
                this.cameras.main.flash(80, 200, 0, 0, false);
            }
        }

        for (const soda of this.sodaBottles) {
            if (soda.active && soda.checkPickup(this.player.x, this.player.y)) {
                this.player.heal(3);
                this.hud.updateHearts(this.player.hp);
                const txt = this.add.text(soda.x, soda.y - 20, '+3 HP', {
                    fontFamily: 'Arial Black', fontSize: 22, color: '#00FF88',
                    stroke: '#000000', strokeThickness: 4
                }).setDepth(200);
                this.tweens.add({ targets: txt, y: txt.y - 50, alpha: 0, duration: 900, onComplete: () => txt.destroy() });
            }
        }
    }
}
