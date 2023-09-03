import { get } from "svelte/store";
import type Player from "../player/player";
import { game } from "../stores";
import Decimal from "break_infinity.js";

export interface PrestigeCrystalData {
    title: string,
    description: string,
}

export abstract class PrestigeCrystal {
    data: PrestigeCrystalData
    /**
     * Increases by investing Artifacts
     */
    level: number = 0;

    constructor(data: PrestigeCrystalData) {
        this.data = data;
    }

    abstract getLevels(playerLevel: number): number;

    abstract getEffect(level: number): Decimal;

    get effect(): Decimal {
        return this.getEffect(this.level);
    }

    canInvest(player: Player): boolean {
        return this.getNewLevels(player) > 0;
    }

    getNewLevels(player: Player): number {
        return this.getLevels(player.level) - this.level;
    }

    invest(player: Player) {
        if(this.canInvest(player)) {
            const arena = get(game).arena;
            this.level += this.getNewLevels(player);
            player.reset();
            arena.reset();
        }
    }
}

export class PrestigeCrystalPower extends PrestigeCrystal {
    constructor() {
        super({
            title: "Crystal of Power",
            description: "Increases Damage dealt",
        });
    }

    getLevels(playerLevel: number): number {
        return Math.max(0, playerLevel - 19);
    }

    getEffect(level: number): Decimal {
        return Decimal.pow(2, level / 12.5);
    }
}

export class PrestigeCrystalRarity extends PrestigeCrystal {
    constructor() {
        super({
            title: "Crystal of Rarity",
            description: "Increases the Rarity of found Equipment",
        });
    }

    getLevels(playerLevel: number): number {
        return Math.max(0, playerLevel - 19);
    }

    getEffect(level: number): Decimal {
        return Decimal.pow(10, level / 25);
    }
}

export class PrestigeCrystalMagic extends PrestigeCrystal {
    constructor() {
        super({
            title: "Crystal of Magic",
            description: "Increases Magic Find",
        });
    }

    getLevels(playerLevel: number): number {
        return Math.max(0, playerLevel - 19);
    }

    getEffect(level: number): Decimal {
        return Decimal.pow(2, level / 25);
    }
}