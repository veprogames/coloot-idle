import { get } from "svelte/store";
import type GameClass from "./game/gameclass";
import { game } from "./stores";

export function getGame(): GameClass {
    return get(game);
}