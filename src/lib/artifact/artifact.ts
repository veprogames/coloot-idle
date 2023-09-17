import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";
import type GameClass from "../game/gameclass";
import { I } from "../images";
import type { SaverLoader } from "../saveload/saveload";
import { getGame } from "../singleton";
import { F, choose, getTierColor } from "../utils";

export enum ArtifactEffectType {
    DAMAGE,
    MAGIC_FIND,
    MAX_HEALTH,
    EQUIPMENT_RARITY,
    PLAYER_XP,
}

export enum ArtifactEffectOperation {
    ADDITIVE,
    MULTIPLICATIVE,
}

export interface ArtifactData {
    id: string,
    title: string,
    hint?: string,
    effectType: ArtifactEffectType,
    effectAmount: DecimalSource,
    effectOperation: ArtifactEffectOperation,
    getAdditionalEffectMultiplier?: (game: GameClass, count: number, tier: number) => Decimal,
    image: string,
    // base gem price
    basePrice: number,
}

export type ArtifactCalculatedEffects = {
    [key in ArtifactEffectType]: Decimal
}

export default class Artifact implements SaverLoader {
    count: number = 1;
    tier: number;
    data: ArtifactData;
    gameInstance: GameClass|undefined;

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
            case ArtifactEffectType.PLAYER_XP:
                return "Player XP Gain";
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
        const base = new Decimal(this.data.effectAmount);
        const additionalMult = this.data.getAdditionalEffectMultiplier?.(getGame(), this.count, this.tier) ?? new Decimal(1);

        return base.mul(additionalMult);
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

    save() {
        return {
            id: this.data.id,
            count: this.count,
            tier: this.tier,
        }
    }

    load(data: any): void {
        this.count = data.count;
        this.tier = data.tier;
        this.data = Artifacts[data.id];
    }
}

export const Artifacts: {[key: string]: ArtifactData} = {
    "potion": {
        id: "potion",
        title: "Potion",
        effectType: ArtifactEffectType.MAX_HEALTH,
        effectAmount: 2,
        effectOperation: ArtifactEffectOperation.ADDITIVE,
        image: I.artifacts.potion,
        basePrice: 1,
        getAdditionalEffectMultiplier(game, count, tier) {
            return new Decimal(1 + 2 * tier);
        },
    },
    "ironfist": {
        id: "ironfist",
        title: "Iron Fist",
        effectType: ArtifactEffectType.DAMAGE,
        effectAmount: 0.7,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
        image: I.artifacts.ironFist,
        basePrice: 1,
    },
    "shinydiamond": {
        id: "shinydiamond",
        title: "Shiny Diamond",
        effectType: ArtifactEffectType.MAGIC_FIND,
        effectAmount: 0.25,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
        image: I.artifacts.shinyDiamond,
        basePrice: 1,
    },
    "shovel": {
        id: "shovel",
        title: "Shovel",
        effectType: ArtifactEffectType.EQUIPMENT_RARITY,
        effectAmount: 1,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
        image: I.artifacts.shovel,
        basePrice: 1,
    },
    "orbofwisdom": {
        id: "orbofwisdom",
        title: "Orb of Wisdom",
        hint: "This Artifact gets stronger based on Player Level times its count squared",
        effectType: ArtifactEffectType.PLAYER_XP,
        effectAmount: 1,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
        image: I.artifacts.orbOfWisdom,
        basePrice: 3,
        getAdditionalEffectMultiplier(game, count, tier) {
            return Decimal.pow(1 + game.player.level * count, 2);
        },
    },
    "metaldetector": {
        id: "metaldetector",
        title: "Metal Detector",
        hint: "This Artifacts effect strength is based on how much Equipment you scrapped and its count",
        effectType: ArtifactEffectType.EQUIPMENT_RARITY,
        effectAmount: 1,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
        image: I.artifacts.metalDetector,
        basePrice: 5,
        getAdditionalEffectMultiplier(game, count, tier) {
            return new Decimal(game.player.scrap.add(1).log10() / 5).mul(count);
        },
    },
    "magicwand": {
        id: "magicwand",
        title: "Magic Wand of Thousand Colors",
        hint: "This Artifacts effect strength is based on how much Artifacts you own and its tier",
        effectType: ArtifactEffectType.MAGIC_FIND,
        effectAmount: 0.1,
        effectOperation: ArtifactEffectOperation.MULTIPLICATIVE,
        image: I.artifacts.wandOfColors,
        basePrice: 10,
        getAdditionalEffectMultiplier(game, count, tier) {
            return new Decimal(game.player.inventory.artifactCount).mul(1 + tier);
        },
    },
};

export function calculateArtifactEffects(artifacts: Artifact[]){
    let result: ArtifactCalculatedEffects = {
        [ArtifactEffectType.MAGIC_FIND]: new Decimal(1),
        [ArtifactEffectType.DAMAGE]: new Decimal(1),
        [ArtifactEffectType.EQUIPMENT_RARITY]: new Decimal(1),
        [ArtifactEffectType.MAX_HEALTH]: new Decimal(0),
        [ArtifactEffectType.PLAYER_XP]: new Decimal(1),
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