import Decimal from "break_infinity.js";
import Artifact, {
    ArtifactEffectType,
    randomArtifact,
} from "../artifact/artifact";
import Equipment, { EquipmentType } from "../equipment/equipment";
import type { SaverLoader } from "../saveload/saveload";
import { getGame } from "../singleton";
import { choose } from "../utils";

export enum EnemyType {
    NORMAL,
    BOSS,
}

export interface EnemyDrop {
    drops: Array<Equipment | Artifact>;
    xp: Decimal;
}

const HP_TO_STAT_EXP = 1 / 2.58;

export default class Enemy implements SaverLoader {
    baseHp: Decimal;
    currentHp: Decimal;
    type: EnemyType;
    tier: number;

    constructor(baseHp: Decimal, type: EnemyType, tier: number = 0) {
        this.type = type;
        this.tier = tier;
        this.baseHp = baseHp;
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
        return this.baseHp.mul(Decimal.pow(2, this.tier));
    }

    get hpPercentage(): number {
        return this.currentHp.div(this.hp).toNumber();
    }

    get dead(): boolean {
        return this.currentHp.lte(0);
    }

    get xp(): Decimal {
        const artifactMult =
            getGame().player.inventory.getArtifactEffects()[
                ArtifactEffectType.PLAYER_XP
            ];

        return this.hp.mul(artifactMult);
    }

    private getEquipmentBaseStat() {
        const player = getGame().player;
        return this.hp
            .div(100)
            .pow(HP_TO_STAT_EXP)
            .div(this.hp.div(1e22).max(1).pow(0.034))
            .div(this.hp.div(1e100).max(1).pow(0.03))
            .mul(player.magicFind)
            .mul(9 + 7 * Math.random());
    }

    generateEquipment(): Equipment {
        const base = this.getEquipmentBaseStat();
        const player = getGame().player;

        const tier = Math.floor(
            -Math.log10(1 - Math.random()) +
                Decimal.log10(player.rarityMultiplier),
        );

        return new Equipment(
            base,
            choose([
                EquipmentType.WEAPON,
                EquipmentType.ARMOR,
                EquipmentType.ACCESSORY,
            ]),
            tier,
        );
    }

    generateArtifact(): Artifact {
        const stage = getGame().arena.currentStage;
        const tier = Math.floor(-Math.log10(1 - Math.random()) + stage / 200);
        return randomArtifact(tier);
    }

    generateDrop(): EnemyDrop {
        if (this.type == EnemyType.BOSS) {
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

    get damage(): number {
        const stageMult = 1 + 2 * (getGame().arena.currentStage / 100);
        const base = this.type == EnemyType.BOSS ? 2 : 1;
        return Math.floor(base * stageMult);
    }

    save() {
        return {
            baseHp: this.baseHp.toString(),
            currentHp: this.currentHp.toString(),
            tier: this.tier,
            type: this.type,
        };
    }

    load(data: any): void {
        this.baseHp = new Decimal(data.baseHp);
        this.currentHp = new Decimal(data.currentHp);
        this.tier = data.tier;
        this.type = data.type;
    }
}
