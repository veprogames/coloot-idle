<script lang="ts">
    import ConfirmButton from "../dom/ConfirmButton.svelte";
    import HelpButton from "../dom/HelpButton.svelte";
    import Statbar from "../dom/Statbar.svelte";
    import ArtifactImage from "./ArtifactImage.svelte";
    import ArtifactShop from "./artifactshop";

    export let shop: ArtifactShop;

    let dialog: HTMLDialogElement;

    export function open() {
        dialog.showModal();
    }
</script>

<dialog bind:this={dialog}>
    <h2>Artifact Shop</h2>
    <div class="flex flex-wrap justify-center gap-8">
        <span>Gems: {shop.gems}</span>
        <span>Spent: {shop.gemsSpent}</span>
    </div>
    <div class="flex justify-center items-center gap-2">
        <Statbar width="16rem" value={shop.shopLevel % 1.0}>Tier {Math.floor(shop.shopLevel).toFixed(0)}</Statbar>
        <HelpButton>
            <p>
                Spend Gems to unlock higher Tier Artifacts in the Shop.
            </p>
        </HelpButton>
    </div>
    <div class="flex flex-col gap-4 h-64 w-full overflow-scroll">
        {#each { length: shop.maxTierAvailable } as _, tier} 
            <div class="flex gap-4">
                {#each shop.availableArtifacts as artifact}
                    <button on:click={() => shop.buyArtifact(artifact, tier)} class="btn btn-gray w-16 h-16 flex-shrink-0 relative">
                        <ArtifactImage data={artifact} tier={tier} />
                        <span 
                            class="absolute bottom-0 left-1/2 -translate-x-1/2 font-semibold 
                            bg-black bg-opacity-50 p-0.5 px-1 rounded-md"
                        >
                            {shop.getArtifactPrice(artifact, tier)}
                        </span>
                    </button>
                {/each}
            </div>
        {/each}
    </div>
    <div class="flex gap-2">
        <ConfirmButton
            class="flex-grow"
            disabled={!shop.canRespec} 
            message="Are your sure? This will reset your equipment and level, 
                getting back all gems and keeping Crystal levels"
            on:confirm={() => shop.respec()}>
            Respec
        </ConfirmButton>
        <HelpButton>
            <p>
                Reset all Artifacts and get the Gems back. This will reset your Equipment and Level.
                You will keep your Crystal Levels.
            </p>
        </HelpButton>
    </div>
    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>