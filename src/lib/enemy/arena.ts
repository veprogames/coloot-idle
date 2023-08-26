import Decimal from "break_infinity.js";
import Enemy, { EnemyType } from "./enemy";
import type Equipment from "../equipment/equipment";
import { clamp } from "../utils";
import type Player from "../player/player";

export default class Arena {
    currentStage: number = 0;
    maxStage: number = 0;
    killsOnHighestStage: number = 0;

    currentEnemy: Enemy;

    constructor() {
        this.currentEnemy = this.getNewEnemy();
    }

    generateEnemy(): Enemy {
        const PHI = 1.618;
        const hp = new Decimal(0.75 + 0.5 * Math.random())
            .mul(100)
            .mul(Decimal.pow(PHI, this.currentStage));
        const def = hp.mul(0.01 + 0.01 * Math.random()).floor();

        return new Enemy(hp, def, EnemyType.NORMAL);
    }

    generateBoss(): Enemy {
        const PHI = 1.618;
        const hp = new Decimal(1)
            .mul(1000)
            .mul(Decimal.pow(PHI, this.currentStage));
        const def = hp.mul(0.005).floor();

        return new Enemy(hp, def, EnemyType.BOSS);
    }

    getNewEnemy(): Enemy {
        if(this.isOnHighestStage && this.isBossStage) {
            return this.generateBoss();
        }
        return this.generateEnemy();
    }

    private increaseKillCounter(){
        this.killsOnHighestStage++;
        if(this.killsOnHighestStage >= this.requiredKills){
            this.maxStage++;
            this.killsOnHighestStage = 0;
        }
    }

    /**
     * Hit the Enemy in this Arena.
     * 
     * @param damage Amount to damage to deal
     * @returns A piece of Equipment if it was dropped, null otherwise
     */
    hitEnemy(damage: Decimal): Equipment|null {
        this.currentEnemy.hit(damage);
        if(this.currentEnemy.dead) {
            const drop = Math.random() < this.currentEnemy.dropChance ?
                this.currentEnemy.generateDrop() :
                null;
            this.currentEnemy = this.getNewEnemy();
            if(this.isOnHighestStage) {
                this.increaseKillCounter();
            }
            return drop;
        }
        return null;
    }

    hitPlayer(player: Player): void {
        player.hit(this.currentEnemy.damage);
        // When the player dies, kills are being reset
        if(player.dead) {
            player.revive();
            this.killsOnHighestStage = 0;
            this.currentEnemy = this.getNewEnemy();
        }
    }

    get isOnHighestStage(): boolean {
        return this.currentStage === this.maxStage;
    }

    get isBossStage(): boolean {
        return this.currentStage % 5 === 0 && this.currentStage > 0;
    }

    get requiredKills(): number {
        return this.isBossStage ? 1 : 10;
    }

    /* Stage Navigation */

    gotoStage(stage: number) {
        const actualStage = clamp(stage, 0, this.maxStage);
        this.currentStage = actualStage;
        this.currentEnemy = this.getNewEnemy();
    }

    nextStage() {
        this.gotoStage(this.currentStage + 1);
    }

    prevStage() {
        this.gotoStage(this.currentStage - 1);
    }
}