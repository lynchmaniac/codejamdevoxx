import { Scene, GameObjects, Geom, Input, Math as PhaserMath, Time, Types } from 'phaser';

const FATAL_COOLDOWN_MS = 8000;

export class Player {
    scene: Scene;
    sprite: GameObjects.Image;
    attackSprite: GameObjects.Image;
    hp: number = 10;
    maxHp: number = 10;
    speed: number = 220;
    isAttacking: boolean = false;
    isInvincible: boolean = false;
    facingRight: boolean = true;
    attackHitbox: Geom.Rectangle;
    attackTimer: Time.TimerEvent | null = null;
    invincibilityTimer: Time.TimerEvent | null = null;
    flashTimer: Time.TimerEvent | null = null;

    // Fatal attack
    fatalCooldown: number = 0; // ms remaining
    isFatalActive: boolean = false;
    onFatalAttack: () => void;

    cursors: Types.Input.Keyboard.CursorKeys;
    attackKey: Input.Keyboard.Key;
    attackKey2: Input.Keyboard.Key;
    fatalKey: Input.Keyboard.Key;

    onDeath: () => void;

    constructor(scene: Scene, x: number, y: number, onDeath: () => void, onFatalAttack: () => void) {
        this.scene = scene;
        this.onDeath = onDeath;
        this.onFatalAttack = onFatalAttack;

        this.sprite = scene.add.image(x, y, 'player').setDepth(10);
        this.attackSprite = scene.add.image(x, y, 'player-attack').setDepth(10).setVisible(false);
        this.attackHitbox = new Geom.Rectangle(x, y, 100, 80);

        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.attackKey = scene.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Z);
        this.attackKey2 = scene.input.keyboard!.addKey(Input.Keyboard.KeyCodes.SPACE);
        this.fatalKey = scene.input.keyboard!.addKey(Input.Keyboard.KeyCodes.X);
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }

    /** Ratio 0–1: 1 = ready, 0 = just used */
    get fatalCooldownRatio(): number {
        return 1 - PhaserMath.Clamp(this.fatalCooldown / FATAL_COOLDOWN_MS, 0, 1);
    }

    update(delta: number) {
        const speed = this.speed;
        let vx = 0, vy = 0;

        if (this.cursors.left.isDown) { vx = -speed; this.facingRight = false; }
        else if (this.cursors.right.isDown) { vx = speed; this.facingRight = true; }
        if (this.cursors.up.isDown) vy = -speed * 0.6;
        else if (this.cursors.down.isDown) vy = speed * 0.6;

        const dt = delta / 1000;
        const nx = this.sprite.x + vx * dt;
        let ny = this.sprite.y + vy * dt;

        ny = PhaserMath.Clamp(ny, 490, 660);

        this.sprite.x = nx;
        this.sprite.y = ny;
        this.sprite.setFlipX(!this.facingRight);

        this.attackSprite.x = nx;
        this.attackSprite.y = ny;
        this.attackSprite.setFlipX(!this.facingRight);

        if (this.facingRight) {
            this.attackHitbox.x = nx + 20;
        } else {
            this.attackHitbox.x = nx - 120;
        }
        this.attackHitbox.y = ny - 40;

        // Normal attack
        if ((Input.Keyboard.JustDown(this.attackKey) || Input.Keyboard.JustDown(this.attackKey2)) && !this.isAttacking && !this.isFatalActive) {
            this.startAttack();
        }

        // Fatal attack
        this.fatalCooldown = Math.max(0, this.fatalCooldown - delta);
        if (Input.Keyboard.JustDown(this.fatalKey) && this.fatalCooldown <= 0 && !this.isFatalActive) {
            this.startFatalAttack();
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.sprite.setVisible(false);
        this.attackSprite.setVisible(true);

        this.attackTimer = this.scene.time.delayedCall(220, () => {
            this.isAttacking = false;
            this.sprite.setVisible(true);
            this.attackSprite.setVisible(false);
        });
    }

    startFatalAttack() {
        this.isFatalActive = true;
        this.fatalCooldown = FATAL_COOLDOWN_MS;

        // Visual: scale pulse on player
        this.scene.tweens.add({
            targets: [this.sprite, this.attackSprite],
            scaleX: 1.4, scaleY: 1.4,
            duration: 150, yoyo: true, repeat: 2,
            onComplete: () => {
                this.sprite.setScale(1);
                this.attackSprite.setScale(1);
            }
        });

        // Notify game to kill enemies + do effects
        this.onFatalAttack();

        this.scene.time.delayedCall(400, () => {
            this.isFatalActive = false;
        });
    }

    takeDamage() {
        if (this.isInvincible || this.isFatalActive) return;
        this.hp = Math.max(0, this.hp - 1);
        this.isInvincible = true;

        let visible = true;
        this.flashTimer = this.scene.time.addEvent({
            delay: 100, repeat: 9,
            callback: () => {
                visible = !visible;
                this.sprite.setVisible(visible);
                this.attackSprite.setVisible(false);
            }
        });

        this.invincibilityTimer = this.scene.time.delayedCall(1000, () => {
            this.isInvincible = false;
            if (!this.isAttacking) this.sprite.setVisible(true);
            this.attackSprite.setVisible(false);
        });

        if (this.hp <= 0) this.onDeath();
    }

    heal(amount: number) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    destroy() {
        this.sprite.destroy();
        this.attackSprite.destroy();
        this.attackTimer?.remove();
        this.invincibilityTimer?.remove();
        this.flashTimer?.remove();
    }
}
