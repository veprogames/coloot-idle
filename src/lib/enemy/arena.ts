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
    isBossActive: boolean = false;

    currentEnemy: Enemy;

    constructor() {
        this.currentEnemy = this.getNewEnemy();
    }

    private getBaseHp(stage: number): Decimal {
        const PHI = 1.618;
        return new Decimal(50)
            .mul(Decimal.pow(PHI, stage * 5));
    }

    generateEnemy(): Enemy {
        const hp = this.getBaseHp(this.currentStage).mul(0.75 + 0.5 * Math.random());
        const tier = Math.min(2, Math.floor(-Math.log2(1 - Math.random())));

        return new Enemy(hp, EnemyType.NORMAL, tier);
    }

    generateBoss(): Enemy {
        const hp = this.getBaseHp(this.currentStage).mul(20);

        return new Enemy(hp, EnemyType.BOSS, 0);
    }

    getNewEnemy(): Enemy {
        if(this.isOnHighestStage && this.isBossActive) {
            return this.generateBoss();
        }
        return this.generateEnemy();
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
            const wasBoss = this.currentEnemy.type === EnemyType.BOSS;
            if(wasBoss && this.isOnHighestStage) {
                this.maxStage++;
                this.gotoMaxStage();
                this.isBossActive = false;
            }
            this.currentEnemy = this.getNewEnemy();

            // automatically activate boss if very strong
            const player = get(game).player;
            if(player.getOverkillForHealth(this.getBaseHp(this.currentStage)).gt(64)) {
                this.activateBoss();
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
            this.currentEnemy = this.getNewEnemy();
        }
    }

    get isOnLowestStage(): boolean {
        return this.currentStage <= 0;
    }

    get isOnHighestStage(): boolean {
        return this.currentStage === this.maxStage;
    }

    /* Stage Navigation */

    gotoStage(stage: number) {
        const actualStage = clamp(stage, 0, this.maxStage);
        this.currentStage = actualStage;
        this.currentEnemy = this.getNewEnemy();
    }

    gotoMaxStage() {
        this.gotoStage(this.maxStage);
    }

    nextStage() {
        this.gotoStage(this.currentStage + 1);
    }

    prevStage() {
        this.gotoStage(this.currentStage - 1);
    }

    activateBoss(){
        if(this.isOnHighestStage) {
            this.isBossActive = true;
            this.currentEnemy = this.getNewEnemy();
        }
    }

    deactivateBoss() {
        this.isBossActive = false;
        this.currentEnemy = this.getNewEnemy();
    }
}