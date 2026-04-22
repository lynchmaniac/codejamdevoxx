import { Scene, GameObjects, Geom, Input, Math as PhaserMath, Time, Types } from 'phaser';

export class Player {
    scene: Scene;
    sprite: GameObjects.Image;
    attackSprite: GameObjects.Image;
    hp: number = 10;
    maxHp: number = 10;
    speed: number = 200;
    isAttacking: boolean = false;
    isInvincible: boolean = false;
    facingRight: boolean = true;
    attackHitbox: Geom.Rectangle;
    attackTimer: Time.TimerEvent | null = null;
    invincibilityTimer: Time.TimerEvent | null = null;
    flashTimer: Time.TimerEvent | null = null;

    cursors: Types.Input.Keyboard.CursorKeys;
    attackKey: Input.Keyboard.Key;
    attackKey2: Input.Keyboard.Key;

    onDeath: () => void;

    constructor(scene: Scene, x: number, y: number, onDeath: () => void) {
        this.scene = scene;
        this.onDeath = onDeath;

        this.sprite = scene.add.image(x, y, 'player').setDepth(10);
        this.attackSprite = scene.add.image(x, y, 'player-attack').setDepth(10).setVisible(false);
        this.attackHitbox = new Geom.Rectangle(x, y, 80, 60);

        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.attackKey = scene.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Z);
        this.attackKey2 = scene.input.keyboard!.addKey(Input.Keyboard.KeyCodes.SPACE);
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }

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

        // Clamp Y to lane (ground area)
        ny = PhaserMath.Clamp(ny, 490, 660);

        this.sprite.x = nx;
        this.sprite.y = ny;
        this.sprite.setFlipX(!this.facingRight);

        this.attackSprite.x = nx;
        this.attackSprite.y = ny;
        this.attackSprite.setFlipX(!this.facingRight);

        // Update hitbox position
        if (this.facingRight) {
            this.attackHitbox.x = nx + 30;
        } else {
            this.attackHitbox.x = nx - 110;
        }
        this.attackHitbox.y = ny - 30;

        // Attack input
        if ((Input.Keyboard.JustDown(this.attackKey) || Input.Keyboard.JustDown(this.attackKey2)) && !this.isAttacking) {
            this.startAttack();
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.sprite.setVisible(false);
        this.attackSprite.setVisible(true);

        this.attackTimer = this.scene.time.delayedCall(200, () => {
            this.isAttacking = false;
            this.sprite.setVisible(true);
            this.attackSprite.setVisible(false);
        });
    }

    takeDamage() {
        if (this.isInvincible) return;
        this.hp = Math.max(0, this.hp - 1);
        this.isInvincible = true;

        // Flash effect
        let visible = true;
        this.flashTimer = this.scene.time.addEvent({
            delay: 100,
            repeat: 9,
            callback: () => {
                visible = !visible;
                this.sprite.setVisible(visible);
                this.attackSprite.setVisible(false);
            }
        });

        this.invincibilityTimer = this.scene.time.delayedCall(1000, () => {
            this.isInvincible = false;
            if (!this.isAttacking) {
                this.sprite.setVisible(true);
            }
            this.attackSprite.setVisible(false);
        });

        if (this.hp <= 0) {
            this.onDeath();
        }
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
