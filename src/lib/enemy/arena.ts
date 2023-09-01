import Decimal from "break_infinity.js";
import Enemy, { EnemyType, type EnemyDrop } from "./enemy";
import type Equipment from "../equipment/equipment";
import { clamp } from "../utils";
import type Player from "../player/player";
import { get } from "svelte/store";
import { game } from "../stores";
import { ArtifactEffectType } from "../equipment/artifact";

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
    hitEnemy(damage: Decimal): EnemyDrop|null {
        this.currentEnemy.hit(damage);
        if(this.currentEnemy.dead) {
            const drop = Math.random() < this.currentEnemy.dropChance ?
                this.currentEnemy.generateDrop() :
                null;
            if(this.isOnHighestStage) {
                this.increaseKillCounter();
            }
            this.currentEnemy = this.getNewEnemy();
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

    get isOnLowestStage(): boolean {
        return this.currentStage <= 0;
    }

    get isOnHighestStage(): boolean {
        return this.currentStage === this.maxStage;
    }

    get isBossStage(): boolean {
        return this.currentStage % 5 === 4 && this.currentStage > 0;
    }

    get requiredKills(): number {
        const stageEffect = Math.floor(15 * (this.currentStage / 200) ** 2);
        const artifactEffect = get(game).player.inventory.getArtifactEffects()[ArtifactEffectType.REQUIRED_KILLS];

        return this.isBossStage ? 1 : Math.max(1, 10 + stageEffect + artifactEffect.toNumber());
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