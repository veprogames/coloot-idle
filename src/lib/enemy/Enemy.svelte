<script lang="ts">
    import Statbar from "../dom/Statbar.svelte";
    import { game } from "../stores";
    import { F, getTierColor } from "../utils";
    import type Enemy from "./enemy";
    import { EnemyType } from "./enemy";

    export let enemy: Enemy;

    $: visuals = $game.arena.visuals;
    $: hueShift = visuals?.enemy.hue ?? 0;
    $: brightness = visuals?.enemy.brightness ?? 1;
    $: saturation = visuals?.enemy.saturation ?? 1;
    $: grayscale = visuals?.enemy.grayscale ?? 0;

    $: image = enemy.data.image;
    // add an alpha component to the hex color code
    $: glowColor = `${getTierColor(enemy.tier)}`;

    $: enemyName = enemy.type === EnemyType.BOSS ? "Boss" : enemy.data.name;
    $: tierName = ["", "Strong", "Elite"][enemy.tier] ?? "Unknown";
</script>

<div class="flex flex-col items-center">
    <h2>{tierName} {enemyName}</h2>
    <img 
        class="my-4 w-32 h-32" class:glow={enemy.tier > 0}
        style:--glow-color={glowColor}
        style:--hue-shift={`${hueShift}deg`}
        style:--brightness={brightness}
        style:--saturation={saturation}
        style:--grayscale={grayscale}
        src={image}
        alt={enemyName} />
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
        filter: hue-rotate(var(--hue-shift))
            brightness(var(--brightness))
            saturate(var(--saturation))
            grayscale(var(--grayscale));
    }

    img.glow {
        filter: hue-rotate(var(--hue-shift))
            brightness(var(--brightness))
            saturate(var(--saturation))
            grayscale(var(--grayscale))
            drop-shadow(0.25rem 0 0 var(--glow-color))
            drop-shadow(-0.25rem 0 0 var(--glow-color))
            drop-shadow(0 0.25rem 0 var(--glow-color))
            drop-shadow(0 -0.25rem 0 var(--glow-color));
    }
</style>
