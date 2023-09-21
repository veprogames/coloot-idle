import GameClass from "../game/gameclass";
import { getGame } from "../singleton";
import { game } from "../stores";

const LOCALSTORAGE_KEY_GAME = "veprogames.colootidle.game";

export interface SaverLoader {
    /**
     * Return a JSON respresentation with the minimal data needed
     */
    save(): any;

    /**
     * Load the Object *data*, mutating it
     */
    load(data: any): void;
}

export function getSaveString(object: SaverLoader) {
    return btoa(JSON.stringify(object.save()));
}

export function parseSaveString(base64string: string) {
    return JSON.parse(atob(base64string));
}

export function saveGame() {
    localStorage.setItem(LOCALSTORAGE_KEY_GAME, getSaveString(getGame()));
}

export function loadGameFromString(base64string: string) {
    const data = parseSaveString(base64string);

    game.update(g => {
        g.load(data);

        return g;
    });
}

export function loadGame() {
    const base64string = localStorage.getItem(LOCALSTORAGE_KEY_GAME);

    if(!base64string) return;

    loadGameFromString(base64string);
}

export function wipeGame() {
    localStorage.removeItem(LOCALSTORAGE_KEY_GAME);

    game.update(g => {
        return new GameClass();
    });
}