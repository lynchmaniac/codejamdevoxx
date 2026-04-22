import { Scene, GameObjects, Math as PhaserMath } from 'phaser';

export enum EnemyState {
    PATROL = 'patrol',
    CHASE = 'chase',
    ATTACK = 'attack',
    HURT = 'hurt',
    DEAD = 'dead'
}

export class Enemy {
    scene: Scene;
    sprite: GameObjects.Image;
    hp: number = 2;
    state: EnemyState = EnemyState.PATROL;
    speed: number = 80;
    patrolDir: number = -1;
    attackCooldown: number = 0;
    hurtTimer: number = 0;
    onDeath: () => void;
    active: boolean = true;

    constructor(scene: Scene, x: number, y: number, onDeath: () => void) {
        this.scene = scene;
        this.onDeath = onDeath;
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

        if (this.state === EnemyState.HURT) {
            this.hurtTimer -= delta;
            if (this.hurtTimer <= 0) {
                this.state = EnemyState.CHASE;
                this.sprite.setTexture('enemy');
                this.sprite.setAlpha(1);
            }
            return;
        }

        if (dist < 350) {
            this.state = EnemyState.CHASE;
        } else {
            this.state = EnemyState.PATROL;
        }

        if (this.state === EnemyState.PATROL) {
            this.sprite.x += this.patrolDir * this.speed * 0.4 * dt;
            if (Math.random() < 0.005) this.patrolDir *= -1;
        } else if (this.state === EnemyState.CHASE) {
            if (dist > 55) {
                this.sprite.x += (dx / dist) * this.speed * dt;
                this.sprite.y += (dy / dist) * this.speed * 0.5 * dt;
                this.sprite.y = PhaserMath.Clamp(this.sprite.y, 490, 660);
                this.sprite.setFlipX(dx < 0);
            }
        }
    }

    isAdjacentTo(playerX: number, playerY: number): boolean {
        const dx = Math.abs(playerX - this.sprite.x);
        const dy = Math.abs(playerY - this.sprite.y);
        return dx < 55 && dy < 40;
    }

    canAttack(): boolean {
        return this.attackCooldown <= 0 && this.active && this.state !== EnemyState.DEAD && this.state !== EnemyState.HURT;
    }

    triggerAttack() {
        this.attackCooldown = 1500;
    }

    takeHit(): boolean {
        if (!this.active || this.state === EnemyState.DEAD) return false;
        this.hp--;
        if (this.hp <= 0) {
            this.die();
            return true;
        }
        this.state = EnemyState.HURT;
        this.hurtTimer = 400;
        this.sprite.setTexture('enemy-hurt');
        this.sprite.setAlpha(0.7);
        return false;
    }

    die() {
        this.state = EnemyState.DEAD;
        this.active = false;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            y: this.sprite.y + 30,
            duration: 500,
            onComplete: () => {
                this.sprite.destroy();
                this.onDeath();
            }
        });
    }

    destroy() {
        this.sprite.destroy();
    }
}
