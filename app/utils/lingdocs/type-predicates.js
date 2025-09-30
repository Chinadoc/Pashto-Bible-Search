import { pashtoConsonants } from "./pashto-consonants";
import { endsInConsonant, endsWith, hasShwaEnding } from "./p-text-helpers";
import { countSyllables } from "./accent-helpers";
import { getTransitivity } from "./verb-info";
const verbTenses = [
    "presentVerb",
    "subjunctiveVerb",
    "perfectiveFuture",
    "imperfectiveFuture",
    "perfectivePast",
    "imperfectivePast",
    "habitualPerfectivePast",
    "habitualImperfectivePast",
];
export function isTlulVerb(e) {
    const entry = "entry" in e ? e.entry : e;
    return (entry.f === "tlul" ||
        entry.p === "راتلل" ||
        entry.p === "درتلل" ||
        entry.p === "ورتلل");
}
export function isStatCompound(k) {
    return (e) => {
        // TODO: best way to check this?
        if (e.entry.c.startsWith("v. stat.")) {
            const transitivity = getTransitivity(e.entry);
            return ((k === "kawul" && transitivity === "transitive") ||
                (k === "kedul" && transitivity === "intransitive"));
        }
        else {
            return false;
        }
    };
}
export function isKawulVerb(e) {
    const entry = "entry" in e ? e.entry : e;
    return ["کول", "راکول", "درکول", "ورکول"].includes(entry.p);
}
export function isNounEntry(e) {
    if ("entry" in e)
        return false;
    return !!(e.c && (e.c.includes("n. m.") || e.c.includes("n. f.")));
}
export function isAdjectiveEntry(e) {
    if ("entry" in e)
        return false;
    return !!e.c?.includes("adj.");
}
export function isAdverbEntry(e) {
    if ("entry" in e)
        return false;
    return !!e.c?.includes("adv.");
}
export function isDeterminerEntry(e) {
    if ("entry" in e)
        return false;
    return !!e.c?.includes("det.");
}
export function isLocativeAdverbEntry(e) {
    if ("entry" in e)
        return false;
    return !!e.c?.includes("loc. adv.");
}
export function isNounOrAdjEntry(e) {
    return isNounEntry(e) || isAdjectiveEntry(e);
}
export function isInflectableEntry(e) {
    if ("entry" in e) {
        return false;
    }
    if (isDeterminer(e)) {
        return true;
    }
    return (isNounEntry(e) ||
        isAdjectiveEntry(e) ||
        isNumberEntry(e) ||
        isDeterminerEntry(e));
}
export function isDeterminer(e) {
    return "type" in e && e.type === "det";
}
export function isNumberEntry(e) {
    if ("entry" in e) {
        return false;
    }
    return e.c ? e.c.includes("num.") : false;
}
export function isVerbDictionaryEntry(e) {
    return !!e.c?.startsWith("v.");
}
export function isVerbEntry(e) {
    return "entry" in e && isVerbDictionaryEntry(e.entry);
}
export function isMascNounEntry(e) {
    return !!e.c && e.c.includes("n. m.");
}
export function isFemNounEntry(e) {
    return "c" in e && !!e.c && e.c.includes("n. f.");
}
export function isUnisexNounEntry(e) {
    return isNounEntry(e) && e.c.includes("unisex");
}
export function isAnimNounEntry(e) {
    return e.c.includes("anim.");
}
export function isUnisexAnimNounEntry(e) {
    return isUnisexNounEntry(e) && isAnimNounEntry(e);
}
export function isAdjOrUnisexNounEntry(e) {
    return isAdjectiveEntry(e) || (isNounEntry(e) && isUnisexNounEntry(e));
}
export function isPattern(p) {
    if (p === 0) {
        return isNonInflectingEntry;
    }
    if (p === 1) {
        return isPattern1Entry;
    }
    if (p === 2) {
        return isPattern2Entry;
    }
    if (p === 3) {
        return isPattern3Entry;
    }
    if (p === 4) {
        return isPattern4Entry;
    }
    if (p === 5) {
        return isPattern5Entry;
    }
    if (p === 6) {
        return isPattern6FemEntry;
    }
    return () => true;
}
export function isNonInflectingEntry(e) {
    if (e.noInf)
        return true;
    return (!isPattern1Entry(e) &&
        !isPattern2Entry(e) &&
        !isPattern3Entry(e) &&
        !isPattern4Entry(e) &&
        !isPattern5Entry(e) &&
        !isPattern6FemEntry(e) &&
        (!isNounEntry(e) || !isPluralNounEntry(e)));
}
/**
 * shows if a noun/adjective has the basic (consonant / ه) inflection pattern
 *
 * @param e
 * @returns
 */
