import Decimal from "break_infinity.js";
import Equipment, { EquipmentType } from "../equipment/equipment";
import { choose } from "../utils";
import { get } from "svelte/store";
import { game } from "../stores";
import Artifact, { ArtifactEffectType, Artifacts, calculateArtifactEffects, randomArtifact } from "../equipment/artifact";

export enum EnemyType {
    NORMAL,
    BOSS,
}

export type EnemyDrop = Equipment|Artifact;

const HP_TO_STAT_EXP = 1 / 2.6;

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

    private getEquipmentBaseStat() {
        const player = get(game).player;
        return this.hp.div(100).pow(HP_TO_STAT_EXP)
            .div(this.hp.div(1e18).max(1).pow(0.04)) // kicks in around stage 70
            .mul(player.magicFind)
            .mul(8 + 8 * Math.random());
    }

    generateEquipment(): Equipment {
        const base = this.getEquipmentBaseStat();
        const inventory = get(game).player.inventory;
        const artifactMult = inventory.getArtifactEffects()[ArtifactEffectType.EQUIPMENT_RARITY];
        const tier = Math.floor(-Math.log10(1 - Math.random()) + Decimal.log10(artifactMult));
        return new Equipment(base,
            choose([EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.ACCESSORY]),
            tier
        );
    }

    generateArtifact(): Artifact {
        const stage = get(game).arena.currentStage;
        const tier = Math.floor(-Math.log10(1 - Math.random()) + stage / 200);
        return randomArtifact(tier);
    }

    generateDrop(): EnemyDrop {
        if(this.type == EnemyType.BOSS) {
            return this.generateArtifact();
        }
        return this.generateEquipment();
    }

    get damage(): number{
        const stageMult = 1 + 2 * (get(game).arena.currentStage / 200) ** 2;
        const base = this.type == EnemyType.BOSS ? 2 : 1;
        return Math.floor(base * stageMult);
    }
}