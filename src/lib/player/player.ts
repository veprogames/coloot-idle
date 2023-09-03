import Decimal from "break_infinity.js";
import Equipment from "../equipment/equipment"
import { EquipmentType, INIT_ACCESSORY, INIT_ARMOR, INIT_WEAPON } from "../equipment/equipment"
import type Arena from "../enemy/arena";
import PlayerInventory from "./player-inventory";
import Artifact, { ArtifactEffectType, Artifacts, randomArtifact } from "../equipment/artifact";
import type Enemy from "../enemy/enemy";
import { get } from "svelte/store";
import { game } from "../stores";

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
    level: number = 0;

    constructor() {
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
        const levelEffect = Decimal.pow(1.04, this.level);
        const artifactEffect = this._inventory.getArtifactEffects()[ArtifactEffectType.DAMAGE];
        const crystalEffect = get(game).prestigeCrystals.power.effect;

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

        return 10 + artifactEffect;
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

    /**
     * Multiplies the base stats of equipment earned
     */
    get magicFind(): Decimal {
        const levelMult = Decimal.pow(1.02, this.level);
        const artifactMult = this._inventory.getArtifactEffects()[ArtifactEffectType.MAGIC_FIND];
        const crystalMult = get(game).prestigeCrystals.magic.effect;

        return (this.scrap.add(1).pow(0.1))
            .mul(this.accessory.stat.div(10).pow(0.1))
            .mul(levelMult)
            .mul(artifactMult)
            .mul(crystalMult);
    }

    equip(equipment: Equipment): void {
        this.equipment[equipment.type] = equipment;
    }

    scrapEquipment(equipment: Equipment): void {
        this.scrap = this.scrap.add(equipment.scrap);
        this._inventory.removeEquipment(equipment);
    }

    canEquip(equipment: Equipment): boolean {
        return this.equipment[equipment.type].stat.lt(equipment.stat);
    }

    /* 
    * Inventory 
    */

    get inventory(): PlayerInventory {
        return this._inventory;
    }

    equipFromInventory(equipment: Equipment){
        if(this.canEquip(equipment)) {
            this.equip(equipment);
            this._inventory.removeEquipment(equipment);
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
            .mul(Decimal.pow(INCREASE_PER_STAGE, this.level));
    }

    get xpPercentage(): number {
        return this.xp.div(this.xpRequired).toNumber();
    }

    addXp(xp: Decimal) {
        this.xp = this.xp.add(xp);

        while(this.xp.gt(this.xpRequired)){
            this.xp = this.xp.sub(this.xpRequired);
            this.level++;
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

    revive(): void {
        this.currentHp = this.hp;
    }

    reset(): void {
        this.equipment = {
            [EquipmentType.WEAPON]: INIT_WEAPON,
            [EquipmentType.ARMOR]: INIT_ARMOR,
            [EquipmentType.ACCESSORY]: INIT_ACCESSORY,
        };
        this.scrap = new Decimal(0);
        this.xp = new Decimal(0);
        this.level = 0;
        this._inventory.reset();
    }
}