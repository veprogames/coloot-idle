import { calculateEffects, type ArtifactCalculatedEffects } from "../equipment/artifact";
import Artifact from "../equipment/artifact";
import type Equipment from "../equipment/equipment";

export default class PlayerInventory {
    equipment: Equipment[] = [];
    artifacts: Artifact[] = [];

    get equipmentCapacity(): number {
        return 32;
    }

    addEquipment(equipment: Equipment) {
        if(this.equipment.length >= this.equipmentCapacity) {
            return;
        }
        this.equipment.push(equipment);
    }

    removeEquipment(equipment: Equipment) {
        this.equipment = this.equipment.filter((equip: Equipment) => equipment !== equip);
    }

    addArtifact(artifact: Artifact) {
        const existingArtifact = this.artifacts.find((a: Artifact) => a.equals(artifact));
        if(existingArtifact) {
            existingArtifact.count++;
        }
        else {
            this.artifacts.push(artifact);
        }
    }

    getArtifactEffects(): ArtifactCalculatedEffects {
        return calculateEffects(this.artifacts);
    }

    get artifactCount(): number {
        return this.artifacts
            .map((artifact: Artifact) => artifact.count)
            .reduce((prev: number, current: number) => prev + current);
    }
}