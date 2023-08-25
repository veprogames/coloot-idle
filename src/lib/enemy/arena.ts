import Decimal from "break_infinity.js";
import Enemy from "./enemy";
import type Equipment from "../equipment/equipment";

export default class Arena {
    currentStage: number = 0;
    maxStage: number = 0;

    currentEnemy: Enemy;

    constructor() {
        this.currentEnemy = this.generateEnemy();
    }

    generateEnemy(): Enemy {
        const PHI = 1.618;
        const hp = new Decimal(0.75 + 0.5 * Math.random())
            .mul(100)
            .mul(Decimal.pow(PHI, this.currentStage));
        const def = hp.mul(0.01 + 0.01 * Math.random()).floor();

        return new Enemy(hp, def);
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
            this.currentEnemy = this.generateEnemy();
            return drop;
        }
        return null;
    }
}