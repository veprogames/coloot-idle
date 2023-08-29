import { F } from "../utils";

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
    effectAmount: number,
    effectOperation: ArtifactEffectOperation,
}

export type ArtifactCalculatedEffects = {
    [key in ArtifactEffectType]: number
}

export default class Artifact {
    count: number = 1;
    tier: number;
    data: ArtifactData;

    constructor(data: ArtifactData, tier: number) {
        this.data = data;
        this.tier = tier;
    }

    get description() {
        const type = "Magic Find"; // TODO
        
        return `Increases ${type} by ${F(this.data.effectAmount * 100)} % per stack.`;
    }

    get effect(): number {
        const base = this.data.effectOperation === ArtifactEffectOperation.MULTIPLICATIVE ? 1 : 0;
        return base + this.data.effectAmount * this.count;        
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
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE
    }
};

export function calculateEffects(artifacts: Artifact[]){
    let result: ArtifactCalculatedEffects = {
        [ArtifactEffectType.MAGIC_FIND]: 1
    };

    const sorted = artifacts.sort((a1: Artifact, a2: Artifact) => {
        if(a1.data.effectOperation === ArtifactEffectOperation.ADDITIVE) return -1;
        return 1;
    });

    for(const artifact of sorted) {
        const type = artifact.data.effectType;
        if(artifact.data.effectOperation === ArtifactEffectOperation.MULTIPLICATIVE) {
            result[type] *= artifact.effect;
        }
        else {
            result[type] += artifact.effect;
        }
    }

    return result;
}