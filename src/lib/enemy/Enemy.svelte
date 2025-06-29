<script lang="ts">
    import Statbar from "../dom/Statbar.svelte";
    import { I } from "../images";
    import { F, getTierColor } from "../utils";
    import type Enemy from "./enemy";
    import { EnemyType } from "./enemy";

    export let enemy: Enemy;

    $: image =
        enemy.type === EnemyType.BOSS ? I.enemy.slimeBoss : I.enemy.slime;
    // add an alpha component to the hex color code
    $: glowColor = `${getTierColor(enemy.tier)}`;

    $: enemyName = enemy.type === EnemyType.BOSS ? "Boss" : "Enemy";
    $: tierName = ["", "Strong", "Elite"][enemy.tier] ?? "Unknown";
</script>

<div class="flex flex-col items-center">
    <h2>{tierName} {enemyName}</h2>
    <img
        class="mb-4 w-32"
        class:glow={enemy.tier > 0}
        style:--glow-color={glowColor}
        src={image}
        alt="Enemy"
    />
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

    img.glow {
        filter: drop-shadow(0.25rem 0 0 var(--glow-color))
            drop-shadow(-0.25rem 0 0 var(--glow-color))
            drop-shadow(0 0.25rem 0 var(--glow-color))
            drop-shadow(0 -0.25rem 0 var(--glow-color));
    }
</style>
