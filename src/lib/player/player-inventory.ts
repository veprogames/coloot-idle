import { calculateArtifactEffects, type ArtifactCalculatedEffects } from "../artifact/artifact";
import Artifact from "../artifact/artifact";
import type Equipment from "../equipment/equipment";

export default class PlayerInventory {
    equipment: Equipment[] = [];
    artifacts: Artifact[] = [];

    get equipmentCapacity(): number {
        return 48;
    }

    get remainingEquipmentCapacity(): number {
        return this.equipmentCapacity - this.equipment.length;
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
        return calculateArtifactEffects(this.artifacts);
    }

    get artifactCount(): number {
        if(this.artifacts.length === 0) return 0;

        return this.artifacts
            .map((artifact: Artifact) => artifact.count)
            .reduce((prev: number, current: number) => prev + current);
    }

    resetArtifacts(): void {
        this.artifacts = [];
    }

    resetEquipment(): void {
        this.equipment = [];
    }
}