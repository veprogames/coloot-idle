<script lang="ts">
    import Icon from "../dom/Icon.svelte";
import type Equipment from "../equipment/equipment";
    import { EquipmentType } from "../equipment/equipment";
    import { F } from "../utils";

    export let equipment: Equipment;

    // Temporary! This is supposed to be a "unique" name
    $: typeName = {
        [EquipmentType.WEAPON]: "Weapon",
        [EquipmentType.ARMOR]: "Armor",
        [EquipmentType.ACCESSORY]: "Accessory",
    }[equipment.type];

    $: image = "./images/equipment/" + {
        [EquipmentType.WEAPON]: "sword.png",
        [EquipmentType.ARMOR]: "armor.png",
        [EquipmentType.ACCESSORY]: "accessory.png",
    }[equipment.type];
</script>

<span><Icon src={image} alt={typeName}/> {typeName} - {F(equipment.stat)}</span>