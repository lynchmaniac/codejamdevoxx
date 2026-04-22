import { Scene, GameObjects, Math as PhaserMath } from 'phaser';

export enum EnemyState {
    PATROL = 'patrol',
    CHASE = 'chase',
    RANGED = 'ranged',
    ATTACK = 'attack',
    HURT = 'hurt',
    DEAD = 'dead'
}

export class Enemy {
    scene: Scene;
    sprite: GameObjects.Image;
    hp: number = 2;
    state: EnemyState = EnemyState.PATROL;
    speed: number = 85;
    patrolDir: number = -1;
    attackCooldown: number = 0;
    throwCooldown: number;
    hurtTimer: number = 0;
    onDeath: () => void;
    onThrowShuriken: (ex: number, ey: number, px: number, py: number) => void;
    active: boolean = true;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        onDeath: () => void,
        onThrowShuriken: (ex: number, ey: number, px: number, py: number) => void
    ) {
        this.scene = scene;
        this.onDeath = onDeath;
        this.onThrowShuriken = onThrowShuriken;
        this.throwCooldown = PhaserMath.Between(1000, 3000);
        this.sprite = scene.add.image(x, y, 'enemy').setDepth(9);
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }

    update(delta: number, playerX: number, playerY: number) {
        if (!this.active || this.state === EnemyState.DEAD) return;
        const dt = delta / 1000;
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.attackCooldown = Math.max(0, this.attackCooldown - delta);
        this.throwCooldown = Math.max(0, this.throwCooldown - delta);

        if (this.state === EnemyState.HURT) {
            this.hurtTimer -= delta;
            if (this.hurtTimer <= 0) {
                this.state = EnemyState.CHASE;
                this.sprite.setTexture('enemy');
                this.sprite.setAlpha(1);
            }
            return;
        }

        // Face player
        this.sprite.setFlipX(dx < 0);

        // State transitions
        if (dist < 65) {
            this.state = EnemyState.ATTACK;
        } else if (dist < 420 && this.throwCooldown <= 0) {
            this.state = EnemyState.RANGED;
        } else if (dist < 420) {
            this.state = EnemyState.CHASE;
        } else {
            this.state = EnemyState.PATROL;
        }

        if (this.state === EnemyState.PATROL) {
            this.sprite.x += this.patrolDir * this.speed * 0.4 * dt;
            if (Math.random() < 0.005) this.patrolDir *= -1;
        } else if (this.state === EnemyState.CHASE) {
            if (dist > 65) {
                this.sprite.x += (dx / dist) * this.speed * dt;
                this.sprite.y += (dy / dist) * this.speed * 0.5 * dt;
                this.sprite.y = PhaserMath.Clamp(this.sprite.y, 490, 660);
            }
        } else if (this.state === EnemyState.RANGED) {
            // Throw shuriken and reset cooldown
            this.throwCooldown = PhaserMath.Between(2500, 4000);
            this.onThrowShuriken(this.sprite.x, this.sprite.y - 30, playerX, playerY);
            this.state = EnemyState.CHASE;
        }
    }

    isAdjacentTo(playerX: number, playerY: number): boolean {
        const dx = Math.abs(playerX - this.sprite.x);
        const dy = Math.abs(playerY - this.sprite.y);
        return dx < 65 && dy < 45;
    }

    canAttack(): boolean {
        return this.attackCooldown <= 0 && this.active && this.state !== EnemyState.DEAD && this.state !== EnemyState.HURT;
    }

    triggerAttack() {
        this.attackCooldown = 1600;
    }

    takeHit(): boolean {
        if (!this.active || this.state === EnemyState.DEAD) return false;
        this.hp--;
        if (this.hp <= 0) {
            this.die();
            return true;
        }
        this.state = EnemyState.HURT;
        this.hurtTimer = 450;
        this.sprite.setTexture('enemy-hurt');
        this.sprite.setAlpha(0.8);
        return false;
    }

    instantDeath() {
        if (!this.active || this.state === EnemyState.DEAD) return;
        this.hp = 0;
        this.die();
    }

    die() {
        this.state = EnemyState.DEAD;
        this.active = false;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            y: this.sprite.y + 40,
            scaleX: 0.5,
            duration: 500,
            onComplete: () => {
                this.sprite.destroy();
                this.onDeath();
            }
        });
    }

    destroy() {
        if (this.sprite && this.sprite.active) this.sprite.destroy();
    }
}
