import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";

export enum EquipmentType {
    WEAPON,
    ARMOR,
    ACCESSORY,
}

export default class Equipment {
    stat: Decimal;
    type: EquipmentType;

    constructor(stat: DecimalSource, type: EquipmentType) {
        this.stat = new Decimal(stat);
        this.type = type;
    }
}

export const INIT_WEAPON = new Equipment(10, EquipmentType.WEAPON);
export const INIT_ARMOR = new Equipment(10, EquipmentType.ARMOR);
export const INIT_ACCESSORY = new Equipment(10, EquipmentType.ACCESSORY);