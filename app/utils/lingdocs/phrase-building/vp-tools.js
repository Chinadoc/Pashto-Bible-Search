import * as T from "../../../types";
import { concatPsString, psRemove, psStringEquals } from "../p-text-helpers";
import { isImperativeTense, isPerfectTense, isVerbTense, } from "../type-predicates";
import * as grammarUnits from "../grammar-units";
import { isSecondPerson, randomNumber } from "../misc-helpers";
import { adjustObjectSelection, adjustSubjectSelection, getObjectSelection, getSubjectSelection, VPSBlocksAreComplete, } from "./blocks-utils";
// TOOD: could use a bunch of optics in here too
export function isInvalidSubjObjCombo(subj, obj) {
    const firstPeople = [
        T.Person.FirstSingMale,
        T.Person.FirstSingFemale,
        T.Person.FirstPlurMale,
        T.Person.FirstPlurFemale,
    ];
    const secondPeople = [
        T.Person.SecondSingMale,
        T.Person.SecondSingFemale,
        T.Person.SecondPlurMale,
        T.Person.SecondPlurFemale,
    ];
    return ((firstPeople.includes(subj) && firstPeople.includes(obj)) ||
        (secondPeople.includes(subj) && secondPeople.includes(obj)));
}
export function getPersonFromNP(np) {
    if (np === "none") {
        return undefined;
    }
    if (typeof np === "number")
        return np;
    if (np.selection.type === "participle") {
        return T.Person.ThirdPlurMale;
    }
    if (np.selection.type === "pronoun") {
        return np.selection.person;
    }
    return np.selection.number === "plural"
        ? np.selection.gender === "masc"
            ? T.Person.ThirdPlurMale
            : T.Person.ThirdPlurFemale
        : np.selection.gender === "masc"
            ? T.Person.ThirdSingMale
            : T.Person.ThirdSingFemale;
}
export function removeBa(ps) {
    return psRemove(ps, concatPsString(grammarUnits.baParticle, " "));
}
export function getTenseFromVerbSelection(vs) {
    function verbTenseToModalTense(tn) {
        if (tn === "presentVerb") {
            return "presentVerbModal";
        }
        if (tn === "subjunctiveVerb") {
            return "subjunctiveVerbModal";
        }
        if (tn === "imperfectiveFuture") {
            return "imperfectiveFutureModal";
        }
        if (tn === "perfectiveFuture") {
            return "perfectiveFutureModal";
        }
        if (tn === "perfectivePast") {
            return "perfectivePastModal";
        }
        if (tn === "imperfectivePast") {
            return "imperfectivePastModal";
        }
        if (tn === "habitualImperfectivePast") {
            return "habitualImperfectivePastModal";
        }
        if (tn === "habitualPerfectivePast") {
            return "habitualPerfectivePastModal";
        }
        throw new Error("can't convert non verbTense to modalTense");
    }
    if (vs.tenseCategory === "basic") {
        return vs.verbTense;
    }
    if (vs.tenseCategory === "perfect") {
        return vs.perfectTense;
    }
    if (vs.tenseCategory === "imperative") {
        return vs.imperativeTense;
    }
    // vs.tenseCategory === "modal"
    return verbTenseToModalTense(vs.verbTense);
}
export function isPastTense(tense) {
    if (isPerfectTense(tense))
        return true;
    return tense.toLowerCase().includes("past");
}
export function perfectTenseHasBa(tense) {
    const withBa = [
        "futurePerfect",
        "wouldBePerfect",
        "wouldHaveBeenPerfect",
    ];
    return withBa.includes(tense);
}
export function removeDuplicates(psv) {
    return psv.filter((ps, i, arr) => i === arr.findIndex((t) => psStringEquals(t, ps)));
}
export function switchSubjObj(vps) {
    const subject = getSubjectSelection(vps.blocks).selection;
    const object = getObjectSelection(vps.blocks).selection;
    if ("tenseCategory" in vps.verb) {
        if (!subject ||
            !(typeof object === "object") ||
            vps.verb.tenseCategory === "imperative") {
            return vps;
        }
        return {
            ...vps,
            blocks: adjustObjectSelection(adjustSubjectSelection(object)(vps.blocks), subject),
        };
    }
    if (!subject || !vps.verb || !(typeof object === "object")) {
        return vps;
    }
    return {
        ...vps,
        blocks: adjustObjectSelection(adjustSubjectSelection(object)(vps.blocks), subject),
    };
}
export function completeVPSelection(vps) {
    if (!VPSBlocksAreComplete(vps.blocks)) {
        return undefined;
    }
    return {
        ...vps,
        verb: {
            ...vps.verb,
            tense: getTenseFromVerbSelection(vps.verb),
        },
        blocks: vps.blocks,
    };
}
export function uncompleteVPSelection(vps) {
    const tense = vps.verb.tense;
    const tenseCategory = isVerbTense(tense)
        ? "basic"
        : isPerfectTense(tense)
            ? "perfect"
            : isImperativeTense(tense)
                ? "imperative"
                : "modal";
    return {
        ...vps,
        verb: {
            ...vps.verb,
            verbTense: tenseCategory === "basic"
                ? tense
                : tenseCategory === "modal"
                    ? tense.slice(0, -5)
                    : "presentVerb",
            perfectTense: tenseCategory === "perfect"
                ? tense
                : "presentPerfect",
            imperativeTense: tenseCategory === "imperative"
                ? tense
                : "imperfectiveImperative",
            tenseCategory,
        },
    };
}
export function isThirdPerson(p) {
    return (p === T.Person.ThirdSingMale ||
        p === T.Person.ThirdSingFemale ||
        p === T.Person.ThirdPlurMale ||
        p === T.Person.ThirdPlurFemale);
}
export function ensure2ndPersSubjPronounAndNoConflict(vps) {
    const subject = getSubjectSelection(vps.blocks).selection;
    const object = getObjectSelection(vps.blocks).selection;
    const subjIs2ndPerson = subject?.selection.type === "pronoun" &&
        isSecondPerson(subject.selection.person);
    const objIs2ndPerson = typeof object === "object" &&
        object.selection.type === "pronoun" &&
        isSecondPerson(object.selection.person);
    const default2ndPersSubject = {
        type: "NP",
        selection: {
            type: "pronoun",
            distance: "far",
            person: T.Person.SecondSingMale,
        },
    };
    function getNon2ndPersPronoun() {
        let newObjPerson;
        do {
            newObjPerson = randomNumber(0, 12);
        } while (isSecondPerson(newObjPerson));
        return newObjPerson;
    }
    if (subjIs2ndPerson && !objIs2ndPerson) {
        return vps;
    }
    if (subjIs2ndPerson && objIs2ndPerson) {
        if (typeof object !== "object" || object.selection.type !== "pronoun") {
            return vps;
        }
        return {
            ...vps,
            blocks: adjustObjectSelection(vps.blocks, {
                type: "NP",
                selection: {
                    ...object.selection,
                    person: getNon2ndPersPronoun(),
                },
            }),
        };
    }
    if (!subjIs2ndPerson && objIs2ndPerson) {
        if (typeof object !== "object" || object.selection.type !== "pronoun") {
            return {
                ...vps,
                blocks: adjustSubjectSelection(default2ndPersSubject)(vps.blocks),
            };
        }
        return {
            ...vps,
            blocks: adjustObjectSelection(adjustSubjectSelection(default2ndPersSubject)(vps.blocks), {
                type: "NP",
                selection: {
                    ...object.selection,
                    person: getNon2ndPersPronoun(),
                },
            }),
        };
    }
    if (!subjIs2ndPerson && !objIs2ndPerson) {
        return {
            ...vps,
            blocks: adjustSubjectSelection(default2ndPersSubject)(vps.blocks),
        };
    }
    throw new Error("error ensuring compatible VPSelection for imperative verb");
}
// NOT USING THIS ANYMORE - gonna allow things like لانه ړ
// export function ensureNoHangingR(b: T.Block[]): T.Block[] {
//   return b.map((x) =>
//     x.block.type === "VB" &&
//     "short" in x.block.ps &&
//     x.block.ps.short.find((x) => x.p === "ړ")
//       ? {
//           ...x,
//           block: {
//             ...x.block,
//             ps: {
//               ...x.block.ps,
//               short: x.block.ps.short.filter((ps) => ps.p !== "ړ"),
//             },
//           },
//         }
//       : x,
//   );
// }
export function takesExternalComplement(v) {
    if (v.entry.c.includes("w. compl.")) {
        return "req";
    }
    if (v.entry.c.includes("opt. compl.")) {
        return "opt";
    }
    return "no";
}
