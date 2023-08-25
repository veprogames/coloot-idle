import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";

export function choose<T>(elements: Array<T>) {
    return elements[Math.floor(Math.random() * elements.length)];
}

export function F(n: DecimalSource): string {
    const d = new Decimal(n);
    if(d.lt(10)) return d.toFixed(2);
    if(d.lt(1000)) return d.toFixed(0);
    return d.toExponential(2);
}