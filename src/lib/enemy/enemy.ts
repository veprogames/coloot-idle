import Decimal from "break_infinity.js";
import Artifact, { ArtifactEffectType, randomArtifact } from "../artifact/artifact";
import Equipment, { EquipmentType } from "../equipment/equipment";
import type { SaverLoader } from "../saveload/saveload";
import { getGame } from "../singleton";
import { choose } from "../utils";
import { I } from "../images";

export enum EnemyType {
    NORMAL,
    BOSS,
}

export interface EnemyDrop {
    drops: Array<Equipment|Artifact>,
    xp: Decimal,
};

export interface EnemyData {
    name: string,
    hpMultiplier: number,
    image: string,
    type: EnemyType,
}

const HP_TO_STAT_EXP = 1 / 2.58;

export default class Enemy implements SaverLoader {
    baseHp: Decimal;
    currentHp: Decimal;
    data: EnemyData;
    tier: number;

    constructor(baseHp: Decimal, data: EnemyData, tier: number = 0) {
        this.tier = tier;
        this.baseHp = baseHp;
        this.data = data;
        this.currentHp = new Decimal(this.hp);
    }

    /**
     * Deal damage to the enemy
     * 
     * @param damage Amount of Damage
     */
    hit(damage: Decimal) {
        this.currentHp = this.currentHp.sub(damage);
    }

    get hp(): Decimal {
        return this.baseHp.mul(this.data.hpMultiplier).mul(Decimal.pow(2, this.tier));
    }

    get hpPercentage(): number {
        return this.currentHp.div(this.hp).toNumber();
    }

    get dead(): boolean {
        return this.currentHp.lte(0);
    }

    get xp(): Decimal {
        const artifactMult = getGame().player.inventory.getArtifactEffects()[ArtifactEffectType.PLAYER_XP];

        return this.hp.mul(artifactMult);
    }

    get type(): EnemyType {
        return this.data.type;
    }

    private getEquipmentBaseStat() {
        const player = getGame().player;
        return this.hp.div(100).pow(HP_TO_STAT_EXP)
            .div(this.hp.div(1e22).max(1).pow(0.034))
            .div(this.hp.div(1e100).max(1).pow(0.03))
            .mul(player.magicFind)
            .mul(9 + 7 * Math.random());
    }

    generateEquipment(): Equipment {
        const base = this.getEquipmentBaseStat();
        const player = getGame().player;

        const tier = Math.floor(-Math.log10(1 - Math.random()) + Decimal.log10(player.rarityMultiplier));

        return new Equipment(base,
            choose([EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.ACCESSORY]),
            tier
        );
    }

    generateArtifact(): Artifact {
        const stage = getGame().arena.currentStage;
        const tier = Math.floor(-Math.log10(1 - Math.random()) + stage / 200);
        return randomArtifact(tier);
    }

    generateDrop(): EnemyDrop {
        if(this.type == EnemyType.BOSS) {
            return {
                drops: [this.generateEquipment(), this.generateEquipment()],
                xp: this.xp,
            };
        }
        return {
            drops: [this.generateEquipment()],
            xp: this.xp,
        };
    }

    get damage(): number{
        const stageMult = 1 + 2 * (getGame().arena.currentStage / 100);
        const base = this.type == EnemyType.BOSS ? 2 : 1;
        return Math.floor(base * stageMult);
    }

    save() {
        return {
            baseHp: this.baseHp.toString(),
            currentHp: this.currentHp.toString(),
            tier: this.tier,
            data: this.data,
        };
    }

    load(data: any): void {
        this.baseHp = new Decimal(data.baseHp);
        this.currentHp = new Decimal(data.currentHp);
        this.tier = data.tier;
        this.data = data.data ?? EnemyDataNormal.slime;
    }
}

export const EnemyDataNormal: Record<"slime" | "skeleton", EnemyData> = {
    slime: {
        hpMultiplier: 0.8,
        name: "Slime",
        image: I.enemy.slime,
        type: EnemyType.NORMAL,
    },
    skeleton: {
        hpMultiplier: 1.2,
        name: "Skeleton",
        image: I.enemy.skeleton,
        type: EnemyType.NORMAL,
    },
}

export const EnemyDataBoss: Record<"skull", EnemyData> = {
    skull: {
        hpMultiplier: 20,
        name: "Skull",
        image: I.enemy.skull,
        type: EnemyType.BOSS,
    },
}