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

    currentHp: Decimal;
    /**
     * Earned by destroying equipment that's not worth equipping. Yields Magic Find.
     */
    scrap: Decimal = new Decimal(0);

    constructor() {
        this.currentHp = new Decimal(this.hp);
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
            .mul(this.armor.stat.div(10).pow(0.5))
            .mul(this.accessory.stat.div(10).pow(0.5))
            .floor();
    }

    get hp(): Decimal {
        return this.accessory.stat.div(10).pow(0.25).mul(10).floor();
    }

    get hpPercentage(): number {
        return this.currentHp.div(this.hp).toNumber();
    }

    get incomingDamageMultiplier(): Decimal {
        return this.armor.stat
            .div(10)
            .max(1)
            .pow(-0.25);
    }

    get dead(): boolean {
        return this.currentHp.lte(0);
    }

    /**
     * Multiplies the base stats of equipment earned
     */
    get magicFind(): Decimal {
        return (this.scrap.add(1).pow(0.1))
            .mul(this.accessory.stat.div(10).pow(0.1));
    }

    equip(equipment: Equipment): void {
        this.equipment[equipment.type] = equipment;
    }

    scrapEquipment(equipment: Equipment): void {
        this.scrap = this.scrap.add(equipment.scrap);
        this.removeFromInventory(equipment);
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

    getEffectiveDamage(damage: Decimal): Decimal {
        return damage.mul(this.incomingDamageMultiplier);
    }

    /**
     * Hit the player, deducting HP
     * 
     * @param damage Amount of damage to deal
     */
    hit(damage: Decimal) {
        this.currentHp = this.currentHp.sub(this.getEffectiveDamage(damage).round());
    }

    revive(): void {
        this.currentHp = this.hp;
    }
}