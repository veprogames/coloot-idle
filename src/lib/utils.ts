import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";
import { formatLetters } from "./format";

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