import type Decimal from "break_infinity.js";
import Equipment from "../equipment/equipment"
import { EquipmentType, INIT_ACCESSORY, INIT_ARMOR, INIT_WEAPON } from "../equipment/equipment"

export type PlayerEquipment = {
    [EquipmentType.WEAPON]: Equipment,
    [EquipmentType.ARMOR]: Equipment,
    [EquipmentType.ACCESSORY]: Equipment,
}

export default class Player {
    private equipment: PlayerEquipment = {
        [EquipmentType.WEAPON]: INIT_WEAPON,
        [EquipmentType.ARMOR]: INIT_ARMOR,
        [EquipmentType.ACCESSORY]: INIT_ACCESSORY,
    };

    private _inventory: Equipment[] = [];

    /* 
    * Stats 
    */

    get weapon(): Equipment {
        return this.equipment[EquipmentType.WEAPON];
    }

    get armor(): Equipment {
        return this.equipment[EquipmentType.ARMOR];
    }

    get accessory(): Equipment {
        return this.equipment[EquipmentType.ACCESSORY];
    }

    get power(): Decimal {
        return this.weapon.stat.mul(this.armor.stat).mul(this.accessory.stat).floor();
    }

    get health(): Decimal {
        return this.accessory.stat.pow(0.5).mul(10).floor();
    }

    get incomingDamageMultiplier(): Decimal {
        return this.armor.stat.pow(0.25);
    }

    equip(equipment: Equipment): void {
        this.equipment[equipment.type] = equipment;
    }

    canEquip(equipment: Equipment): boolean {
        return this.equipment[equipment.type].stat.lt(equipment.stat);
    }

    /* 
    * Inventory 
    */

    get inventory(): Equipment[] {
        return this._inventory;
    }

    addToInventory(equipment: Equipment) {
        this._inventory.push(equipment);
    }

    removeFromInventory(equipment: Equipment) {
        this._inventory = this._inventory.filter((equip: Equipment) => equipment !== equip);
    }

    equipFromInventory(equipment: Equipment){
        if(this.canEquip(equipment)) {
            this.equip(equipment);
            this.removeFromInventory(equipment);
        }
    }
}