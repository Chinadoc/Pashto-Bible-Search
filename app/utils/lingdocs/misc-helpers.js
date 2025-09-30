/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPL3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { fmapSingleOrLengthOpts } from "./fp-ps";
export function assertNever(value, msg) {
    throw new Error(`${msg}: ` + value);
}
export const blank = {
    p: "_____",
    f: "_____",
};
export const kidsBlank = { p: "___", f: "___" };
/**
 * returns the main entry of a VerbEntry or just the entry of a DictionaryEntry
 *
 * @param e FullEntry
 * @returns DictionaryEntry
 */
export function entryOfFull(e) {
    return "entry" in e ? e.entry : e;
}
// just for type safety
export function noPersInfs(s) {
    if ("mascSing" in s) {
        // this path shouldn't be used, just for type safety
        return s.mascSing;
    }
    return s;
}
export function ensureNonComboVerbInfo(i) {
    return "stative" in i ? i.stative : "transitive" in i ? i.transitive : i;
}
export function ensureVerbConjugation(o) {
    return "stative" in o ? o.stative : "transitive" in o ? o.transitive : o;
}
export function pickPersInf(s, persInf) {
    // @ts-expect-error because ok
    if ("mascSing" in s) {
        return s[persInf];
    }
    return s;
}
export function getFirstSecThird(p) {
    if ([0, 1, 6, 7].includes(p))
        return 1;
    if ([2, 3, 8, 9].includes(p))
        return 2;
    return 3;
}
// export function pickPersInf(
//     s: T.OptionalPersonInflections<T.LengthOptions<T.PsString>>,
//     persInf: T.PersonInflectionsField,
// ): T.LengthOptions<T.PsString>;
// export function pickPersInf(
//     s: T.FullForm<T.PsString>,
//     persInf: T.PersonInflectionsField,
// ): T.SingleOrLengthOpts<T.PsString>;
// export function pickPersInf(
//     s: T.FullForm<T.VerbBlock>,
//     persInf: T.PersonInflectionsField,
// ): T.SingleOrLengthOpts<T.VerbBlock>;
// export function pickPersInf(
//     s: T.SplitInfo,
//     persInf: T.PersonInflectionsField,
// ): T.SingleOrLengthOpts<[T.PsString, T.PsString]>;
// export function pickPersInf(
//     s: T.OptionalPersonInflections<T.LengthOptions<T.PsString>> | T.FullForm<T.PsString> | T.FullForm<T.VerbBlock> | T.SplitInfo,
//     persInf: T.PersonInflectionsField,
// ): T.SingleOrLengthOpts<T.PsString> | T.LengthOptions<T.PsString> | T.SingleOrLengthOpts<T.VerbBlock> | T.SingleOrLengthOpts<[T.PsString, T.PsString]> {
//     if ("mascSing" in s) {
//         return s[persInf];
//     }
//     return s;
// }
export function hasPersInfs(info) {
    if ("participle" in info) {
        return ("mascSing" in info.root.perfective ||
            "mascSing" in info.stem.perfective ||
            ("present" in info.participle && "mascSing" in info.participle.present) ||
            "mascSing" in info.participle.past);
    }
    return ("mascSing" in info.root.perfective || "mascSing" in info.stem.perfective);
}
// TODO: deprecated using new verb rendering thing
export function chooseParticipleInflection(pPartInfs, person) {
    if ("long" in pPartInfs) {
        return {
            short: chooseParticipleInflection(pPartInfs.short, person),
            long: chooseParticipleInflection(pPartInfs.long, person),
        };
    }
    if ("masc" in pPartInfs) {
        const gender = personGender(person);
        const infNum = personIsPlural(person) ? 1 : 0;
        return pPartInfs[gender][infNum][0];
    }
    return pPartInfs; // already just one thing
}
export function getPersonNumber(gender, number) {
    const base = gender === "masc" ? 4 : 5;
    return base + (number === "singular" ? 0 : 6);
}
export function personFromVerbBlockPos(pos) {
    return pos[0] + (pos[1] === 1 ? 6 : 0);
}
export function getPersonInflectionsKey(person) {
    return `${personGender(person)}${personIsPlural(person) ? "Plur" : "Sing"}`;
}
export function spaceInForm(form) {
    if ("mascSing" in form) {
        return spaceInForm(form.mascSing);
    }
    if ("long" in form) {
        return spaceInForm(form.long);
    }
    return form.p.includes(" ");
}
export function getPersonFromVerbForm(form, person) {
    return fmapSingleOrLengthOpts((x) => {
        const [row, col] = getVerbBlockPosFromPerson(person);
        return x[row][col];
    }, form);
}
export function getVerbBlockPosFromPerson(person) {
    const plural = personIsPlural(person);
    const row = (plural ? person - 6 : person);
    const col = plural ? 1 : 0;
    return [row, col];
}
export function getAuxTransitivity(trans) {
    return trans === "intransitive" ? "intransitive" : "transitive";
}
export function personGender(person) {
    return person % 2 === 0 ? "masc" : "fem";
}
export function personPerson(person) {
    const p = person > 5 ? person - 6 : person;
    return (Math.floor(p / 2) + 1);
}
export function personNumber(person) {
    return personIsPlural(person) ? "plural" : "singular";
}
export function personIsPlural(person) {
    return person > 5;
}
export function getEnglishPersonInfo(person, version) {
    const p = ([0, 1, 6, 7].includes(person)
        ? "1st"
        : [2, 3, 8, 9].includes(person)
            ? "2nd"
            : "3rd") + " pers.";
    const number = personIsPlural(person) ? "plur" : "sing";
    const n = version === "short" ? (number === "plur" ? "pl" : "sg") : number;
    const gender = personGender(person);
    const g = version === "short" ? (gender === "masc" ? "m" : "f") : gender;
    return `${p} ${n}. ${g}.`;
}
export function getEnglishGenNumInfo(gender, number) {
    return `${gender === "masc" ? "masc" : "fem"} ${number === "plural" ? "plur." : "sing."}`;
}
export function personToGenNum(p) {
    return {
        gender: personGender(p),
        number: personNumber(p),
    };
}
export function getEnglishParticipleInflection(person, version) {
    const number = personIsPlural(person) ? "plural" : "singular";
    const n = version === "short" ? (number === "plural" ? "plur." : "sing.") : number;
    const gender = personGender(person);
    const g = gender;
    return `${g}. ${n}`;
}
export function randomNumber(minInclusive, maxExclusive) {
    return Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive);
}
export function randFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
export const isFirstPerson = (p) => [0, 1, 6, 7].includes(p);
export const isSecondPerson = (p) => [2, 3, 8, 9].includes(p);
export const isThirdPerson = (p) => [4, 5, 10, 11].includes(p);
export function incrementPerson(p) {
    return (p + 1) % 12;
}
export function isSentenceForm(f) {
    if ("long" in f) {
        return isSentenceForm(f.long);
    }
    return Array.isArray(f) && "p" in f[0];
}
export function isNounAdjOrVerb(entry) {
    if (!entry.c) {
        return false;
    }
    if (entry.c.includes("adj.") ||
        entry.c.includes("n. m.") ||
        entry.c.includes("n. f.")) {
        return "nounAdj";
    }
    if (entry.c.slice(0, 3) === "v. ") {
        return "verb";
    }
    return false;
}
/**
 * takes the ec field from a dictionary entry and produces an array of an EnglishVerbConjugation
 * for use with the conjugations display for showing English translation sentences of various verb
 * forms and conjugations
 *
 * @param ec
 * @returns
 */
