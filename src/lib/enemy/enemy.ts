import Decimal from "break_infinity.js";
import Equipment, { EquipmentType } from "../equipment/equipment";
import { choose } from "../utils";
import { get } from "svelte/store";
import { game } from "../stores";

export enum EnemyType {
    NORMAL,
    BOSS,
}

export default class Enemy {
    hp: Decimal;
    currentHp: Decimal;
    def: Decimal;
    type: EnemyType;

    constructor(hp: Decimal, def: Decimal, type: EnemyType) {
        this.hp = hp;
        this.def = def;
        this.currentHp = new Decimal(hp);
        this.type = type;
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
        return this.type === EnemyType.NORMAL ? 0.5 : 0;
    }

    generateDrop(): Equipment {
        const player = get(game).player;
        const base = this.hp.add(this.def.mul(100)).pow(1 / 2.3)
            .mul(player.magicFind)
            .mul(1.1);
        const tier = Math.random() < 0.1 ? 1 : 0;
        return new Equipment(base,
            choose([EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.ACCESSORY]),
            tier
        );
    }

    /**
     * Damage dealt to the player
     * 
     * On Player, max hp and damage reduction together scale in (eqipment.stat ** 0.5), thus this
     * scales by (hp ** 0.5)
     */
    get damage(): Decimal{
        return this.hp.div(100).pow(0.5).floor();
    }
}