import Decimal from "break_infinity.js";
import Artifact, { ArtifactEffectType } from "../artifact/artifact";
import type Arena from "../enemy/arena";
import type Enemy from "../enemy/enemy";
import Equipment, { EquipmentType } from "../equipment/equipment";
import type { SaverLoader } from "../saveload/saveload";
import { getGame } from "../singleton";
import PlayerInventory from "./player-inventory";

export type PlayerEquipment = {
    [EquipmentType.WEAPON]: Equipment,
    [EquipmentType.ARMOR]: Equipment,
    [EquipmentType.ACCESSORY]: Equipment,
}

export default class Player implements SaverLoader {
    private equipment: PlayerEquipment = {
        [EquipmentType.WEAPON]: Equipment.INIT_WEAPON,
        [EquipmentType.ARMOR]: Equipment.INIT_ARMOR,
        [EquipmentType.ACCESSORY]: Equipment.INIT_ACCESSORY,
    };

    private _inventory: PlayerInventory = new PlayerInventory();

    currentHp: number;
    /**
     * Earned by destroying equipment that's not worth equipping. Yields Magic Find.
     */
    scrap: Decimal = new Decimal(0);

    /**
     * Levels give a boost and are used for prestige crystals
     */
    xp: Decimal = new Decimal(0);
    level: number = 1;
    // used for unlocks
    highestLevel: number = 1;

    autoEquip: boolean = false;

    constructor() {
        this.currentHp = 0;
    }

    initialize() {
        this.currentHp = this.hp;
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
        const levelEffect = Decimal.pow(1.04, this.level - 1);
        const artifactEffect = this._inventory.getArtifactEffects()[ArtifactEffectType.DAMAGE];
        const crystalEffect = getGame().prestigeCrystals.power.effect;

        return this.weapon.stat
            .mul(this.armor.stat.div(10).pow(0.5))
            .mul(this.accessory.stat.div(10).pow(0.5))
            .mul(levelEffect)
            .mul(artifactEffect)
            .mul(crystalEffect)
            .floor();
    }

    get hp(): number {
        const artifactEffect = this._inventory.getArtifactEffects()[ArtifactEffectType.MAX_HEALTH].toNumber();

        return 10 + Math.floor(0.25 * (this.level - 1)) + artifactEffect;
    }

    get hpPercentage(): number {
        return this.currentHp / this.hp;
    }

    get dead(): boolean {
        return this.currentHp <= 0;
    }

    getOverkill(enemy: Enemy): Decimal {
        return this.power.div(enemy.hp);
    }

    getOverkillForHealth(hp: Decimal): Decimal {
        return this.power.div(hp);
    }

    get rarityMultiplier(): Decimal {
        const crystal = getGame().prestigeCrystals.rarity;
        
        const artifactMult = this._inventory.getArtifactEffects()[ArtifactEffectType.EQUIPMENT_RARITY];
        const crystalMult = crystal.effect;
        
        return artifactMult.mul(crystalMult);
    }

    /**
     * Multiplies the base stats of equipment earned
     */
    get magicFind(): Decimal {
        const levelMult = Decimal.pow(1.02, this.level - 1);
        const artifactMult = this._inventory.getArtifactEffects()[ArtifactEffectType.MAGIC_FIND];
        const crystalMult = getGame().prestigeCrystals.magic.effect;

        return (this.scrap.add(1).pow(0.1))
            .mul(this.accessory.stat.div(10).pow(0.1))
            .mul(levelMult)
            .mul(artifactMult)
            .mul(crystalMult);
    }

    private assignEquipment(equipment: Equipment): void {
        this.equipment[equipment.type] = equipment;
    }

    scrapEquipment(equipment: Equipment): void {
        this.scrap = this.scrap.add(equipment.scrap);
        this._inventory.removeEquipment(equipment);
    }

    canEquip(equipment: Equipment): boolean {
        return this.equipment[equipment.type].stat.lt(equipment.stat);
    }

