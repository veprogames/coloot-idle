import Decimal from "break_infinity.js";
import Equipment, { EquipmentType } from "../equipment/equipment";
import { choose } from "../utils";

export default class Enemy {
    hp: Decimal;
    currentHp: Decimal;
    def: Decimal;

    constructor(hp: Decimal, def: Decimal) {
        this.hp = hp;
        this.def = def;
        this.currentHp = new Decimal(hp);
    }

    /**
     * Deal damage to the enemy
     * 
     * @param damage Amount of Damage
     */
    hit(damage: Decimal) {
        this.currentHp = this.currentHp.sub(damage);
    }

    get dead(): boolean {
        return this.currentHp.lte(0);
    }

    get dropChance(): number {
        return 0.5;
    }

    generateDrop(): Equipment {
        return new Equipment(10 + Math.random() * 10,
            choose([EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.ACCESSORY]),
            0
        );
    }
}