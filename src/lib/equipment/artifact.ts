import type { DecimalSource } from "break_infinity.js";
import { F, choose, getTierColor } from "../utils";
import Decimal from "break_infinity.js";

export enum ArtifactEffectType {
    DAMAGE,
    MAGIC_FIND,
    MAX_HEALTH,
    REQUIRED_KILLS,
    EQUIPMENT_RARITY,
}

export enum ArtifactEffectOperation {
    ADDITIVE,
    MULTIPLICATIVE,
}

export interface ArtifactData {
    id: string,
    title: string,
    effectType: ArtifactEffectType,
    effectAmount: DecimalSource,
    effectOperation: ArtifactEffectOperation,
}

export type ArtifactCalculatedEffects = {
    [key in ArtifactEffectType]: Decimal
}

export default class Artifact {
    count: number = 1;
    tier: number;
    data: ArtifactData;

    constructor(data: ArtifactData, tier: number) {
        this.data = data;
        this.tier = tier;
    }

    private get effectTypeName(): string {
        switch (this.data.effectType) {
            case ArtifactEffectType.MAGIC_FIND:
                return "Magic Find";
            case ArtifactEffectType.DAMAGE:
                return "Damage";
            case ArtifactEffectType.EQUIPMENT_RARITY:
                return "Equipment Rarity";
            case ArtifactEffectType.MAX_HEALTH:
                return "Max Health";
            case ArtifactEffectType.REQUIRED_KILLS:
                return "Required Kills per Stage";
            default:
                return "Unknown Effect";
        }
    }

    get description() {
        const amount = this.effectEach;
        const direction = amount.lt(0) ? "Decreases" : "Increases";
        const increment = this.data.effectOperation === ArtifactEffectOperation.ADDITIVE ?
            `${F(amount.abs(), true)}` :
            `${F(amount.abs().mul(100))} %`;
        return `${direction} ${this.effectTypeName} by ${increment} per stack.`;
    }

    private get effectEach(): Decimal {
        return this.data.effectOperation === ArtifactEffectOperation.ADDITIVE ?
            new Decimal(this.data.effectAmount).mul(1 + this.tier) :
            new Decimal(this.data.effectAmount);
    }

    get effect(): Decimal {
        const base = this.data.effectOperation === ArtifactEffectOperation.MULTIPLICATIVE ? 1 : 0;
        return new Decimal(base).add(this.effectEach.mul(this.count));        
    }

    get effectString(): string {
        if(this.data.effectOperation === ArtifactEffectOperation.MULTIPLICATIVE) {
            return `x${F(this.effect, true)}`;
        }
        const sign = this.effect.gt(0) ? "+" : ""; // minus sign is already there
        return `${sign}${F(this.effect, true)}`;
    }

    get color(): string {
        return getTierColor(this.tier);
    }

    equals(artifact: Artifact) {
        return this.data.id === artifact.data.id && this.tier === artifact.tier;
    }

    static from(data: ArtifactData, tier: number): Artifact {
        return new Artifact(data, tier);
    }
}

export const Artifacts: {[key: string]: ArtifactData} = {
    "potion": {
        id: "potion",
        title: "Potion",
        effectType: ArtifactEffectType.MAX_HEALTH,
        effectAmount: 1,
        effectOperation: ArtifactEffectOperation.ADDITIVE,
    },
    "ironfist": {
        id: "ironfist",
        title: "Iron Fist",
        effectType: ArtifactEffectType.DAMAGE,
        effectAmount: 0.7,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
    },
    "shinydiamond": {
        id: "shinydiamond",
        title: "Shiny Diamond",
        effectType: ArtifactEffectType.MAGIC_FIND,
        effectAmount: 0.25,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
    },
    "compass": {
        id: "compass",
        title: "Compass",
        effectType: ArtifactEffectType.REQUIRED_KILLS,
        effectAmount: -1,
        effectOperation: ArtifactEffectOperation.ADDITIVE
    },
    "shovel": {
        id: "shovel",
        title: "Shovel",
        effectType: ArtifactEffectType.EQUIPMENT_RARITY,
        effectAmount: 1,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
    },
};

export function calculateArtifactEffects(artifacts: Artifact[]){
    let result: ArtifactCalculatedEffects = {
        [ArtifactEffectType.MAGIC_FIND]: new Decimal(1),
        [ArtifactEffectType.DAMAGE]: new Decimal(1),
        [ArtifactEffectType.EQUIPMENT_RARITY]: new Decimal(1),
        [ArtifactEffectType.MAX_HEALTH]: new Decimal(0),
        [ArtifactEffectType.REQUIRED_KILLS]: new Decimal(0),
    };

    const sorted = [...artifacts].sort((a1: Artifact, a2: Artifact) => {
        if(a1.data.effectOperation === ArtifactEffectOperation.ADDITIVE) return -1;
        return 1;
    });

    for(const artifact of sorted) {
        const type = artifact.data.effectType;
        if(artifact.data.effectOperation === ArtifactEffectOperation.MULTIPLICATIVE) {
            result[type] = result[type].mul(artifact.effect);
        }
        else {
            result[type] = result[type].add(artifact.effect);
        }
    }

    return result;
}

export function randomArtifact(tier: number): Artifact {
    return Artifact.from(choose(Object.values(Artifacts)), tier);
}