    equipOrScrap(equipment: Equipment) {
        if(this.canEquip(equipment)) {
            this.equipFromInventory(equipment);
        }
        else {
            this.scrapEquipment(equipment);
        }
    }

    /* 
    * Inventory 
    */

    get inventory(): PlayerInventory {
        return this._inventory;
    }

    equipFromInventory(equipment: Equipment){
        if(this.canEquip(equipment)) {
            this.assignEquipment(equipment);
            this._inventory.removeEquipment(equipment);
        }
    }

    equipAll() {
        for(const equipment of this._inventory.equipment) {
            this.equipOrScrap(equipment);
        }
    }

    /*
    * Arena
    */

    hitEnemy(arena: Arena){
        const possibleLoot = arena.hitEnemy(this.power);

        if(!possibleLoot) return;

        this.addXp(possibleLoot.xp);
        for(const drop of possibleLoot.drops) {
            if(drop instanceof Equipment) {
                this._inventory.addEquipment(drop);

                if(this.autoEquip) {
                    this.equipAll();
                }
            }
            else if(drop instanceof Artifact) {
                this._inventory.addArtifact(drop);
            }
        }
    }

    /*
    * XP
    */

    get xpRequired(): Decimal {
        // scales according to enemy hp, scale level similar to stage
        const INCREASE_PER_STAGE = 1.618 ** 5;
        return new Decimal(1000)
            .mul(Decimal.pow(INCREASE_PER_STAGE, this.level - 1));
    }

    get xpPercentage(): number {
        return this.xp.div(this.xpRequired).toNumber();
    }

    addXp(xp: Decimal) {
        let didLevelUp = false;

        this.xp = this.xp.add(xp);

        while(this.xp.gt(this.xpRequired)){
            this.xp = this.xp.sub(this.xpRequired);
            this.level++;
            this.highestLevel = Math.max(this.level, this.highestLevel)
            didLevelUp = true;
        }

        if(didLevelUp) {
            this.heal();
        }
    }

    /**
     * Hit the player, deducting HP
     * 
     * @param damage Amount of damage to deal
     */
    hit(damage: number) {
        this.currentHp -= damage;
    }

    heal() {
        this.currentHp = this.hp;
    }

    reset(): void {
        this.equipment = {
            [EquipmentType.WEAPON]: Equipment.INIT_WEAPON,
            [EquipmentType.ARMOR]: Equipment.INIT_ARMOR,
            [EquipmentType.ACCESSORY]: Equipment.INIT_ACCESSORY,
        };
        this.scrap = new Decimal(0);
        this.xp = new Decimal(0);
        this.level = 1;
        this._inventory.resetEquipment();
        this.heal();
    }

    /**
     * Save and Load
     */

    save(): unknown {
        return {
            currentHp: this.currentHp,
            xp: this.xp.toString(),
            level: this.level,
            highestLevel: this.highestLevel,
            scrap: this.scrap.toString(),
            autoEquip: this.autoEquip,
            equipment: {
                weapon: this.equipment[EquipmentType.WEAPON].save(),
                armor: this.equipment[EquipmentType.ARMOR].save(),
                accessory: this.equipment[EquipmentType.ACCESSORY].save(),
            },
            inventory: this._inventory.save(),
        };
    }

    load(data: any): void {
        this.currentHp = data.currentHp;
        this.level = data.level;
        this.highestLevel = data.highestLevel ?? this.level;
        this.xp = new Decimal(data.xp);
        this.scrap = new Decimal(data.scrap);
        this.autoEquip = data.autoEquip ?? false;
        this.equipment[EquipmentType.WEAPON].load(data.equipment.weapon);
        this.equipment[EquipmentType.ARMOR].load(data.equipment.armor);
        this.equipment[EquipmentType.ACCESSORY].load(data.equipment.accessory);
        this._inventory.load(data.inventory);
    }
}