import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";
import { formatLetters } from "./format";

const rarityColors: string[] = [
    "#6b7280",
    "#88cc00",
    "#4d88ff",
    "#ff0055",
    "#ff5500",
    "#7300e6",
    "#800000",
    "#660066",
    "#999900",
];

const rarityNames: string[] = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "cosmic",
    "divine",
    "godly",
    "omega",
]

export function choose<T>(elements: Array<T>) {
    return elements[Math.floor(Math.random() * elements.length)];
}

export function clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
}

export function F(n: DecimalSource, long: boolean = false): string {
    const scientific = false;

    const d = new Decimal(n);

    if(d.lt(0)) return `-${F(d.neg())}`;
    if(d.eq(0)) return "0";

    if(d.lt(0.1)) return `${F(d.pow(-1))}⁻¹`;
    if(d.lt(10)) return d.toFixed(long ? 2 : 0);
    if(d.lt(1000)) return d.toFixed(0);

    return scientific ? d.toExponential(2) : formatLetters(d);
}

export function capitalize(str: string) {
    return `${str[0].toUpperCase()}${str.substring(1)}`;
}

export function getTierColor(tier: number): string{
    const col = rarityColors[tier];
    if(!col) {
        const hex = ((0xbedead * tier) % 0xffffff).toString(16);
        return `#${hex}`;
    }
    return col;
}

export function getTierName(tier: number): string {
    const name = rarityNames[tier];
    if(!name) {
        const last = rarityNames.at(-1);
        return `${last} +${tier - rarityNames.length}`;
    }
    return name;
}