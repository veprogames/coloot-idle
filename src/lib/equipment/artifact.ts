export enum ArtifactEffectType {
    MAGIC_FIND,
}

export interface ArtifactData {
    id: string,
    effectType: ArtifactEffectType,
    effectAmount: number,
}

export type ArtifactCalculatedEffects = {
    [key in ArtifactEffectType]: number
}

export default class Artifact {
    count: number = 1;
    data: ArtifactData;

    constructor(data: ArtifactData) {
        this.data = data;
    }

    get effect(): number {
        return 1 + this.data.effectAmount * this.count;        
    }

    equals(artifact: Artifact) {
        return this.data.id === artifact.data.id;
    }

    static from(data: ArtifactData): Artifact {
        return new Artifact(data);
    }
}

export const Artifacts: {[key in "test"]: ArtifactData} = {
    "test": {
        id: "test",
        effectType: ArtifactEffectType.MAGIC_FIND,
        effectAmount: 0.5
    }
};

export function calculateEffects(artifacts: Artifact[]){
    let result: ArtifactCalculatedEffects = {
        [ArtifactEffectType.MAGIC_FIND]: 1
    };

    for(const artifact of artifacts) {
        const type = artifact.data.effectType;
        result[type] *= artifact.effect;
    }

    return result;
}