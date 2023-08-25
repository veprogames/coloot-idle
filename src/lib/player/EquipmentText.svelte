<script lang="ts">
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
</script>

<span>{typeName} - {F(equipment.stat)}</span>