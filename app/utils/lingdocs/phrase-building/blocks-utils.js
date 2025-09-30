import { assertNever } from "../misc-helpers";
import { getLength } from "../p-text-helpers";
export function makeBlock(block, key) {
    return {
        key: key === undefined ? Math.random() : key,
        block,
    };
}
export function makeKid(kid, key) {
    return {
        key: key === undefined ? Math.random() : key,
        kid,
    };
}
export function getSubjectSelection(blocks) {
    const b = blocks.find((f) => f.block?.type === "subjectSelection");
    if (!b || !b.block || b.block.type !== "subjectSelection") {
        throw new Error("subjectSelection not found in blocks");
    }
    return b.block;
}
export function getComplementFromBlocks(blocks) {
    const b = blocks[0].find((f) => f.block.type === "complement");
    return b?.block;
}
export function getSubjectSelectionFromBlocks(blocks) {
    const b = blocks[0].find((f) => f.block.type === "subjectSelection");
    if (!b || b.block.type !== "subjectSelection") {
        throw new Error("subjectSelection not found in blocks");
    }
    return b.block;
}
export function getObjectSelectionFromBlocks(blocks) {
    const b = blocks[0].find((f) => f.block.type === "objectSelection");
    if (!b || b.block.type !== "objectSelection") {
        throw new Error("objectSelection not found in blocks");
    }
    return b.block;
}
export function includesShrunkenServant(kids) {
    if (!kids)
        return false;
    return kids.some((k) => k.kid.type === "mini-pronoun" && k.kid.source === "servant");
}
export function getPredicateBlock(blocks) {
    const b = blocks[0].find((f) => f.block.type === "predicate");
    if (!b) {
        throw new Error("predicate block not found");
    }
    return b.block;
}
export function getAPsFromBlocks(blocks) {
    return blocks[0]
        .filter((b) => b.block.type === "AP")
        .map((b) => b.block);
}
export function getObjectSelection(blocks) {
    const b = blocks.find((f) => f.block?.type === "objectSelection");
    if (!b || !b.block || b.block.type !== "objectSelection") {
        throw new Error("objectSelection not found in blocks");
    }
    return b.block;
}
export function makeEPSBlocks() {
    return [
        {
            key: Math.random(),
            block: {
                type: "subjectSelection",
                selection: undefined,
            },
        },
    ];
}
export function makeAPBlock() {
    return {
        key: Math.random(),
        block: undefined,
    };
}
export function makeSubjectSelection(selection) {
    if (!selection) {
        return {
            type: "subjectSelection",
            selection: undefined,
        };
    }
    if (selection.type === "subjectSelection") {
        return selection;
    }
    if (selection.type === "NP") {
        return {
            type: "subjectSelection",
            selection,
        };
    }
    return {
        type: "subjectSelection",
        selection: {
            type: "NP",
            selection,
        },
    };
}
export function makeSubjectSelectionComplete(selection) {
    return {
        type: "subjectSelection",
        selection,
    };
}
export function makeObjectSelection(selection) {
    if (!selection) {
        return {
            type: "objectSelection",
            selection: undefined,
        };
    }
    if (typeof selection !== "object") {
        return {
            type: "objectSelection",
            selection,
        };
    }
    if (selection.type === "objectSelection") {
        return selection;
    }
    if (selection.type === "NP") {
        return {
            type: "objectSelection",
            selection,
        };
    }
    return {
        type: "objectSelection",
        selection: {
            type: "NP",
            selection,
        },
    };
}
export function makeObjectSelectionComplete(selection) {
    return {
        type: "objectSelection",
        selection,
    };
}
export function EPSBlocksAreComplete(blocks) {
    if (blocks.some((block) => block.block === undefined)) {
        return false;
    }
    const subject = getSubjectSelection(blocks);
    return !!subject.selection;
}
export function VPSBlocksAreComplete(blocks) {
    if (blocks.some((block) => block.block === undefined)) {
        return false;
    }
    const subject = getSubjectSelection(blocks);
    if (!subject.selection)
        return false;
    const object = getObjectSelection(blocks);
    if (!object.selection)
        return false;
    return true;
}
export function adjustSubjectSelection(subject) {
    return function (blocks) {
        const nb = [...blocks];
        const i = nb.findIndex((b) => b.block && b.block.type === "subjectSelection");
        if (i === -1) {
            throw new Error("couldn't find subjectSelection to modify");
        }
        nb[i].block =
            subject?.type === "subjectSelection"
                ? subject
                : makeSubjectSelection(subject);
        return nb;
    };
}
export function adjustObjectSelection(blocks, object) {
    const nb = [...blocks];
    const i = nb.findIndex((b) => b.block && b.block.type === "objectSelection");
    if (i === -1) {
        throw new Error("couldn't find objectSelection to modify");
    }
    nb[i].block =
        typeof object === "object" && object?.type === "objectSelection"
            ? object
            : makeObjectSelection(object);
    return nb;
}
export function moveObjectToEnd(blocks) {
    const i = blocks.findIndex((b) => b.block && b.block.type === "objectSelection");
    if (i === -1) {
        throw new Error("couldn't find objectSelection to move");
    }
    if (i === blocks.length - 1) {
        return blocks;
    }
    return arrayMove(blocks, i, blocks.length - 1);
}
export function shiftBlock(index, direction) {
    return function (blocks) {
        const newIndex = index +
            (direction === "forward"
                ? 1 // (isNoObject(blocks[index + 1].block) ? 2 : 1)
                : -1); // (isNoObject(blocks[index - 1].block) ? -2 : -2)
        return arrayMove(blocks, index, newIndex);
    };
}
export function insertNewAP(blocks) {
    return [makeAPBlock(), ...blocks];
}
export function setAP(index, AP) {
    return function (blocks) {
        const nBlocks = [...blocks];
        nBlocks[index].block = AP;
        return nBlocks;
    };
}
export function removeAP(index) {
    return function (blocks) {
        const nBlocks = [...blocks];
        nBlocks.splice(index, 1);
        return nBlocks;
    };
}
export function isNoObject(b) {
    return !!(b && b.type === "objectSelection" && b.selection === "none");
}
export function specifyEquativeLength(blocksWVars, length) {
    function specify(blocks) {
        const i = blocks.findIndex((b) => b.block.type === "equative");
        if (i === -1)
            throw new Error("equative block not found in EPRendered");
        const eq = blocks[i];
        if (eq.block.type !== "equative")
            throw new Error("error searching for equative block");
        const adjusted = [...blocks];
        adjusted[i] = {
            ...eq,
            block: {
                ...eq.block,
                equative: {
                    ...eq.block.equative,
                    ps: getLength(eq.block.equative.ps, length),
                },
            },
        };
        return adjusted;
    }
    return blocksWVars.map(specify);
}
export function isRenderedVerbB({ block }) {
    if (block.type === "equative") {
        return true;
    }
    if (block.type === "VB") {
        return true;
    }
    if (block.type === "PH") {
        return true;
    }
    if (block.type === "NComp") {
        return true;
    }
    if (block.type === "welded") {
        return true;
    }
    if (block.type === "complement") {
        return true;
    }
    return false;
}
export function hasEquativeWithLengths(blocks) {
    const equative = blocks[0].find((x) => x.block.type === "equative");
    if (!equative)
        throw new Error("equative not found in blocks");
    if (equative.block.type !== "equative")
        throw new Error("error finding equative in blocks");
    return "long" in equative.block.equative.ps;
}
function arrayMove(ar, old_index, new_index) {
    const arr = [...ar];
    const new_i = new_index >= arr.length ? arr.length - 1 : new_index < 0 ? 0 : new_index;
    arr.splice(new_i, 0, arr.splice(old_index, 1)[0]);
    return arr;
}
// TODO: This takes 8 helper functions to recursively go down and check all determiners
//  - is this what LENSES would help with?
export function removeHeetsDet(blocks) {
    return blocks.map((x) => ({
        key: x.key,
        block: removeHeetsDetFromBlock(x.block),
    }));
}
// TODO: Could use lenses for this
function removeHeetsDetFromBlock(block) {
    if (!block) {
        return block;
    }
    if (block.type === "AP") {
        return removeHeetsDetFromAP(block);
    }
    if (block.type === "complement") {
        return removeHeetsFromComp(block);
    }
    return {
        ...block,
        selection: typeof block.selection === "object"
            ? removeHeetsFromNP(block.selection)
            : block.selection,
    };
}
function removeHeetsDetFromAP(ap) {
    if (ap.selection.type === "adverb") {
        return ap;
    }
    return {
        ...ap,
        selection: removeHeetsFromSandwich(ap.selection),
    };
}
function removeHeetsFromSandwich(sand) {
    return {
        ...sand,
        inside: removeHeetsFromNP(sand.inside),
    };
}
function removeHeetsFromAdjective(adj) {
    return {
        ...adj,
        sandwich: adj.sandwich ? removeHeetsFromSandwich(adj.sandwich) : undefined,
    };
}
function removeHeetsFromComp(comp) {
    if (comp.selection.type === "adjective") {
        return {
            ...comp,
            selection: removeHeetsFromAdjective(comp.selection),
        };
    }
    if (comp.selection.type === "NP") {
        return {
            ...comp,
            selection: removeHeetsFromNP(comp.selection),
        };
    }
    if (comp.selection.type === "sandwich") {
        return {
            ...comp,
            selection: removeHeetsFromSandwich(comp.selection),
        };
    }
    if (comp.selection.type === "possesor") {
        return {
            ...comp,
            selection: {
                ...comp.selection,
                np: removeHeetsFromNP(comp.selection.np),
            },
        };
    }
    if (comp.selection.type === "comp. noun" ||
        comp.selection.type === "loc. adv.") {
        return comp;
    }
    assertNever(comp.selection, "unknown complement type");
}
function removeHeetsFromNoun(n) {
    return {
        ...n,
        adjectives: n.adjectives.map(removeHeetsFromAdjective),
        ...(n.determiners
            ? {
                determiners: removeHeetsFromDets(n.determiners),
            }
            : {}),
    };
}
function removeHeetsFromNP(np) {
    if (np.selection.type === "noun") {
        return {
            ...np,
            selection: removeHeetsFromNoun(np.selection),
        };
    }
    return np;
}
function removeHeetsFromDets(dets) {
    if (!dets) {
        return dets;
    }
    return {
        ...dets,
        determiners: dets.determiners.filter((d) => d.determiner.p !== "هیڅ"),
    };
}
