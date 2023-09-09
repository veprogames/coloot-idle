import Decimal from "break_infinity.js";
import type Player from "../player/player";
import { getGame } from "../singleton";
import type { SaverLoader } from "../saveload";

const BASE_REQUIRED_LEVEL = 20;

export interface PrestigeCrystalData {
    title: string,
    description: string,
}

export abstract class PrestigeCrystal implements SaverLoader {
    data: PrestigeCrystalData
    /**
     * Increases by investing Artifacts
     */
    level: number = 0;

    /**
     * The Level the player had when investing
     */
    investedPlayerLevel: number = BASE_REQUIRED_LEVEL;

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
            const arena = getGame().arena;
            this.level += this.getNewLevels(player);
            this.investedPlayerLevel = Math.max(this.investedPlayerLevel, player.level);
            player.reset();
            arena.reset();
        }
    }

    reset() {
        this.level = 0;
    }

    save() {
        return {
            level: this.level,
        };
    }

    load(data: any): void {
        this.level = data.level;
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
        return Math.max(0, playerLevel - BASE_REQUIRED_LEVEL + 1);
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
        return Math.max(0, playerLevel - BASE_REQUIRED_LEVEL + 1);
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
        return Math.max(0, playerLevel - BASE_REQUIRED_LEVEL + 1);
    }

    getEffect(level: number): Decimal {
        return Decimal.pow(2, level / 25);
    }
}