export function parseEc(ec) {
    function isVowel(s) {
        return ["a", "e", "i", "o", "u"].includes(s);
    }
    function makeRegularConjugations(s) {
        if (s === "get") {
            return ["get", "gets", "getting", "got", "gotten"];
        }
        if (s === "become") {
            return ["become", "becomes", "becoming", "became", "become"];
        }
        if (s === "make") {
            return ["make", "makes", "making", "made", "made"];
        }
        if (s === "have") {
            return ["have", "has", "having", "had", "had"];
        }
        if (s === "be") {
            return ["am", "is", "being", "was", "been"];
        }
        if (s === "give") {
            return ["give", "gives", "giving", "gave", "gave"];
        }
        if (s.slice(-1) === "y" && !isVowel(s.slice(-2)[0])) {
            const b = s.slice(0, -1);
            return [`${s}`, `${b}ies`, `${s}ing`, `${b}ied`, `${b}ied`];
        }
        if (s.slice(-2) === "ss") {
            return [`${s}`, `${s}es`, `${s}ing`, `${s}ed`, `${s}ed`];
        }
        if (s.slice(-2) === "ie" && !isVowel(s.slice(-3)[0])) {
            const b = s.slice(0, -2);
            return [`${s}`, `${s}s`, `${b}ying`, `${s}d`, `${s}d`];
        }
        const b = s === "" ? "VERB" : s.slice(-1) === "e" ? s.slice(0, -1) : s;
        return [`${s}`, `${s}s`, `${b}ing`, `${b}ed`, `${b}ed`];
    }
    const items = ec.split(",").map((x) => x.trim());
    return items.length === 4
        ? [items[0], items[1], items[2], items[3], items[3]]
        : items.length === 5
            ? [items[0], items[1], items[2], items[3], items[4]]
            : makeRegularConjugations(items[0]);
}
export function chooseLength(x, length) {
    // @ts-expect-error because ok
    if ("long" in x) {
        return x[length];
    }
    return x;
}
export function isGivingVerb(v) {
    return ["raakawul", "darkawul", "warkawul"].includes(v.entry.g);
}
/**
 * checks to see if two arrays have a common element
 */
export function arraysHaveCommon(a, b) {
    return a.some((x) => b.includes(x));
}
