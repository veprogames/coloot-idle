import Decimal from "break_infinity.js";
import Equipment from "../equipment/equipment"
import { EquipmentType, INIT_ACCESSORY, INIT_ARMOR, INIT_WEAPON } from "../equipment/equipment"
import type Arena from "../enemy/arena";

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

    hp: Decimal;

    constructor() {
        this.hp = new Decimal(this.maxHp);
    }

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
        return this.weapon.stat
            .mul(this.armor.stat.pow(0.5))
            .mul(this.accessory.stat.pow(0.5))
            .floor();
    }

    get maxHp(): Decimal {
        return this.accessory.stat.pow(0.5).mul(10).floor();
    }

    get hpPercentage(): number {
        return this.hp.div(this.maxHp).toNumber();
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

    static get INVENTORY_CAPACITY(): number {
        return 32;
    };

    get inventory(): Equipment[] {
        return this._inventory;
    }

    addToInventory(equipment: Equipment) {
        if(this._inventory.length >= Player.INVENTORY_CAPACITY) {
            return;
        }
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

    /*
    * Arena
    */

    hitEnemy(arena: Arena){
        const possibleLoot = arena.hitEnemy(this.power);
        if(possibleLoot) {
            this.addToInventory(possibleLoot);
        }
    }
}