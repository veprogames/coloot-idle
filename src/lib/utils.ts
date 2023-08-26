import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";

export function choose<T>(elements: Array<T>) {
    return elements[Math.floor(Math.random() * elements.length)];
}

export function clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
}

export function F(n: DecimalSource): string {
    const d = new Decimal(n);
    if(d.lt(0)) return `-${F(d.neg())}`;
    if(d.eq(0)) return "0";
    if(d.lt(0.001)) return `1/${d.pow(-1).toExponential(2)}`
    if(d.lt(0.1)) return `1/${d.pow(-1).toFixed(0)}`
    if(d.lt(10)) return d.toFixed(2);
    if(d.lt(1000)) return d.toFixed(0);
    return d.toExponential(2);
}