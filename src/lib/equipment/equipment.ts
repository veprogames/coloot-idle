import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";
import { getTierColor } from "../utils";
import type { SaverLoader } from "../saveload";

export enum EquipmentType {
    WEAPON,
    ARMOR,
    ACCESSORY,
}

export default class Equipment implements SaverLoader {
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
        return getTierColor(this.tier);
    }

    save() {
        return {
            baseStat: this.baseStat.toString(),
            tier: this.tier,
            type: this.type,
        };
    }

    load(data: any): void {
        this.baseStat = new Decimal(data.baseStat);
        this.tier = data.tier;
        this.type = data.type;
    }
}

export const INIT_WEAPON = new Equipment(10, EquipmentType.WEAPON);
export const INIT_ARMOR = new Equipment(10, EquipmentType.ARMOR);
export const INIT_ACCESSORY = new Equipment(10, EquipmentType.ACCESSORY);