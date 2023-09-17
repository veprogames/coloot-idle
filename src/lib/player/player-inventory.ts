import Artifact, { Artifacts, calculateArtifactEffects, type ArtifactCalculatedEffects } from "../artifact/artifact";
import Equipment from "../equipment/equipment";
import type { SaverLoader } from "../saveload/saveload";

export default class PlayerInventory implements SaverLoader {
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

    save() {
        return {
            equipment: this.equipment.map(equip => equip.save()),
            artifacts: this.artifacts.map(artifact => artifact.save()),
        };
    }

    load(data: any): void {
        this.equipment = [];
        this.artifacts = [];
        for(const equip of data.equipment) {
            this.equipment.push(new Equipment(equip.baseStat, equip.type, equip.tier));
        }
        for(const artifact of data.artifacts) {
            const newArtifact = Artifact.from(Artifacts[artifact.id], artifact.tier);
            newArtifact.count = artifact.count;
            this.artifacts.push(newArtifact);
        }
    }
}