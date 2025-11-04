-- Integrate LingDocs irregular conjugations into D1 database
-- This adds comprehensive conjugation forms for irregular verbs
-- Generated from LingDocs pashto-inflector irregular-conjugations.ts

INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږ',
  'وش',
  'وشول',
  'شوی',
  'v. irreg.',
  NULL,
  strftime('%s', 'now')
);
INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  'کول',
  'کو',
  'وکړ',
  'وکړ',
  'کړی',
  'v. irreg.',
  NULL,
  strftime('%s', 'now')
);
INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  'تلل',
  'ځ',
  'لاړ ش',
  'لاړل',
  'تللی',
  'v. irreg.',
  NULL,
  strftime('%s', 'now')
);
INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکو',
  'ورکړ',
  'ورکړ',
  'ورکړی',
  'v. irreg.',
  NULL,
  strftime('%s', 'now')
);
INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  'درکول',
  'درکو',
  'درکړ',
  'درکړ',
  'درکړی',
  'v. irreg.',
  NULL,
  strftime('%s', 'now')
);
INSERT OR REPLACE INTO verbs_lexicon 
(verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, updated_at)
VALUES (
  'راکول',
  'راکو',
  'راکړ',
  'راکړ',
  'راکړی',
  'v. irreg.',
  NULL,
  strftime('%s', 'now')
);

-- Create verb_forms table if it doesn't exist
CREATE TABLE IF NOT EXISTS verb_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verb_root TEXT NOT NULL,
  form TEXT NOT NULL,
  form_type TEXT, -- 'present', 'past', 'perfective', 'imperative', 'modal', etc.
  person TEXT, -- '1sg', '2sg', '3sg', '1pl', '2pl', '3pl'
  gender TEXT, -- 'm', 'f'
  number TEXT, -- 'sg', 'pl'
  aspect TEXT, -- 'imperfective', 'perfective'
  tense TEXT, -- 'present', 'past', 'future', etc.
  mood TEXT, -- 'indicative', 'subjunctive', 'imperative', 'modal'
  romanization TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(verb_root, form)
);
CREATE INDEX IF NOT EXISTS idx_verb_forms_root ON verb_forms(verb_root);
CREATE INDEX IF NOT EXISTS idx_verb_forms_form ON verb_forms(form);
CREATE INDEX IF NOT EXISTS idx_verb_forms_type ON verb_forms(form_type);

