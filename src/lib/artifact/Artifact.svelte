<script lang="ts">
    import { capitalize, getTierName } from "../utils";
    import ArtifactImage from "./ArtifactImage.svelte";
    import type Artifact from "./artifact";
    import { ArtifactEffectOperation } from "./artifact";

    export let artifact: Artifact;

    $: tierName = capitalize(getTierName(artifact.tier));

    let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog}>
    <div>
        <h2>{tierName} {artifact.data.title}</h2>
        <p>{artifact.description}</p>
        {#if artifact.data.hint}
            <p class="italic text-slate-300 text-sm mt-4">{artifact.data.hint}</p>
        {/if}
        {#if artifact.data.effectOperation === ArtifactEffectOperation.ADDITIVE}
            <small>This effect is additive and is applied <strong>before</strong> all multiplicative effects.</small>
        {/if}
    </div>
    <p class="font-semibold">Current: <span class="text-green-400">{artifact.effectString}</span></p>
    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="relative w-16 h-16">
    <ArtifactImage data={artifact.data} tier={artifact.tier} size={16}/>
    <span class="absolute -bottom-1 right-0 font-bold text-xl
        bg-black bg-opacity-50 p-0.5 z-10">x{artifact.count}</span>
</button>