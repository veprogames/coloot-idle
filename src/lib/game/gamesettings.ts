import { NotationType } from "../format";
import type { SaverLoader } from "../saveload/saveload";

export class GameSettings implements SaverLoader {
    numberFormat: NotationType = NotationType.Default;
    autoEquip: boolean = false;

    save() {
        return {
            numberFormat: this.numberFormat,
            autoEquip: this.autoEquip,
        };
    }

    load(data: any): void {
        this.numberFormat = data.numberFormat ?? NotationType.Default;
        this.autoEquip = data.autoEquip ?? false;
    }
}