export function isPattern1Entry(e) {
    if ("noInf" in e && e.noInf)
        return false;
    if (("infap" in e && e.infap) || ("infbp" in e && e.infbp))
        return false;
    // family words like خور زوی etc with special plural don't follow pattern #1
    if ("c" in e && e.c.includes("fam.")) {
        return false;
    }
    if (isFemNounEntry(e)) {
        return ((endsWith([
            { p: "ه", f: "a" },
            { p: "ح", f: "a" },
            { p: "ع", f: "a" },
            { p: "ع", f: "a'" },
        ], e) &&
            !e.p.endsWith("اع")) ||
            endsWith({ p: pashtoConsonants }, e));
    }
    return endsInConsonant(e) || hasShwaEnding(e);
}
/**
 * shows if a noun/adjective has the unstressed ی inflection pattern
 *
 * @param e
 * @returns T.T.T.T.
 */
export function isPattern2Entry(e) {
    if (e.noInf)
        return false;
    if (e.infap)
        return false;
    if (isFemNounEntry(e)) {
        return !e.c.includes("pl.") && endsWith({ p: "ې", f: "e" }, e, true);
    }
    // TODO: check if it's a single syllable word, in which case it would be pattern 1
    return endsWith({ p: "ی", f: "ay" }, e, true) && countSyllables(e.f) > 1;
}
/**
 * shows if a noun/adjective has the stressed ی inflection pattern
 *
 * @param e
 * @returns
 */
export function isPattern3Entry(e) {
    if (e.noInf)
        return false;
    if (e.infap)
        return false;
    if (isFemNounEntry(e)) {
        return endsWith({ p: "ۍ" }, e);
    }
    return countSyllables(e.f) > 1
        ? endsWith({ p: "ی", f: "áy" }, e, true)
        : endsWith({ p: "ی", f: "ay" }, e);
}
/**
 * shows if a noun/adjective has the "Pashtoon" inflection pattern
 *
 * @param e
 * @returns
 */
export function isPattern4Entry(e) {
    if (e.noInf)
        return false;
    return (!!(e.infap && e.infaf && e.infbp && e.infbf) &&
        e.infap.slice(1).includes("ا") &&
        e.infap.slice(-1) === "ه");
}
/**
 * shows if a noun/adjective has the shorter squish inflection pattern
 *
 * @param e
 * @returns
 */
export function isPattern5Entry(e) {
    if (e.noInf)
        return false;
    return (!!(e.infap && e.infaf && e.infbp && e.infbf) &&
        !e.infap.slice(1).includes("ا") &&
        e.infap.slice(-1) === "ه");
}
export function isPattern6FemEntry(e) {
    if (!isFemNounEntry(e))
        return false;
    if (e.c.includes("anim."))
        return false;
    return e.p.slice(-1) === "ي";
}
export function isPluralNounEntry(e) {
    return e.c.includes("pl.");
}
export function isSingularEntry(e) {
    return !isPluralNounEntry(e);
}
export function isArrayOneOrMore(a) {
    return a.length > 0;
}
export function isPerfectTense(tense) {
    return tense.endsWith("Perfect");
}
export function isVerbTense(tense) {
    return verbTenses.some((x) => x === tense);
}
export function isAbilityTense(tense) {
    return tense.endsWith("Modal");
}
export function isEquativeTense(t) {
    return (t === "present" ||
        t === "future" ||
        t === "habitual" ||
        t === "past" ||
        t === "wouldBe" ||
        t === "subjunctive" ||
        t === "pastSubjunctive" ||
        t === "wouldHaveBeen");
}
export function isImperativeTense(tense) {
    return tense === "imperfectiveImperative" || tense === "perfectiveImperative";
}
