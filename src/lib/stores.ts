import { writable } from "svelte/store";
import GameClass from "./game/gameclass";

export let game = writable(new GameClass());