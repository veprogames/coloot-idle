import { getGame } from "../singleton";
import type { ArtifactData } from "./artifact";
import Artifact, { Artifacts } from "./artifact";

export default class ArtifactShop {
    totalGems: number = 0;
    gemsSpent: number = 0;

    get gems(): number {
        return this.totalGems - this.gemsSpent;
    }

    get shopLevel() {
        return 1 + this.gemsSpent ** 0.5;
    }

    private get player() {
        return getGame().player;
    }

    getGems(playerLevel: number): number {
        const headStart = playerLevel >= 99 ? 3 : 0;
        const baseGems = (playerLevel - 99) / 3 + headStart;
        return Math.floor(Math.max(0, baseGems - this.totalGems));
    }

    /**
     * The reset mechanic. Get the Gems.
     */
    activate() {
        const gems = this.getGems(this.player.level);
        if(gems > 0) {
            const arena = getGame().arena;

            this.player.reset();
            arena.reset();
            getGame().resetPrestigeCrystals();

            this.totalGems += gems;
        }
    }

    get maxTierAvailable() {
        return Math.floor(this.shopLevel);
    }

    get availableArtifacts(): ArtifactData[] {
        return Object.values(Artifacts);
    }

    getArtifactPrice(artifactData: ArtifactData, tier: number): number {
        return artifactData.basePrice * (1 + tier);
    }

    buyArtifact(artifactData: ArtifactData, tier: number) {
        const price = this.getArtifactPrice(artifactData, tier);

        if(this.gems >= price) {
            const artifact = Artifact.from(artifactData, tier);
            this.player.inventory.addArtifact(artifact);
            this.gemsSpent += price;
        }
    }

    respec() {
        const arena = getGame().arena;
        
        this.gemsSpent = 0;
        this.player.reset();
        arena.reset();
    }
}