<script lang="ts">
    import Statbar from "../dom/Statbar.svelte";
    import { F } from "../utils";
    import type Enemy from "./enemy";
    import { EnemyType } from "./enemy";

    export let enemy: Enemy;

    $: image = enemy.type === EnemyType.BOSS ? "golem.png" : "slime.png";
</script>

<div class="flex flex-col items-center">
    <h2>Enemy!</h2>
    <img class="my-4 w-24 h-24" src="./images/enemy/{image}" alt="Enemy" />
    <Statbar value={enemy.hpPercentage}>{F(enemy.currentHp)}</Statbar>
    <p class="font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z"/></svg>
        {F(enemy.def)}
    </p>
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
