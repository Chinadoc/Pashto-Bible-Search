import * as T from "../../types";

// This file will contain the definitions for the new irregular verbs.

export const leedul: T.VerbConjugation = {
  info: {
    entry: {
      p: "لیدل",
      f: "leedúl",
      i: 0,
      ts: 0,
      g: "leedul",
      e: "to see",
      c: "v. trans.",
    },
    transitivity: "transitive",
    yulEnding: false,
    stem: {
      imperfective: {
        long: { p: "وین", f: "ween" },
        short: { p: "وین", f: "ween" },
      },
      perfective: {
        long: { p: "ووین", f: "óoween" },
        short: { p: "ووین", f: "óoween" },
      },
    },
    root: {
      imperfective: {
        long: { p: "لیدل", f: "leedúl" },
        short: { p: "لید", f: "leed" },
      },
      perfective: {
        long: { p: "ولیدل", f: "óoleedul" },
        short: { p: "ولید", f: "óoleed" },
      },
    },
    participle: {
      present: {
        long: { p: "لیدونکی", f: "leedúnkay" },
        short: { p: "لیدونک", f: "leedúnk" },
      },
      past: {
        long: { p: "لیدلی", f: "leedúlay" },
        short: { p: "لیدل", f: "leedúl" },
      },
    },
    type: "simple",
  },
  imperfective: {
    nonImperative: {
      long: [
        [[{ p: "وینم", f: "weenum" }],[{ p: "وینو", f: "weenoo" }]],
        [[{ p: "وینم", f: "weenum" }],[{ p: "وینو", f: "weenoo" }]],
        [[{ p: "وینې", f: "weene" }],[{ p: "وینئ", f: "weeney" }]],
        [[{ p: "وینې", f: "weene" }],[{ p: "وینئ", f: "weeney" }]],
        [[{ p: "ویني", f: "weenee" }],[{ p: "ویني", f: "weenee" }]],
        [[{ p: "ویني", f: "weenee" }],[{ p: "ویني", f: "weenee" }]],
      ],
      short: [
        [[{ p: "وینم", f: "weenum" }],[{ p: "وینو", f: "weenoo" }]],
        [[{ p: "وینم", f: "weenum" }],[{ p: "وینو", f: "weenoo" }]],
        [[{ p: "وینې", f: "weene" }],[{ p: "وینئ", f: "weeney" }]],
        [[{ p: "وینې", f: "weene" }],[{ p: "وینئ", f: "weeney" }]],
        [[{ p: "ویني", f: "weenee" }],[{ p: "ویني", f: "weenee" }]],
        [[{ p: "ویني", f: "weenee" }],[{ p: "ویني", f: "weenee" }]],
      ],
    },
    // Imperfective forms (present tense, etc.)
    // ... to be filled in ...
  },
  perfective: {
    // Perfective forms (past tense, etc.)
    // ... to be filled in ...
  },
  hypothetical: {
    // ... to be filled in ...
  },
  participle: {
    // ... to be filled in ...
  },
  perfect: {
    // ... to be filled in ...
  },
};
