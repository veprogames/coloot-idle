<script lang="ts">
    import type Artifact from "../equipment/artifact";
    import { ArtifactEffectOperation } from "../equipment/artifact";
    import { F } from "../utils";

    export let artifact: Artifact;

    let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog}>
    <div>
        <h2>{artifact.data.title}</h2>
        <p>{artifact.description}</p>
    </div>
    <p class="font-semibold">Current: <span class="text-green-400">{artifact.effectString}</span></p>
    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="relative w-16 h-16">
    <img 
        class="h-16 w-auto" src={artifact.data.image}
        alt="Icon"
        style:--artifact-color={artifact.color}
    />
    <span class="absolute -bottom-2 right-0 font-bold">x{artifact.count}</span>
</button>

<style lang="postcss">
    img {
        filter: drop-shadow(0 0.25rem 0 var(--artifact-color)) 
            drop-shadow(0 -0.25rem 0 var(--artifact-color))
            drop-shadow(0.25rem 0 0 var(--artifact-color))
            drop-shadow(-0.25rem 0 0 var(--artifact-color));
    }
</style>