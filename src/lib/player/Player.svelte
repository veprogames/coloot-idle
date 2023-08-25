<script lang="ts">
    import { F } from "../utils";
import type Player from "./player";

    export let player: Player;
</script>

<div>
    {F(player.power)} - {player.inventory.length}
</div>