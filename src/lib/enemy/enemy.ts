import Decimal from "break_infinity.js";
import Equipment, { EquipmentType } from "../equipment/equipment";
import { choose } from "../utils";
import { get } from "svelte/store";
import { game } from "../stores";

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
        this.currentHp = this.currentHp.sub(this.getEffectiveDamage(damage));
    }

    getEffectiveDamage(rawDamage: Decimal): Decimal {
        return Decimal.max(0, rawDamage.sub(this.def));
    }

    get hpPercentage(): number {
        return this.currentHp.div(this.hp).toNumber();
    }

    get dead(): boolean {
        return this.currentHp.lte(0);
    }

    get dropChance(): number {
        return 0.5;
    }

    generateDrop(): Equipment {
        const player = get(game).player;
        const base = this.hp.add(this.def.mul(100)).sqrt()
            .mul(player.magicFind);
        return new Equipment(base,
            choose([EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.ACCESSORY]),
            0
        );
    }
}