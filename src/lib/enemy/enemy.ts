import Decimal from "break_infinity.js";
import Equipment, { EquipmentType } from "../equipment/equipment";
import { choose } from "../utils";
import { get } from "svelte/store";
import { game } from "../stores";
import Artifact, { Artifacts } from "../equipment/artifact";

export enum EnemyType {
    NORMAL,
    BOSS,
}

export type EnemyDrop = Equipment|Artifact;

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
        return this.type === EnemyType.NORMAL ? 0.5 : 1;
    }

    generateEquipment(): Equipment {
        const player = get(game).player;
        const base = this.hp.add(this.def.mul(100)).pow(1 / 2.3)
            .mul(player.magicFind)
            .mul(1.2);
        const tier = Math.random() < 0.1 ? 1 : 0;
        return new Equipment(base,
            choose([EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.ACCESSORY]),
            tier
        );
    }

    generateArtifact(): Artifact {
        return Artifact.from(Artifacts.test);
    }

    generateDrop(): EnemyDrop {
        if(this.type == EnemyType.BOSS) {
            return this.generateArtifact();
        }
        return this.generateEquipment();
    }

    /**
     * Damage dealt to the player
     * 
     * On Player, max hp and damage reduction together scale in (eqipment.stat ** 0.5), thus this
     * scales by (hp ** 0.5)
     */
    get damage(): Decimal{
        const mult = this.type === EnemyType.BOSS ? 0.4 : 1;
        return this.hp.div(100).pow(0.5).mul(mult).floor();
    }
}