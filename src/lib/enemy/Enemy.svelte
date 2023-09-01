<script lang="ts">
    import Statbar from "../dom/Statbar.svelte";
    import { F } from "../utils";
    import type Enemy from "./enemy";
    import { EnemyType } from "./enemy";

    export let enemy: Enemy;

    $: image = enemy.type === EnemyType.BOSS ? "golem.png" : "slime.png";
</script>

<div class="flex flex-col items-center">
    <img class="my-4 w-28 h-28" src="./images/enemy/{image}" alt="Enemy" />
    <Statbar value={enemy.hpPercentage}>{F(enemy.currentHp)}</Statbar>
</div>

<style lang="postcss">
    @keyframes idle {
        0% {
            transform: scaleY(1);
        }
        50% {
            transform: scaleY(0.95);
        }
        0% {
            transform: scaleY(1);
        }
    }

    img {
        animation: idle 1.5s ease-in-out infinite;
        transform-origin: bottom;
    }
</style>
