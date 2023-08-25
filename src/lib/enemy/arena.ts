import Decimal from "break_infinity.js";
import Enemy from "./enemy";
import type Equipment from "../equipment/equipment";

export default class Arena {
    currentStage: number = 0;
    maxStage: number = 0;

    currentEnemy: Enemy;

    constructor() {
        this.currentEnemy = new Enemy(new Decimal(100), new Decimal(0));
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
            this.currentEnemy = new Enemy(new Decimal(100), new Decimal(0));
            return drop;
        }
        return null;
    }
}