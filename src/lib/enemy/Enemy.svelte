<script lang="ts">
    import { F } from "../utils";
    import type Enemy from "./enemy";

    export let enemy: Enemy;
</script>

<div>
    <h2>Enemy!</h2>
    <p>(Image)</p>
    <progress value={enemy.hpPercentage} max="1" />
    ({F(enemy.currentHp)} / {F(enemy.hp)})
    <p>DEF - {F(enemy.def)}</p>
</div>
