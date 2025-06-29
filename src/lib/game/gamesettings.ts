import { NotationType } from "../format";
import type { SaverLoader } from "../saveload/saveload";

export class GameSettings implements SaverLoader {
    numberFormat: NotationType = NotationType.Default;

    save() {
        return {
            numberFormat: this.numberFormat,
        };
    }

    load(data: any): void {
        this.numberFormat = data.numberFormat ?? NotationType.Default;
    }
}