-- Insert all LingDocs conjugation forms
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږ',
  'kéG',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وش',
  'óosh',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'و',
  'óo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'ش',
  'sh',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدل',
  'kedúl',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېد',
  'ked',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشول',
  'óoshwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشو',
  'óoshw',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شول',
  'shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شو',
  'shw',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدونکی',
  'kedóonkay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی',
  'shúway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږم',
  'kéGum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږو',
  'kéGoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږې',
  'kéGe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږئ',
  'kéGey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږي',
  'kéGee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېږم',
  'ba kéGum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېږو',
  'ba kéGoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېږې',
  'ba kéGe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېږئ',
  'ba kéGey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېږي',
  'ba kéGee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېږه',
  'kéGa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدم',
  'kedum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدو',
  'kedóo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدې',
  'kedé',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدئ',
  'kedéy',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېده',
  'kedu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدلم',
  'kedúlum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدلو',
  'kedúloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدلې',
  'kedúle',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدلئ',
  'kedúley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدله',
  'kedúla',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدم',
  'ba kedum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدو',
  'ba kedóo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدې',
  'ba kedé',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدئ',
  'ba kedéy',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېده',
  'ba kedu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدل',
  'ba kedúl',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدلم',
  'ba kedúlum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدلو',
  'ba kedúloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدلې',
  'ba kedúle',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدلئ',
  'ba kedúley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به کېدله',
  'ba kedúla',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشم',
  'óoshum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشې',
  'óoshe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشئ',
  'óoshey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشي',
  'óoshee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شم',
  'ba shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شو',
  'ba shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شې',
  'ba she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شئ',
  'ba shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شي',
  'ba shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشه',
  'óosha',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشوم',
  'óoshwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشوې',
  'óoshwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشوئ',
  'óoshwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشوه',
  'óoshwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشولم',
  'óoshwulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشولو',
  'óoshwuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشولې',
  'óoshwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشولئ',
  'óoshwuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'وشوله',
  'óoshwulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشوم',
  'ba óoshwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشو',
  'ba óoshoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشوې',
  'ba óoshwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشوئ',
  'ba óoshwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشول',
  'ba óoshwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشوه',
  'ba óoshwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشولم',
  'ba óoshwulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشولو',
  'ba óoshwuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشولې',
  'ba óoshwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشولئ',
  'ba óoshwuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به وشوله',
  'ba óoshwulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدای',
  'kedáay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدلای',
  'kedúlaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي',
  'shúwee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شویو',
  'shúwiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوو',
  'shúwo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې',
  'shúwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدونکي',
  'keedóonkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدونکیو',
  'keedóonkiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدونکو',
  'kedóonko',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'کېدونکې',
  'keedóonke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی وم',
  'shuway wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي وو',
  'shuwee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وم',
  'shuwe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وو',
  'shuwe woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی وې',
  'shuway we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي وئ',
  'shuwee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وې',
  'shuwe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وئ',
  'shuwe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی و',
  'shuway wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وه',
  'shuwe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی یم',
  'shuway yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي یو',
  'shuwee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې یم',
  'shuwe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې یو',
  'shuwe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی یې',
  'shuway ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي یئ',
  'shuwee yey',
  strftime('%s', 'now')
);
-- 100 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې یې',
  'shuwe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې یئ',
  'shuwe yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی دی',
  'shuway day',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي دي',
  'shuwee dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې ده',
  'shuwe da',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې دي',
  'shuwe dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی وي',
  'shuway wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي وي',
  'shuwee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وي',
  'shuwe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی یم',
  'ba shuway yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوي یو',
  'ba shuwee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې یم',
  'ba shuwe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې یو',
  'ba shuwe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی یې',
  'ba shuway ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوي یئ',
  'ba shuwee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې یې',
  'ba shuwe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې یئ',
  'ba shuwe yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی وي',
  'ba shuway wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوي وي',
  'ba shuwee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وي',
  'ba shuwe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی وم',
  'ba shuway wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوي وو',
  'ba shuwee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وم',
  'ba shuwe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وو',
  'ba shuwe woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی وې',
  'ba shuway we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوي وئ',
  'ba shuwee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وې',
  'ba shuwe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وئ',
  'ba shuwe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی و',
  'ba shuway wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وه',
  'ba shuwe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی وای',
  'shuway waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوی وی',
  'shuway way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي وای',
  'shuwee waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوي وی',
  'shuwee way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وای',
  'shuwe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'شوې وی',
  'shuwe way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی وای',
  'ba shuway waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوی وی',
  'ba shuway way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوي وای',
  'ba shuwee waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوي وی',
  'ba shuwee way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وای',
  'ba shuwe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کېدل',
  'به شوې وی',
  'ba shuwe way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کول',
  'kawúl',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کو',
  'kaw',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړل',
  'óokRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړ',
  'óokR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وک',
  'óok',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'و',
  'óo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل',
  'kRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړ',
  'kR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'ک',
  'k',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوونکی',
  'kawóonkay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړی',
  'kúRay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کاوه',
  'kaawú',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوم',
  'kawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوو',
  'kawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوې',
  'kawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوئ',
  'kawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوي',
  'kawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کوم',
  'ba kawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کوو',
  'ba kawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کوې',
  'ba kawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کوئ',
  'ba kawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کوي',
  'ba kawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوه',
  'kawá',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کولم',
  'kawúlum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کولو',
  'kawúloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کولې',
  'kawúle',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کولئ',
  'kawúley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوله',
  'kawúlu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کاوه',
  'ba kaawu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کول',
  'ba kawúl',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کوه',
  'ba kawa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کولم',
  'ba kawúlum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کولو',
  'ba kawúloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کولې',
  'ba kawúle',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کولئ',
  'ba kawúley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کوله',
  'ba kawúlu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړم',
  'óokRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړو',
  'óokRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړې',
  'óokRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړئ',
  'óokRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړي',
  'óokRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکم',
  'óokum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکو',
  'óokoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکې',
  'óoke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکئ',
  'óokey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکي',
  'óokee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړم',
  'ba óokRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړو',
  'ba óokRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړې',
  'ba óokRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړئ',
  'ba óokRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړي',
  'ba óokRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکم',
  'ba óokum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکو',
  'ba óokoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکې',
  'ba óoke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکئ',
  'ba óokey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکي',
  'ba óokee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړه',
  'óokRa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکه',
  'óoka',
  strftime('%s', 'now')
);
-- 200 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړلم',
  'óokRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړلو',
  'óokRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړلې',
  'óokRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړلئ',
  'óokRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'وکړله',
  'óokRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکه',
  'ba óoku',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړل',
  'ba óokRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړه',
  'ba óokRu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړ',
  'ba óokuR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړلم',
  'ba óokRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړلو',
  'ba óokRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړلې',
  'ba óokRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړلئ',
  'ba óokRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به وکړله',
  'ba óokRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړي',
  'kúRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړیو',
  'kúRiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړو',
  'kúRo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړې',
  'kúRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوونکي',
  'kawóonkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوونکیو',
  'kawóonkiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوونکو',
  'kedóonko',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کوونکې',
  'kawóonke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شم',
  'kRul shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شو',
  'kRul shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شې',
  'kRul she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شئ',
  'kRul shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شي',
  'kRul shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شم',
  'ba kRul shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شو',
  'ba kRul shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شې',
  'ba kRul she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شئ',
  'ba kRul shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شي',
  'ba kRul shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شوم',
  'kRul shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شوې',
  'kRul shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شوئ',
  'kRul shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شول',
  'kRul shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شوه',
  'kRul shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شولم',
  'kRul shwulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شولو',
  'kRul shwuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شولې',
  'kRul shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شولئ',
  'kRul shwuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل شوله',
  'kRul shwulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شوم',
  'ba kRul shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شوې',
  'ba kRul shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شوئ',
  'ba kRul shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شول',
  'ba kRul shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شوه',
  'ba kRul shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شولم',
  'ba kRul shwulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شولو',
  'ba kRul shwuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شولې',
  'ba kRul shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شولئ',
  'ba kRul shwuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل شوله',
  'ba kRul shwulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شم',
  'kRul kedúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شم',
  'kRul kedúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شو',
  'kRul kedúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شو',
  'kRul kedúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شې',
  'kRul kedúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شې',
  'kRul kedúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شئ',
  'kRul kedúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شئ',
  'kRul kedúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شي',
  'kRul kedúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شي',
  'kRul kedúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شم',
  'kRul kedáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شم',
  'kRul kedáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شو',
  'kRul kedáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شو',
  'kRul kedáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شې',
  'kRul kedáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شې',
  'kRul kedáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شئ',
  'kRul kedáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شئ',
  'kRul kedáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شي',
  'kRul kedáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شي',
  'kRul kedáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شم',
  'ba kRul kedúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شم',
  'ba kRul kedúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شو',
  'ba kRul kedúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شو',
  'ba kRul kedúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شې',
  'ba kRul kedúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شې',
  'ba kRul kedúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شئ',
  'ba kRul kedúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شئ',
  'ba kRul kedúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شي',
  'ba kRul kedúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شي',
  'ba kRul kedúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شم',
  'ba kRul kedáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شم',
  'ba kRul kedáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شو',
  'ba kRul kedáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شو',
  'ba kRul kedáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شې',
  'ba kRul kedáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شې',
  'ba kRul kedáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شئ',
  'ba kRul kedáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شئ',
  'ba kRul kedáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شي',
  'ba kRul kedáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شي',
  'ba kRul kedáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شوم',
  'kRul kedúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شوم',
  'kRul kedúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شوې',
  'kRul kedúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شوې',
  'kRul kedúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شوئ',
  'kRul kedúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شوئ',
  'kRul kedúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شول',
  'kRul kedúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شول',
  'kRul kedúlaay shwul',
  strftime('%s', 'now')
);
-- 300 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شوه',
  'kRul kedúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شوه',
  'kRul kedúlaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شولې',
  'kRul kedúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شولې',
  'kRul kedúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شوم',
  'kRul kedáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شوم',
  'kRul kedáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شوې',
  'kRul kedáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شوې',
  'kRul kedáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شوئ',
  'kRul kedáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شوئ',
  'kRul kedáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شول',
  'kRul kedáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شول',
  'kRul kedáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شوه',
  'kRul kedáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شوه',
  'kRul kedáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شولې',
  'kRul kedáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شولې',
  'kRul kedáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شوم',
  'ba kRul kedúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شوم',
  'ba kRul kedúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شوې',
  'ba kRul kedúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شوې',
  'ba kRul kedúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شوئ',
  'ba kRul kedúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شوئ',
  'ba kRul kedúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شول',
  'ba kRul kedúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شول',
  'ba kRul kedúlaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شوه',
  'ba kRul kedúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شوه',
  'ba kRul kedúlaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلی شولې',
  'ba kRul kedúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدلای شولې',
  'ba kRul kedúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شوم',
  'ba kRul kedáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شوم',
  'ba kRul kedáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شوې',
  'ba kRul kedáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شوې',
  'ba kRul kedáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شوئ',
  'ba kRul kedáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شوئ',
  'ba kRul kedáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شول',
  'ba kRul kedáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شول',
  'ba kRul kedáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شوه',
  'ba kRul kedáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شوه',
  'ba kRul kedáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدی شولې',
  'ba kRul kedáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'به کړل کېدای شولې',
  'ba kRul kedáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شوای',
  'kRul kedúlay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلی شوی',
  'kRul kedúlay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدلای شوای',
  'kRul kedúlaay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدای شوی',
  'kRul kedúlaay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شوای',
  'kRul kedáy shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'کول',
  'کړل کېدی شوی',
  'kRul kedáy shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ځ',
  'dz',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ ش',
  'laaR sh',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړه ش',
  'laaRa sh',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړې ش',
  'laaRe sh',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ ',
  'láaR ',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ش',
  'sh',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړه ',
  'láaRa ',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړې ',
  'láaRe ',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلل',
  'tlul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تل',
  'tl',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړل',
  'laaRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ',
  'laaR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لا',
  'láa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ړل',
  'Rul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ړ',
  'R',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلونکی',
  'tlóonkay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی',
  'tlúlay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی',
  'túlay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ځم',
  'dzum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ځو',
  'dzoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ځې',
  'dze',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ځئ',
  'dzey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ځي',
  'dzee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به ځم',
  'ba dzum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به ځو',
  'ba dzoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به ځې',
  'ba dze',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به ځئ',
  'ba dzey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به ځي',
  'ba dzee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ځه',
  'dza',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلم',
  'tlum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلو',
  'tloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې',
  'tle',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلئ',
  'tley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تله',
  'tlu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'ته',
  'tu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللم',
  'tlulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللو',
  'tluloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې',
  'tlule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللئ',
  'tluley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلله',
  'tlula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلم',
  'ba tlum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلو',
  'ba tloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې',
  'ba tle',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلئ',
  'ba tley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تله',
  'ba tlu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به ته',
  'ba tu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلل',
  'ba tlul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللم',
  'ba tlulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللو',
  'ba tluloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې',
  'ba tlule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللئ',
  'ba tluley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلله',
  'ba tlula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ شم',
  'láaR shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ شو',
  'láaR shoo',
  strftime('%s', 'now')
);
-- 400 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړه شم',
  'láaRa shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړې شو',
  'láaRe shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ شې',
  'láaR she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ شئ',
  'láaR shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړه شې',
  'láaRa she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړې شئ',
  'láaRe shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ شي',
  'láaR shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړه شي',
  'láaRa shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړې شي',
  'láaRe shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړ شم',
  'ba láaR shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړ شو',
  'ba láaR shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړه شم',
  'ba láaRa shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړې شو',
  'ba láaRe shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړ شې',
  'ba láaR she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړ شئ',
  'ba láaR shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړه شې',
  'ba láaRa she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړې شئ',
  'ba láaRe shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړ شي',
  'ba láaR shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړه شي',
  'ba láaRa shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړې شي',
  'ba láaRe shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړ شه',
  'láaR sha',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړه شه',
  'láaRa sha',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړم',
  'láaRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړو',
  'láaRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړې',
  'láaRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړئ',
  'láaRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړه',
  'láaRu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړلم',
  'láaRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړلو',
  'láaRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړلې',
  'láaRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړلئ',
  'láaRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'لاړله',
  'láaRulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړم',
  'ba láaRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړو',
  'ba láaRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړې',
  'ba láaRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړئ',
  'ba láaRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړه',
  'ba láaRu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړ',
  'ba láaR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړل',
  'ba láaRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړلم',
  'ba láaRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړلو',
  'ba láaRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړلې',
  'ba láaRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړلئ',
  'ba láaRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به لاړله',
  'ba láaRulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلای',
  'túlaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللای',
  'tlúlaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي',
  'tlúlee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللیو',
  'tlúliyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي',
  'túlee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلیو',
  'túliyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلونکي',
  'tlóonkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلونکیو',
  'tlóonkiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلونکو',
  'kedóonko',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلونکې',
  'tlóonke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی وم',
  'túlay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي وو',
  'túlee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وم',
  'túle wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وو',
  'túle woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی وې',
  'túlay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي وئ',
  'túlee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وې',
  'túle we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وئ',
  'túle wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی و',
  'túlay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وه',
  'túle wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی وم',
  'tlúlay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي وو',
  'tlúlee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وم',
  'tlúle wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وو',
  'tlúle woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی وې',
  'tlúlay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي وئ',
  'tlúlee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وې',
  'tlúle we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وئ',
  'tlúle wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی و',
  'tlúlay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وه',
  'tlúle wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی یم',
  'túlay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي یو',
  'túlee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې یم',
  'túle yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې یو',
  'túle yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی یې',
  'túlay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي یئ',
  'túlee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې یې',
  'túle ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې یئ',
  'túle yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی دی',
  'túlay day',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي دي',
  'túlee dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې ده',
  'túle da',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې دي',
  'túle dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی یم',
  'tlúlay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي یو',
  'tlúlee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې یم',
  'tlúle yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې یو',
  'tlúle yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی یې',
  'tlúlay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي یئ',
  'tlúlee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې یې',
  'tlúle ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې یئ',
  'tlúle yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی دی',
  'tlúlay day',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي دي',
  'tlúlee dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې ده',
  'tlúle da',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې دي',
  'tlúle dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی وي',
  'túlay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي وي',
  'túlee wee',
  strftime('%s', 'now')
);
-- 500 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وي',
  'túle wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی وي',
  'tlúlay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي وي',
  'tlúlee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وي',
  'tlúle wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی یم',
  'ba túlay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلي یو',
  'ba túlee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې یم',
  'ba túle yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې یو',
  'ba túle yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی یې',
  'ba túlay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلي یئ',
  'ba túlee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې یې',
  'ba túle ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې یئ',
  'ba túle yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی وي',
  'ba túlay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلي وي',
  'ba túlee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وي',
  'ba túle wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی یم',
  'ba tlúlay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللي یو',
  'ba tlúlee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې یم',
  'ba tlúle yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې یو',
  'ba tlúle yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی یې',
  'ba tlúlay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللي یئ',
  'ba tlúlee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې یې',
  'ba tlúle ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې یئ',
  'ba tlúle yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی وي',
  'ba tlúlay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللي وي',
  'ba tlúlee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وي',
  'ba tlúle wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی وم',
  'ba túlay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلي وو',
  'ba túlee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وم',
  'ba túle wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وو',
  'ba túle woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی وې',
  'ba túlay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلي وئ',
  'ba túlee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وې',
  'ba túle we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وئ',
  'ba túle wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی و',
  'ba túlay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وه',
  'ba túle wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی وم',
  'ba tlúlay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللي وو',
  'ba tlúlee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وم',
  'ba tlúle wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وو',
  'ba tlúle woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی وې',
  'ba tlúlay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللي وئ',
  'ba tlúlee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وې',
  'ba tlúle we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وئ',
  'ba tlúle wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی و',
  'ba tlúlay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وه',
  'ba tlúle wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی وای',
  'túlay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلی وی',
  'túlay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي وای',
  'túlee waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلي وی',
  'túlee way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وای',
  'túle waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تلې وی',
  'túle way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی وای',
  'tlúlay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللی وی',
  'tlúlay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي وای',
  'tlúlee waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللي وی',
  'tlúlee way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وای',
  'tlúle waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'تللې وی',
  'tlúle way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی وای',
  'ba túlay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلی وی',
  'ba túlay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلي وای',
  'ba túlee waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلي وی',
  'ba túlee way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وای',
  'ba túle waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تلې وی',
  'ba túle way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی وای',
  'ba tlúlay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللی وی',
  'ba tlúlay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللي وای',
  'ba tlúlee waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللي وی',
  'ba tlúlee way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وای',
  'ba tlúle waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'تلل',
  'به تللې وی',
  'ba tlúle way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکول',
  'wărkawul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکو',
  'wărkaw',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړل',
  'wărkRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړ',
  'wărkR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورک',
  'wărk',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ور ',
  'wăr ',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'کړل',
  'kRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'کړ',
  'kR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ړ',
  'k',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوونکی',
  'wărkawóonkay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی',
  'wărkúRay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوم',
  'wărkawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوو',
  'wărkawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوې',
  'wărkawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوئ',
  'wărkawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوي',
  'wărkawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوم',
  'ba wărkawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوو',
  'ba wărkawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوې',
  'ba wărkawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوئ',
  'ba wărkawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوي',
  'ba wărkawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوه',
  'wărkawá',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکاوه',
  'wărkaawu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولم',
  'wărkawulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولو',
  'wărkawuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولې',
  'wărkawule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولئ',
  'wărkawuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوله',
  'wărkawulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکاوه',
  'ba wărkaawu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکول',
  'ba wărkawul',
  strftime('%s', 'now')
);
-- 600 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوه',
  'ba wărkawa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولم',
  'ba wărkawulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولو',
  'ba wărkawuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولې',
  'ba wărkawule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولئ',
  'ba wărkawuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوله',
  'ba wărkawulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شم',
  'wărkawúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شم',
  'wărkawúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شو',
  'wărkawúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شو',
  'wărkawúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شې',
  'wărkawúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شې',
  'wărkawúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شئ',
  'wărkawúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شئ',
  'wărkawúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شي',
  'wărkawúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شي',
  'wărkawúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شم',
  'wărkawáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شم',
  'wărkawáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شو',
  'wărkawáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شو',
  'wărkawáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شې',
  'wărkawáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شې',
  'wărkawáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شئ',
  'wărkawáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شئ',
  'wărkawáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شي',
  'wărkawáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شي',
  'wărkawáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شم',
  'ba wărkawúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شم',
  'ba wărkawúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شو',
  'ba wărkawúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شو',
  'ba wărkawúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شې',
  'ba wărkawúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شې',
  'ba wărkawúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شئ',
  'ba wărkawúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شئ',
  'ba wărkawúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شي',
  'ba wărkawúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شي',
  'ba wărkawúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شم',
  'ba wărkawáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شم',
  'ba wărkawáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شو',
  'ba wărkawáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شو',
  'ba wărkawáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شې',
  'ba wărkawáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شې',
  'ba wărkawáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شئ',
  'ba wărkawáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شئ',
  'ba wărkawáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شي',
  'ba wărkawáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شي',
  'ba wărkawáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شوم',
  'wărkawúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شوم',
  'wărkawúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شوې',
  'wărkawúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شوې',
  'wărkawúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شوئ',
  'wărkawúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شوئ',
  'wărkawúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شول',
  'wărkawúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شول',
  'wărkawúlaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شوه',
  'wărkawúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شوه',
  'wărkawúlaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شولې',
  'wărkawúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شولې',
  'wărkawúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شوم',
  'wărkawáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شوم',
  'wărkawáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شوې',
  'wărkawáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شوې',
  'wărkawáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شوئ',
  'wărkawáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شوئ',
  'wărkawáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شول',
  'wărkawáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شول',
  'wărkawáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شوه',
  'wărkawáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شوه',
  'wărkawáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شولې',
  'wărkawáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شولې',
  'wărkawáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شوم',
  'ba wărkawúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شوم',
  'ba wărkawúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شوې',
  'ba wărkawúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شوې',
  'ba wărkawúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شوئ',
  'ba wărkawúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شوئ',
  'ba wărkawúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شول',
  'ba wărkawúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شول',
  'ba wărkawúlaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شوه',
  'ba wărkawúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شوه',
  'ba wărkawúlaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولی شولې',
  'ba wărkawúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکولای شولې',
  'ba wărkawúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شوم',
  'ba wărkawáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شوم',
  'ba wărkawáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شوې',
  'ba wărkawáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شوې',
  'ba wărkawáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شوئ',
  'ba wărkawáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شوئ',
  'ba wărkawáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شول',
  'ba wărkawáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شول',
  'ba wărkawáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شوه',
  'ba wărkawáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شوه',
  'ba wărkawáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوی شولې',
  'ba wărkawáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکوای شولې',
  'ba wărkawáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شوای',
  'wărkawúlay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی شوی',
  'wărkawúlay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای شوای',
  'wărkawúlaay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شوای',
  'wărkawáy shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی شوی',
  'wărkawáy shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای شوای',
  'wărkawáay shwaay',
  strftime('%s', 'now')
);
-- 700 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړم',
  'wărkRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړو',
  'wărkRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې',
  'wărkRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړئ',
  'wărkRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړي',
  'wărkRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکم',
  'wărkum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکې',
  'wărke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکئ',
  'wărkey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکي',
  'wărkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړم',
  'ba wărkRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړو',
  'ba wărkRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې',
  'ba wărkRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړئ',
  'ba wărkRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړي',
  'ba wărkRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکم',
  'ba wărkum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکو',
  'ba wărkoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکې',
  'ba wărke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکئ',
  'ba wărkey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکي',
  'ba wărkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړه',
  'wărkRa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکه',
  'wărka',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلم',
  'wărkRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلو',
  'wărkRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلې',
  'wărkRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلئ',
  'wărkRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړله',
  'wărkRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکه',
  'ba wărku',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړل',
  'ba wărkRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړه',
  'ba wărkRu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړ',
  'ba wărkuR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلم',
  'ba wărkRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلو',
  'ba wărkRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلې',
  'ba wărkRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلئ',
  'ba wărkRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړله',
  'ba wărkRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شم',
  'wărkRulay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شم',
  'wărkRulaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شو',
  'wărkRulay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شو',
  'wărkRulaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شې',
  'wărkRulay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شې',
  'wărkRulaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شئ',
  'wărkRulay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شئ',
  'wărkRulaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شي',
  'wărkRulay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شي',
  'wărkRulaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شم',
  'wărkRay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شم',
  'wărkRáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شو',
  'wărkRay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شو',
  'wărkRáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شې',
  'wărkRay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شې',
  'wărkRáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شئ',
  'wărkRay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شئ',
  'wărkRáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شي',
  'wărkRay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شي',
  'wărkRáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شم',
  'ba wărkRulay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شم',
  'ba wărkRulaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شو',
  'ba wărkRulay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شو',
  'ba wărkRulaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شې',
  'ba wărkRulay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شې',
  'ba wărkRulaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شئ',
  'ba wărkRulay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شئ',
  'ba wărkRulaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شي',
  'ba wărkRulay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شي',
  'ba wărkRulaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شم',
  'ba wărkRay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شم',
  'ba wărkRáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شو',
  'ba wărkRay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شو',
  'ba wărkRáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شې',
  'ba wărkRay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شې',
  'ba wărkRáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شئ',
  'ba wărkRay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شئ',
  'ba wărkRáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شي',
  'ba wărkRay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شي',
  'ba wărkRáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شوم',
  'wărkRulay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شوم',
  'wărkRulaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شوې',
  'wărkRulay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شوې',
  'wărkRulaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شوئ',
  'wărkRulay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شوئ',
  'wărkRulaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شول',
  'wărkRulay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شول',
  'wărkRulaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شوه',
  'wărkRulay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شوه',
  'wărkRulaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شولې',
  'wărkRulay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شولې',
  'wărkRulaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شوم',
  'wărkRay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شوم',
  'wărkRáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شوې',
  'wărkRay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شوې',
  'wărkRáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شوئ',
  'wărkRay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شوئ',
  'wărkRáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شول',
  'wărkRay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شول',
  'wărkRáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شوه',
  'wărkRay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شوه',
  'wărkRáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شولې',
  'wărkRay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شولې',
  'wărkRáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شوم',
  'ba wărkRulay shwum',
  strftime('%s', 'now')
);
-- 800 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شوم',
  'ba wărkRulaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شوې',
  'ba wărkRulay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شوې',
  'ba wărkRulaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شوئ',
  'ba wărkRulay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شوئ',
  'ba wărkRulaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شول',
  'ba wărkRulay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شول',
  'ba wărkRulaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شوه',
  'ba wărkRulay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شوه',
  'ba wărkRulaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلی شولې',
  'ba wărkRulay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړلای شولې',
  'ba wărkRulaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شوم',
  'ba wărkRay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شوم',
  'ba wărkRáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شوې',
  'ba wărkRay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شوې',
  'ba wărkRáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شوئ',
  'ba wărkRay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شوئ',
  'ba wărkRáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شول',
  'ba wărkRay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شول',
  'ba wărkRáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شوه',
  'ba wărkRay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شوه',
  'ba wărkRáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی شولې',
  'ba wărkRay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړای شولې',
  'ba wărkRáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شوای',
  'wărkRulay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلی شوی',
  'wărkRulay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړلای شوای',
  'wărkRulaay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شوای',
  'wărkRay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی شوی',
  'wărkRay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړای شوای',
  'wărkRáay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوی',
  'wărkawáy',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوای',
  'wărkawáay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولی',
  'wărkawúlay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکولای',
  'wărkawúlaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړیو',
  'wărkúRiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوونکي',
  'wărkawóonkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوونکیو',
  'wărkawóonkiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوونکو',
  'wărkedóonko',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکوونکې',
  'wărkawóonke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی وم',
  'wărkúRay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړي وو',
  'wărkúRee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وم',
  'wărkúRe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وو',
  'wărkúRe woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی وې',
  'wărkúRay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړي وئ',
  'wărkúRee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وې',
  'wărkúRe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وئ',
  'wărkúRe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی و',
  'wărkúRay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وه',
  'wărkúRe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی یم',
  'wărkúRay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړي یو',
  'wărkúRee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې یم',
  'wărkúRe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې یو',
  'wărkúRe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی یې',
  'wărkúRay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړي یئ',
  'wărkúRee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې یې',
  'wărkúRe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې یئ',
  'wărkúRe yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی دی',
  'wărkúRay day',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړي دي',
  'wărkúRee dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې ده',
  'wărkúRe da',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې دي',
  'wărkúRe dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی وي',
  'wărkúRay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړي وي',
  'wărkúRee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وي',
  'wărkúRe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی یم',
  'ba wărkúRay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړي یو',
  'ba wărkúRee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې یم',
  'ba wărkúRe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې یو',
  'ba wărkúRe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی یې',
  'ba wărkúRay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړي یئ',
  'ba wărkúRee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې یې',
  'ba wărkúRe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې یئ',
  'ba wărkúRe yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی وي',
  'ba wărkúRay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړي وي',
  'ba wărkúRee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وي',
  'ba wărkúRe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی وم',
  'ba wărkúRay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړي وو',
  'ba wărkúRee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وم',
  'ba wărkúRe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وو',
  'ba wărkúRe woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی وې',
  'ba wărkúRay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړي وئ',
  'ba wărkúRee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وې',
  'ba wărkúRe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وئ',
  'ba wărkúRe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی و',
  'ba wărkúRay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وه',
  'ba wărkúRe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی وای',
  'wărkúRay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړی وی',
  'wărkúRay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وای',
  'wărkúRe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'ورکړې وی',
  'wărkúRe way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی وای',
  'ba wărkúRay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړی وی',
  'ba wărkúRay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وای',
  'ba wărkúRe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'ورکول',
  'به ورکړې وی',
  'ba wărkúRe way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکول',
  'dărkawul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکو',
  'dărkaw',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړل',
  'dărkRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړ',
  'dărkR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درک',
  'dărk',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'در ',
  'dăr ',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'کړل',
  'kRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'کړ',
  'kR',
  strftime('%s', 'now')
);
-- 900 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'ړ',
  'k',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوونکی',
  'dărkawóonkay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی',
  'dărkúRay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوم',
  'dărkawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوو',
  'dărkawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوې',
  'dărkawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوئ',
  'dărkawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوي',
  'dărkawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوم',
  'ba dărkawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوو',
  'ba dărkawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوې',
  'ba dărkawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوئ',
  'ba dărkawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوي',
  'ba dărkawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوه',
  'dărkawá',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکاوه',
  'dărkaawu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولم',
  'dărkawulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولو',
  'dărkawuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولې',
  'dărkawule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولئ',
  'dărkawuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوله',
  'dărkawulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکاوه',
  'ba dărkaawu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکول',
  'ba dărkawul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوه',
  'ba dărkawa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولم',
  'ba dărkawulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولو',
  'ba dărkawuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولې',
  'ba dărkawule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولئ',
  'ba dărkawuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوله',
  'ba dărkawulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شم',
  'dărkawúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شم',
  'dărkawúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شو',
  'dărkawúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شو',
  'dărkawúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شې',
  'dărkawúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شې',
  'dărkawúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شئ',
  'dărkawúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شئ',
  'dărkawúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شي',
  'dărkawúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شي',
  'dărkawúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شم',
  'dărkawáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شم',
  'dărkawáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شو',
  'dărkawáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شو',
  'dărkawáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شې',
  'dărkawáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شې',
  'dărkawáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شئ',
  'dărkawáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شئ',
  'dărkawáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شي',
  'dărkawáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شي',
  'dărkawáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شم',
  'ba dărkawúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شم',
  'ba dărkawúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شو',
  'ba dărkawúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شو',
  'ba dărkawúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شې',
  'ba dărkawúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شې',
  'ba dărkawúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شئ',
  'ba dărkawúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شئ',
  'ba dărkawúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شي',
  'ba dărkawúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شي',
  'ba dărkawúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شم',
  'ba dărkawáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شم',
  'ba dărkawáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شو',
  'ba dărkawáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شو',
  'ba dărkawáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شې',
  'ba dărkawáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شې',
  'ba dărkawáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شئ',
  'ba dărkawáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شئ',
  'ba dărkawáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شي',
  'ba dărkawáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شي',
  'ba dărkawáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شوم',
  'dărkawúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شوم',
  'dărkawúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شوې',
  'dărkawúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شوې',
  'dărkawúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شوئ',
  'dărkawúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شوئ',
  'dărkawúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شول',
  'dărkawúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شول',
  'dărkawúlaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شوه',
  'dărkawúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شوه',
  'dărkawúlaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شولې',
  'dărkawúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شولې',
  'dărkawúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شوم',
  'dărkawáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شوم',
  'dărkawáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شوې',
  'dărkawáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شوې',
  'dărkawáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شوئ',
  'dărkawáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شوئ',
  'dărkawáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شول',
  'dărkawáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شول',
  'dărkawáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شوه',
  'dărkawáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شوه',
  'dărkawáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شولې',
  'dărkawáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شولې',
  'dărkawáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شوم',
  'ba dărkawúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شوم',
  'ba dărkawúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شوې',
  'ba dărkawúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شوې',
  'ba dărkawúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شوئ',
  'ba dărkawúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شوئ',
  'ba dărkawúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شول',
  'ba dărkawúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شول',
  'ba dărkawúlaay shwul',
  strftime('%s', 'now')
);
-- 1000 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شوه',
  'ba dărkawúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شوه',
  'ba dărkawúlaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولی شولې',
  'ba dărkawúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکولای شولې',
  'ba dărkawúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شوم',
  'ba dărkawáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شوم',
  'ba dărkawáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شوې',
  'ba dărkawáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شوې',
  'ba dărkawáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شوئ',
  'ba dărkawáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شوئ',
  'ba dărkawáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شول',
  'ba dărkawáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شول',
  'ba dărkawáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شوه',
  'ba dărkawáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شوه',
  'ba dărkawáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوی شولې',
  'ba dărkawáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکوای شولې',
  'ba dărkawáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شوای',
  'dărkawúlay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی شوی',
  'dărkawúlay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای شوای',
  'dărkawúlaay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شوای',
  'dărkawáy shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی شوی',
  'dărkawáy shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای شوای',
  'dărkawáay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړم',
  'dărkRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړو',
  'dărkRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې',
  'dărkRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړئ',
  'dărkRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړي',
  'dărkRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکم',
  'dărkum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکې',
  'dărke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکئ',
  'dărkey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکي',
  'dărkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړم',
  'ba dărkRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړو',
  'ba dărkRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې',
  'ba dărkRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړئ',
  'ba dărkRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړي',
  'ba dărkRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکم',
  'ba dărkum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکو',
  'ba dărkoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکې',
  'ba dărke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکئ',
  'ba dărkey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکي',
  'ba dărkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړه',
  'dărkRa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکه',
  'dărka',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلم',
  'dărkRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلو',
  'dărkRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلې',
  'dărkRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلئ',
  'dărkRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړله',
  'dărkRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکه',
  'ba dărku',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړل',
  'ba dărkRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړه',
  'ba dărkRu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړ',
  'ba dărkuR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلم',
  'ba dărkRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلو',
  'ba dărkRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلې',
  'ba dărkRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلئ',
  'ba dărkRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړله',
  'ba dărkRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شم',
  'dărkRulay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شم',
  'dărkRulaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شو',
  'dărkRulay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شو',
  'dărkRulaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شې',
  'dărkRulay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شې',
  'dărkRulaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شئ',
  'dărkRulay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شئ',
  'dărkRulaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شي',
  'dărkRulay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شي',
  'dărkRulaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شم',
  'dărkRay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شم',
  'dărkRáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شو',
  'dărkRay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شو',
  'dărkRáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شې',
  'dărkRay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شې',
  'dărkRáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شئ',
  'dărkRay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شئ',
  'dărkRáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شي',
  'dărkRay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شي',
  'dărkRáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شم',
  'ba dărkRulay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شم',
  'ba dărkRulaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شو',
  'ba dărkRulay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شو',
  'ba dărkRulaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شې',
  'ba dărkRulay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شې',
  'ba dărkRulaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شئ',
  'ba dărkRulay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شئ',
  'ba dărkRulaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شي',
  'ba dărkRulay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شي',
  'ba dărkRulaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شم',
  'ba dărkRay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شم',
  'ba dărkRáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شو',
  'ba dărkRay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شو',
  'ba dărkRáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شې',
  'ba dărkRay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شې',
  'ba dărkRáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شئ',
  'ba dărkRay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شئ',
  'ba dărkRáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شي',
  'ba dărkRay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شي',
  'ba dărkRáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شوم',
  'dărkRulay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شوم',
  'dărkRulaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شوې',
  'dărkRulay shwe',
  strftime('%s', 'now')
);
-- 1100 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شوې',
  'dărkRulaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شوئ',
  'dărkRulay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شوئ',
  'dărkRulaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شول',
  'dărkRulay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شول',
  'dărkRulaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شوه',
  'dărkRulay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شوه',
  'dărkRulaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شولې',
  'dărkRulay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شولې',
  'dărkRulaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شوم',
  'dărkRay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شوم',
  'dărkRáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شوې',
  'dărkRay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شوې',
  'dărkRáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شوئ',
  'dărkRay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شوئ',
  'dărkRáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شول',
  'dărkRay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شول',
  'dărkRáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شوه',
  'dărkRay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شوه',
  'dărkRáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شولې',
  'dărkRay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شولې',
  'dărkRáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شوم',
  'ba dărkRulay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شوم',
  'ba dărkRulaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شوې',
  'ba dărkRulay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شوې',
  'ba dărkRulaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شوئ',
  'ba dărkRulay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شوئ',
  'ba dărkRulaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شول',
  'ba dărkRulay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شول',
  'ba dărkRulaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شوه',
  'ba dărkRulay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شوه',
  'ba dărkRulaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلی شولې',
  'ba dărkRulay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړلای شولې',
  'ba dărkRulaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شوم',
  'ba dărkRay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شوم',
  'ba dărkRáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شوې',
  'ba dărkRay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شوې',
  'ba dărkRáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شوئ',
  'ba dărkRay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شوئ',
  'ba dărkRáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شول',
  'ba dărkRay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شول',
  'ba dărkRáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شوه',
  'ba dărkRay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شوه',
  'ba dărkRáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی شولې',
  'ba dărkRay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړای شولې',
  'ba dărkRáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شوای',
  'dărkRulay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلی شوی',
  'dărkRulay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړلای شوای',
  'dărkRulaay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شوای',
  'dărkRay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی شوی',
  'dărkRay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړای شوای',
  'dărkRáay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوی',
  'dărkawáy',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوای',
  'dărkawáay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولی',
  'dărkawúlay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکولای',
  'dărkawúlaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړیو',
  'dărkúRiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوونکي',
  'dărkawóonkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوونکیو',
  'dărkawóonkiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوونکو',
  'dărkedóonko',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکوونکې',
  'dărkawóonke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی وم',
  'dărkúRay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړي وو',
  'dărkúRee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وم',
  'dărkúRe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وو',
  'dărkúRe woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی وې',
  'dărkúRay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړي وئ',
  'dărkúRee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وې',
  'dărkúRe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وئ',
  'dărkúRe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی و',
  'dărkúRay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وه',
  'dărkúRe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی یم',
  'dărkúRay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړي یو',
  'dărkúRee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې یم',
  'dărkúRe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې یو',
  'dărkúRe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی یې',
  'dărkúRay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړي یئ',
  'dărkúRee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې یې',
  'dărkúRe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې یئ',
  'dărkúRe yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی دی',
  'dărkúRay day',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړي دي',
  'dărkúRee dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې ده',
  'dărkúRe da',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې دي',
  'dărkúRe dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی وي',
  'dărkúRay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړي وي',
  'dărkúRee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وي',
  'dărkúRe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی یم',
  'ba dărkúRay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړي یو',
  'ba dărkúRee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې یم',
  'ba dărkúRe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې یو',
  'ba dărkúRe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی یې',
  'ba dărkúRay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړي یئ',
  'ba dărkúRee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې یې',
  'ba dărkúRe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې یئ',
  'ba dărkúRe yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی وي',
  'ba dărkúRay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړي وي',
  'ba dărkúRee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وي',
  'ba dărkúRe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی وم',
  'ba dărkúRay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړي وو',
  'ba dărkúRee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وم',
  'ba dărkúRe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وو',
  'ba dărkúRe woo',
  strftime('%s', 'now')
);
-- 1200 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی وې',
  'ba dărkúRay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړي وئ',
  'ba dărkúRee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وې',
  'ba dărkúRe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وئ',
  'ba dărkúRe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی و',
  'ba dărkúRay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وه',
  'ba dărkúRe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی وای',
  'dărkúRay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړی وی',
  'dărkúRay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وای',
  'dărkúRe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'درکړې وی',
  'dărkúRe way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی وای',
  'ba dărkúRay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړی وی',
  'ba dărkúRay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وای',
  'ba dărkúRe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'درکول',
  'به درکړې وی',
  'ba dărkúRe way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکول',
  'raakawul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکو',
  'raakaw',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړل',
  'raakRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړ',
  'raakR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راک',
  'raak',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'را ',
  'raa ',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'کړل',
  'kRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'کړ',
  'kR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'ړ',
  'k',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوونکی',
  'raakawóonkay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی',
  'raakúRay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوم',
  'raakawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوو',
  'raakawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوې',
  'raakawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوئ',
  'raakawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوي',
  'raakawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوم',
  'ba raakawum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوو',
  'ba raakawoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوې',
  'ba raakawe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوئ',
  'ba raakawey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوي',
  'ba raakawee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوه',
  'raakawá',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکاوه',
  'raakaawu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولم',
  'raakawulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولو',
  'raakawuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولې',
  'raakawule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولئ',
  'raakawuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوله',
  'raakawulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکاوه',
  'ba raakaawu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکول',
  'ba raakawul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوه',
  'ba raakawa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولم',
  'ba raakawulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولو',
  'ba raakawuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولې',
  'ba raakawule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولئ',
  'ba raakawuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوله',
  'ba raakawulu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شم',
  'raakawúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شم',
  'raakawúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شو',
  'raakawúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شو',
  'raakawúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شې',
  'raakawúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شې',
  'raakawúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شئ',
  'raakawúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شئ',
  'raakawúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شي',
  'raakawúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شي',
  'raakawúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شم',
  'raakawáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شم',
  'raakawáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شو',
  'raakawáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شو',
  'raakawáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شې',
  'raakawáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شې',
  'raakawáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شئ',
  'raakawáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شئ',
  'raakawáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شي',
  'raakawáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شي',
  'raakawáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شم',
  'ba raakawúlay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شم',
  'ba raakawúlaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شو',
  'ba raakawúlay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شو',
  'ba raakawúlaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شې',
  'ba raakawúlay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شې',
  'ba raakawúlaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شئ',
  'ba raakawúlay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شئ',
  'ba raakawúlaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شي',
  'ba raakawúlay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شي',
  'ba raakawúlaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شم',
  'ba raakawáy shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شم',
  'ba raakawáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شو',
  'ba raakawáy shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شو',
  'ba raakawáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شې',
  'ba raakawáy she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شې',
  'ba raakawáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شئ',
  'ba raakawáy shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شئ',
  'ba raakawáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شي',
  'ba raakawáy shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شي',
  'ba raakawáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شوم',
  'raakawúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شوم',
  'raakawúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شوې',
  'raakawúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شوې',
  'raakawúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شوئ',
  'raakawúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شوئ',
  'raakawúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شول',
  'raakawúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شول',
  'raakawúlaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شوه',
  'raakawúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شوه',
  'raakawúlaay shwa',
  strftime('%s', 'now')
);
-- 1300 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شولې',
  'raakawúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شولې',
  'raakawúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شوم',
  'raakawáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شوم',
  'raakawáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شوې',
  'raakawáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شوې',
  'raakawáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شوئ',
  'raakawáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شوئ',
  'raakawáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شول',
  'raakawáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شول',
  'raakawáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شوه',
  'raakawáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شوه',
  'raakawáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شولې',
  'raakawáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شولې',
  'raakawáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شوم',
  'ba raakawúlay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شوم',
  'ba raakawúlaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شوې',
  'ba raakawúlay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شوې',
  'ba raakawúlaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شوئ',
  'ba raakawúlay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شوئ',
  'ba raakawúlaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شول',
  'ba raakawúlay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شول',
  'ba raakawúlaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شوه',
  'ba raakawúlay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شوه',
  'ba raakawúlaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولی شولې',
  'ba raakawúlay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکولای شولې',
  'ba raakawúlaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شوم',
  'ba raakawáy shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شوم',
  'ba raakawáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شوې',
  'ba raakawáy shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شوې',
  'ba raakawáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شوئ',
  'ba raakawáy shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شوئ',
  'ba raakawáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شول',
  'ba raakawáy shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شول',
  'ba raakawáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شوه',
  'ba raakawáy shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شوه',
  'ba raakawáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوی شولې',
  'ba raakawáy shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکوای شولې',
  'ba raakawáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شوای',
  'raakawúlay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی شوی',
  'raakawúlay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای شوای',
  'raakawúlaay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شوای',
  'raakawáy shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی شوی',
  'raakawáy shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای شوای',
  'raakawáay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړم',
  'raakRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړو',
  'raakRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې',
  'raakRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړئ',
  'raakRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړي',
  'raakRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکم',
  'raakum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکې',
  'raake',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکئ',
  'raakey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکي',
  'raakee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړم',
  'ba raakRum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړو',
  'ba raakRoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې',
  'ba raakRe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړئ',
  'ba raakRey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړي',
  'ba raakRee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکم',
  'ba raakum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکو',
  'ba raakoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکې',
  'ba raake',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکئ',
  'ba raakey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکي',
  'ba raakee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړه',
  'raakRa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکه',
  'raaka',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلم',
  'raakRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلو',
  'raakRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلې',
  'raakRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلئ',
  'raakRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړله',
  'raakRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکه',
  'ba raaku',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړل',
  'ba raakRul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړه',
  'ba raakRu',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړ',
  'ba raakuR',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلم',
  'ba raakRulum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلو',
  'ba raakRuloo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلې',
  'ba raakRule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلئ',
  'ba raakRuley',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړله',
  'ba raakRula',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شم',
  'raakRulay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شم',
  'raakRulaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شو',
  'raakRulay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شو',
  'raakRulaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شې',
  'raakRulay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شې',
  'raakRulaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شئ',
  'raakRulay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شئ',
  'raakRulaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شي',
  'raakRulay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شي',
  'raakRulaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شم',
  'raakRay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شم',
  'raakRáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شو',
  'raakRay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شو',
  'raakRáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شې',
  'raakRay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شې',
  'raakRáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شئ',
  'raakRay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شئ',
  'raakRáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شي',
  'raakRay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شي',
  'raakRáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شم',
  'ba raakRulay shum',
  strftime('%s', 'now')
);
-- 1400 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شم',
  'ba raakRulaay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شو',
  'ba raakRulay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شو',
  'ba raakRulaay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شې',
  'ba raakRulay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شې',
  'ba raakRulaay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شئ',
  'ba raakRulay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شئ',
  'ba raakRulaay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شي',
  'ba raakRulay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شي',
  'ba raakRulaay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شم',
  'ba raakRay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شم',
  'ba raakRáay shum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شو',
  'ba raakRay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شو',
  'ba raakRáay shoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شې',
  'ba raakRay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شې',
  'ba raakRáay she',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شئ',
  'ba raakRay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شئ',
  'ba raakRáay shey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شي',
  'ba raakRay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شي',
  'ba raakRáay shee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شوم',
  'raakRulay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شوم',
  'raakRulaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شوې',
  'raakRulay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شوې',
  'raakRulaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شوئ',
  'raakRulay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شوئ',
  'raakRulaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شول',
  'raakRulay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شول',
  'raakRulaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شوه',
  'raakRulay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شوه',
  'raakRulaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شولې',
  'raakRulay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شولې',
  'raakRulaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شوم',
  'raakRay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شوم',
  'raakRáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شوې',
  'raakRay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شوې',
  'raakRáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شوئ',
  'raakRay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شوئ',
  'raakRáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شول',
  'raakRay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شول',
  'raakRáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شوه',
  'raakRay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شوه',
  'raakRáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شولې',
  'raakRay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شولې',
  'raakRáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شوم',
  'ba raakRulay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شوم',
  'ba raakRulaay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شوې',
  'ba raakRulay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شوې',
  'ba raakRulaay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شوئ',
  'ba raakRulay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شوئ',
  'ba raakRulaay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شول',
  'ba raakRulay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شول',
  'ba raakRulaay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شوه',
  'ba raakRulay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شوه',
  'ba raakRulaay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلی شولې',
  'ba raakRulay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړلای شولې',
  'ba raakRulaay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شوم',
  'ba raakRay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شوم',
  'ba raakRáay shwum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شوې',
  'ba raakRay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شوې',
  'ba raakRáay shwe',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شوئ',
  'ba raakRay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شوئ',
  'ba raakRáay shwey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شول',
  'ba raakRay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شول',
  'ba raakRáay shwul',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شوه',
  'ba raakRay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شوه',
  'ba raakRáay shwa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی شولې',
  'ba raakRay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړای شولې',
  'ba raakRáay shwule',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شوای',
  'raakRulay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلی شوی',
  'raakRulay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړلای شوای',
  'raakRulaay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شوای',
  'raakRay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی شوی',
  'raakRay shway',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړای شوای',
  'raakRáay shwaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوی',
  'raakawáy',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوای',
  'raakawáay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولی',
  'raakawúlay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکولای',
  'raakawúlaay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړیو',
  'raakúRiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوونکي',
  'raakawóonkee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوونکیو',
  'raakawóonkiyo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوونکو',
  'raakedóonko',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکوونکې',
  'raakawóonke',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی وم',
  'raakúRay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړي وو',
  'raakúRee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وم',
  'raakúRe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وو',
  'raakúRe woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی وې',
  'raakúRay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړي وئ',
  'raakúRee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وې',
  'raakúRe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وئ',
  'raakúRe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی و',
  'raakúRay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وه',
  'raakúRe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی یم',
  'raakúRay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړي یو',
  'raakúRee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې یم',
  'raakúRe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې یو',
  'raakúRe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی یې',
  'raakúRay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړي یئ',
  'raakúRee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې یې',
  'raakúRe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې یئ',
  'raakúRe yey',
  strftime('%s', 'now')
);
-- 1500 forms inserted so far...
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی دی',
  'raakúRay day',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړي دي',
  'raakúRee dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې ده',
  'raakúRe da',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې دي',
  'raakúRe dee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی وي',
  'raakúRay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړي وي',
  'raakúRee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وي',
  'raakúRe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی یم',
  'ba raakúRay yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړي یو',
  'ba raakúRee yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې یم',
  'ba raakúRe yum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې یو',
  'ba raakúRe yoo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی یې',
  'ba raakúRay ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړي یئ',
  'ba raakúRee yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې یې',
  'ba raakúRe ye',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې یئ',
  'ba raakúRe yey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی وي',
  'ba raakúRay wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړي وي',
  'ba raakúRee wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وي',
  'ba raakúRe wee',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی وم',
  'ba raakúRay wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړي وو',
  'ba raakúRee woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وم',
  'ba raakúRe wum',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وو',
  'ba raakúRe woo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی وې',
  'ba raakúRay we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړي وئ',
  'ba raakúRee wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وې',
  'ba raakúRe we',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وئ',
  'ba raakúRe wey',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی و',
  'ba raakúRay wo',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وه',
  'ba raakúRe wa',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی وای',
  'raakúRay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړی وی',
  'raakúRay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وای',
  'raakúRe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'راکړې وی',
  'raakúRe way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی وای',
  'ba raakúRay waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړی وی',
  'ba raakúRay way',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وای',
  'ba raakúRe waay',
  strftime('%s', 'now')
);
INSERT OR IGNORE INTO verb_forms 
(verb_root, form, romanization, updated_at)
VALUES (
  'راکول',
  'به راکړې وی',
  'ba raakúRe way',
  strftime('%s', 'now')
);