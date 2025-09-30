/**
 * Creates a Pashto string structure
 *
 * @param p - the Pashto text
 * @param f - the phonetics text
 */
export function makePsString(p, f) {
    return { p, f };
}
export function removeFVarientsFromVerb(v) {
    const b = removeFVarients(v.entry);
    return {
        entry: b,
        ...v.complement ? {
            complement: removeFVarients(v.complement),
        } : {},
    };
}
export function removeFVarients(x) {
    if (typeof x === "string") {
        return x.split(",")[0];
    }
    if ("ts" in x) {
        return {
            ...x,
            f: removeFVarients(x.f),
        };
    }
    return {
        ...x,
        f: removeFVarients(x.f),
    };
}
