import type { DecimalSource } from "break_infinity.js";
import { F, getTierColor } from "../utils";
import Decimal from "break_infinity.js";

export enum ArtifactEffectType {
    MAGIC_FIND,
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
            default:
                return "Unknown Effect";
        }
    }

    get description() {
        const amount = new Decimal(this.data.effectAmount)
        return `Increases ${this.effectTypeName} by ${F(amount.mul(100))} % per stack.`;
    }

    get effect(): Decimal {
        const base = this.data.effectOperation === ArtifactEffectOperation.MULTIPLICATIVE ? 1 : 0;
        return new Decimal(base).add(this.data.effectAmount).mul(this.count);        
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

export const Artifacts: {[key in "test"]: ArtifactData} = {
    "test": {
        id: "test",
        title: "Test Artifact",
        effectType: ArtifactEffectType.MAGIC_FIND,
        effectAmount: 0.5,
        effectOperation: ArtifactEffectOperation.ADDITIVE
    }
};

export function calculateEffects(artifacts: Artifact[]){
    let result: ArtifactCalculatedEffects = {
        [ArtifactEffectType.MAGIC_FIND]: new Decimal(1)
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