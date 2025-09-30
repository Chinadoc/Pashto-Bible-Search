import { struct } from "fp-ts/Eq";
import { concatAll } from "fp-ts/lib/Monoid";
import * as S from "fp-ts/string";
export const eqPsString = struct({
    p: S.Eq,
    f: S.Eq,
});
export const eqPsStringWVars = {
    equals: (x, y) => {
        return (x.length === y.length && x.every((a, i) => eqPsString.equals(a, y[i])));
    },
};
export const semigroupPsStringWVars = {
    concat: (x, y) => x.flatMap((a) => y.map((b) => semigroupPsString.concat(a, b))),
};
export const semigroupPsString = {
    concat: (x, y) => ({
        p: x.p + y.p,
        f: x.f + y.f,
    }),
};
export const semigroupInflectionSet = {
    concat: (x, y) => y.map((yy, i) => concatAll(monoidPsStringWVars)([x[i], [{ p: " ", f: " " }], yy])),
};
export const semigroupPluralInflectionSet = {
    concat: (x, y) => y.map((yy, i) => concatAll(monoidPsStringWVars)([x[i], [{ p: " ", f: " " }], yy])),
};
export const monoidPsString = {
    concat: semigroupPsString.concat,
    empty: {
        p: "",
        f: "",
    },
};
export const monoidPsStringWVars = {
    concat: semigroupPsStringWVars.concat,
    empty: [monoidPsString.empty],
};
export function fmapParseResult(f, x) {
    return x.map((xi) => ({
        tokens: xi.tokens,
        body: f(xi.body),
        errors: xi.errors,
    }));
}
export function fmapParseResultSing(f, x) {
    return {
        tokens: x.tokens,
        body: f(x.body),
        errors: x.errors,
    };
}
export function fFlatMapParseResult(f, x) {
    return x.flatMap((xi) => {
        const bodies = f(xi.body);
        return bodies.map((body) => ({
            tokens: xi.tokens,
            body,
            errors: xi.errors,
        }));
    });
}
export function fmapSingleOrLengthOpts(f, x) {
    if (x && typeof x === "object" && "long" in x) {
        return {
            long: f(x.long),
            short: f(x.short),
            ...("mini" in x && x.mini
                ? {
                    mini: f(x.mini),
                }
                : {}),
        };
    }
    else {
        return f(x);
    }
}
export function pureSingleOrLengthOpts(a) {
    return a;
}
export function applyPsString(f, x) {
    if ("p" in f && "f" in f) {
        return {
            p: f.p(x.p),
            f: f.f(x.f),
        };
    }
    if ("p" in f) {
        return {
            p: f.p(x.p),
            f: x.f,
        };
    }
    return {
        p: x.p,
        f: f.f(x.f),
    };
}
export function mapGen(f, x) {
    return f(x);
}
/**
 * like and applicative <*> operator for SingleOrLengthOpts
 *
 * applies the appropriate length function for each type of given length, otherwise applies
 * the long version as the default
 *
 * allows us to put transformation functions in the SingleOrLengthOpts data structure
 * instead of
 */
export function applySingleOrLengthOpts(f, a) {
    if (f && "long" in f) {
        if (a && typeof a === "object" && "long" in a) {
            return {
                long: fmapSingleOrLengthOpts(f.long, a.long),
                short: fmapSingleOrLengthOpts(f.short, a.short),
                ...(a.mini
                    ? {
                        mini: fmapSingleOrLengthOpts(f.mini || f.short, a.mini),
                    }
                    : {}),
            };
        }
        else {
            return fmapSingleOrLengthOpts(f.long, a);
        }
    }
    else {
        return fmapSingleOrLengthOpts(f, a);
    }
}
export function mapInflections(f, inf) {
    function handleSide(inf) {
        return inf.map((x) => x.map(f));
    }
    return {
        masc: handleSide(inf.masc),
        fem: handleSide(inf.fem),
    };
}
export function mapVerbRenderedOutput(f, [a, b]) {
    return [fmapVHead(a), fmapVE(b)];
    function fmapVHead([v]) {
        if (v === undefined) {
            return [];
        }
        if (v.type === "PH") {
            return [
                {
                    ...v,
                    ps: f(v.ps),
                },
            ];
        }
        return [
            {
                ...v,
                comp: fmapComp(v.comp),
            },
        ];
    }
    function fmapComp(comp) {
        return {
            ...comp,
            ps: f(comp.ps),
        };
    }
    function fmapVE(v) {
        return v.map(fmapVB);
    }
    function fmapVB(v) {
        if (v.type === "welded") {
            return {
                ...v,
                left: fmapWeldedLeft(v.left),
                right: fmapVB(v.right),
            };
        }
        return {
            ...v,
            ps: fmapSingleOrLengthOpts((x) => x.map(f), v.ps),
        };
    }
    function fmapWeldedLeft(v) {
        if (v.type === "NComp") {
            return {
                ...v,
                comp: fmapComp(v.comp),
            };
        }
        return fmapVB(v);
    }
}
/**
 * a type predicate OR combinator
 */
export function orTp(f, g) {
    return (x) => f(x) || g(x);
}
/**
 * a type predicate AND combinator
 */
export function andTp(f, g) {
    return (x) => f(x) && g(x);
}
/**
 * a type predicate successive AND combinator
 * the second predicate is based on the first predicate
 * being true and narrows the type further
 */
export function andSuccTp(f, g) {
    return (x) => f(x) && g(x);
}
