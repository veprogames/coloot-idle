import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";

export enum EquipmentType {
    WEAPON,
    ARMOR,
    ACCESSORY,
}

const rarityColors: string[] = [
    "#6b7280",
    "#88cc00",
    "#4d88ff",
    "#ff0055",
    "#ff5500",
    "#7300e6",
    "#800000",
    "#660066",
    "#999900",
]

export default class Equipment {
    baseStat: Decimal;
    type: EquipmentType;
    tier: number;

    constructor(stat: DecimalSource, type: EquipmentType, tier: number = 0) {
        this.baseStat = new Decimal(stat);
        this.type = type;
        this.tier = tier;
    }

    get stat() {
        return this.baseStat.mul(Decimal.pow(2, this.tier));
    }

    get scrap() {
        return this.stat.mul(0.01);
    }

    get color(): string {
        const col = rarityColors[this.tier];
        if(!col) {
            const hex = ((0xbedead * this.tier) % 0xffffff).toString(16);
            return `#${hex}`;
        }
        return col;
    }
}

export const INIT_WEAPON = new Equipment(10, EquipmentType.WEAPON);
export const INIT_ARMOR = new Equipment(10, EquipmentType.ARMOR);
export const INIT_ACCESSORY = new Equipment(10, EquipmentType.ACCESSORY);