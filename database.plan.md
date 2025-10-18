# 🗃️ Database Plan: Pashto Bible Search Lexicon & Morphological Analysis

## 📋 Executive Summary

The current lexicon system has fundamental categorization problems that prevent accurate morphological analysis and search functionality. This plan outlines a comprehensive database restructuring to fix POS tagging, implement proper morphological relationships, and create a scalable linguistic foundation.

## 🎯 Current Problems Identified

### **1. POS Categorization Issues**
- **29.4% of words marked as "Verb" (inconsistent with actual usage)**
- **Many high-frequency function words incorrectly categorized as "unknown"**
- **Inconsistent tagging**: Mix of "Unknown"/"unknown", "Verb"/"verb", "Noun"/"noun"
- **Function words (prepositions, conjunctions, pronouns) improperly classified**

### **2. Morphological Analysis Gaps**
- **No morphological relationship mapping** between word forms
- **Missing inflection pattern data** for proper noun/adjective conjugation
- **Inadequate verb stem analysis** for conjugation generation
- **No aspect/mood/tense categorization** for verbs

### **3. Data Quality Issues**
- **Inconsistent root form assignment** (some correct, many incorrect)
- **Missing linguistic metadata** (gender, animacy, inflection patterns)
- **No confidence scoring** for automated categorizations

## 🏗️ Database Architecture Plan

### **Phase 1: Core Schema Optimization**

#### **Enhanced word_forms Table**
```sql
CREATE TABLE word_forms (
  id BIGSERIAL PRIMARY KEY,
  pashto_word TEXT NOT NULL UNIQUE,
  romanization TEXT,
  pos_family TEXT CHECK (pos_family IN ('verb', 'noun', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'particle', 'numeral', 'interjection')),
  pos_subtype TEXT, -- transitive/intransitive for verbs, masculine/feminine for nouns, etc.
  frequency_count INTEGER DEFAULT 0,
  root_form TEXT,
  inflection_pattern TEXT, -- plain, 1st_inflection, plural, etc.
  linguistic_features JSONB, -- gender, animacy, aspect, mood, etc.
  confidence_score FLOAT DEFAULT 1.0,
  source TEXT DEFAULT 'manual', -- manual, inferred, lingdocs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Morphological Relationships Table**
```sql
CREATE TABLE morphological_relationships (
  id BIGSERIAL PRIMARY KEY,
  root_word_id BIGINT REFERENCES word_forms(id),
  related_word_id BIGINT REFERENCES word_forms(id),
  relationship_type TEXT, -- conjugation, declension, derivation, compound
  relationship_subtype TEXT, -- present, past, plural, comparative, etc.
  confidence_score FLOAT DEFAULT 1.0,
  linguistic_context JSONB, -- tense, person, number, etc.
  UNIQUE(root_word_id, related_word_id, relationship_type)
);
```

### **Phase 2: POS Recategorization Strategy**

#### **Function Word Corrections**
```sql
-- High-frequency function words that need POS correction
UPDATE word_forms SET
  pos_family = 'preposition',
  pos_subtype = 'genitive_marker',
  confidence_score = 1.0
WHERE pashto_word = 'د';

UPDATE word_forms SET
  pos_family = 'conjunction',
  confidence_score = 1.0
WHERE pashto_word IN ('چې', 'او', 'نو');

UPDATE word_forms SET
  pos_family = 'preposition',
  confidence_score = 1.0
WHERE pashto_word IN ('په', 'ته', 'له', 'سره', 'پر', 'دپاره');
```

#### **Pronoun System Corrections**
```sql
UPDATE word_forms SET
  pos_family = 'pronoun',
  pos_subtype = 'personal_3rd_near',
  confidence_score = 1.0
WHERE pashto_word = 'دی';

UPDATE word_forms SET
  pos_family = 'pronoun',
  pos_subtype = 'demonstrative_near',
  confidence_score = 1.0
WHERE pashto_word = 'دا';
```

### **Phase 3: Verb System Overhaul**

#### **Verb Classification Framework**
```sql
-- Regular transitive verbs
UPDATE word_forms SET
  pos_family = 'verb',
  pos_subtype = 'transitive_regular',
  inflection_pattern = 'kawul_pattern',
  linguistic_features = '{"aspect": "perfective", "stem_type": "split"}'::jsonb
WHERE pashto_word IN ('وهل', 'کول', 'خورل', 'لیکل', 'وینل');

-- Intransitive verbs (بکېدل compounds)
UPDATE word_forms SET
  pos_family = 'verb',
  pos_subtype = 'intransitive_compound',
  inflection_pattern = 'bekedil_compound',
  linguistic_features = '{"aspect": "imperfective", "stem_type": "compound"}'::jsonb
WHERE pashto_word LIKE '%بکېدل';
```

#### **Verb Conjugation Relationships**
```sql
-- Establish conjugation relationships
INSERT INTO morphological_relationships (root_word_id, related_word_id, relationship_type, relationship_subtype, linguistic_context)
SELECT
  r.id, f.id, 'conjugation', 'present_1st_singular',
  '{"tense": "present", "person": "1st", "number": "singular", "aspect": "imperfective"}'::jsonb
FROM word_forms r
CROSS JOIN word_forms f
WHERE r.pashto_word = 'وهل'
  AND f.pashto_word = 'وهم';
```

### **Phase 4: Noun System Enhancement**

#### **Noun Gender & Inflection Patterns**
```sql
-- Masculine nouns
UPDATE word_forms SET
  pos_family = 'noun',
  pos_subtype = 'masculine_animate',
  linguistic_features = '{"gender": "masculine", "animacy": "animate", "inflection_class": "pattern_4"}'::jsonb
WHERE pashto_word IN ('سړی', 'پلار', 'زوی', 'ماشوم');

-- Feminine nouns
UPDATE word_forms SET
  pos_family = 'noun',
  pos_subtype = 'feminine_inanimate',
  linguistic_features = '{"gender": "feminine", "animacy": "inanimate", "inflection_class": "pattern_2"}'::jsonb
WHERE pashto_word IN ('مور', 'لاره', 'کتاب', 'ښځه');
```

#### **Noun Plural Relationships**
```sql
-- Establish plural relationships
INSERT INTO morphological_relationships (root_word_id, related_word_id, relationship_type, relationship_subtype)
SELECT r.id, p.id, 'declension', 'plural'
FROM word_forms r
JOIN word_forms p ON p.pashto_word = r.pashto_word || 'ان'
WHERE r.pos_family = 'noun' AND r.linguistic_features->>'gender' = 'masculine';
```

### **Phase 5: Adjective System Implementation**

#### **Adjective Agreement Patterns**
```sql
UPDATE word_forms SET
  pos_family = 'adjective',
  pos_subtype = 'attributive',
  inflection_pattern = 'agreement_required',
  linguistic_features = '{"agreement": ["gender", "number"], "comparison": "positive"}'::jsonb
WHERE pashto_word IN ('لوي', 'ښه', 'پاک', 'نوی', 'زوړ');
```

### **Phase 6: Morphological Relationship Mapping**

#### **Comprehensive Relationship Framework**
```sql
-- Verb conjugation networks
-- Noun declension networks
-- Adjective agreement networks
-- Derivational relationships (noun-to-adjective, verb-to-noun, etc.)

CREATE OR REPLACE FUNCTION generate_morphological_network(word_id BIGINT)
RETURNS TABLE (
  relationship_type TEXT,
  related_words JSONB,
  relationship_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mr.relationship_type,
    jsonb_agg(jsonb_build_object(
      'word', wf.pashto_word,
      'subtype', mr.relationship_subtype,
      'confidence', mr.confidence_score
    )) as related_words,
    COUNT(*)::INTEGER as relationship_count
  FROM morphological_relationships mr
  JOIN word_forms wf ON wf.id = mr.related_word_id
  WHERE mr.root_word_id = word_id
  GROUP BY mr.relationship_type;
END;
$$ LANGUAGE plpgsql;
```

## 📊 Implementation Roadmap

### **Week 1-2: Schema Migration**
1. ✅ Create enhanced schema with proper constraints
2. ✅ Migrate existing data with POS corrections
3. ✅ Implement relationship tables
4. ✅ Add linguistic feature columns

### **Week 3-4: POS Recategorization**
1. 🔄 Correct function word categorization (prepositions, conjunctions, pronouns)
2. 🔄 Implement verb classification system
3. 🔄 Add noun gender/inflection metadata
4. 🔄 Establish adjective agreement patterns

### **Week 5-6: Morphological Relationships**
1. 📋 Generate verb conjugation networks
2. 📋 Create noun declension relationships
3. 📋 Implement adjective agreement mappings
4. 📋 Add derivational relationships

### **Week 7-8: Search Integration**
1. 🔄 Update search functions to use new schema
2. 🔄 Implement morphological search capabilities
3. 🔄 Add confidence scoring to results
4. 🔄 Performance optimization

### **Week 9-10: Validation & Refinement**
1. 📋 Cross-reference with LingDocs data
2. 📋 Validate morphological relationships
3. 📋 Test search accuracy improvements
4. 📋 Performance benchmarking

## 🎯 Expected Outcomes

### **Quantitative Improvements**
- **POS Accuracy**: From ~40% to >90% correct categorization
- **Morphological Coverage**: From 2-10 forms to 25-40+ forms per lemma
- **Search Performance**: 30-50x faster morphological queries
- **Relationship Coverage**: Complete conjugation/declension networks

### **Qualitative Improvements**
- **Linguistically Accurate**: Proper aspect/mood/tense distinctions
- **Comprehensive Coverage**: All major morphological patterns
- **Scalable Architecture**: Easy to extend with new linguistic data
- **Research Ready**: Suitable for advanced linguistic analysis

## 🔗 Integration Points

### **LingDocs Compatibility**
- Import inflection patterns from LingDocs dictionary
- Cross-reference conjugation rules
- Validate against linguistic standards

### **Search API Updates**
```typescript
// Before: Simple string matching
const results = await searchWords(query);

// After: Morphological search
const results = await morphologicalSearch(query, {
  includeConjugations: true,
  includeInflections: true,
  posFilter: ['verb', 'noun'],
  confidenceThreshold: 0.8
});
```

### **Frontend Enhancements**
- Related forms display with confidence scores
- POS-specific filtering options
- Morphological relationship visualization
- Linguistic feature explanations

## 📈 Success Metrics

### **Data Quality Metrics**
- POS tagging accuracy >90%
- Morphological relationship completeness >95%
- Root form accuracy >85%
- Linguistic feature coverage >80%

### **Performance Metrics**
- Morphological search <10ms response time
- Relationship queries <5ms
- Memory usage <200MB for full dataset
- Concurrent users supported: 1000+

### **User Experience Metrics**
- Verb forms displayed: 25-40+ (vs current 2-10)
- Noun inflections: 4-8 forms (vs current 1-2)
- Search result relevance: 80%+ improvement
- Morphological understanding: Comprehensive coverage

## 🚨 Risk Mitigation

### **Data Migration Risks**
- **Backup Strategy**: Full database export before migration
- **Rollback Plan**: Schema versioning with migration scripts
- **Validation Checks**: Automated tests for data integrity

### **Performance Risks**
- **Indexing Strategy**: GIN indexes for fuzzy search, B-tree for exact matches
- **Query Optimization**: Pre-computed relationship caches
- **Load Testing**: Simulate production traffic patterns

### **Accuracy Risks**
- **Expert Review**: Linguistic validation by native speakers
- **Gradual Rollout**: Feature flags for incremental deployment
- **User Feedback**: Real-world testing and corrections

## 💡 Future Extensions

### **Advanced Linguistic Features**
- Aspect/mood/tense analysis
- Syntactic relationship mapping
- Semantic field categorization
- Historical linguistic analysis

### **Machine Learning Integration**
- Automated POS tagging for new words
- Morphological pattern recognition
- Error correction suggestions
- Usage pattern analysis

### **Research Applications**
- Linguistic corpus analysis
- Language learning tools
- Comparative linguistics
- Historical text analysis

---

## 🎯 Conclusion

This database plan transforms the current inconsistent lexicon into a comprehensive, linguistically accurate morphological database. By systematically addressing POS categorization issues and implementing proper morphological relationships, we create a foundation for advanced linguistic search capabilities that will serve both immediate user needs and future research applications.

The phased approach ensures minimal disruption while delivering substantial improvements in accuracy, performance, and linguistic coverage.

**Ready to implement? Let's start with Phase 1: Schema Migration.** 🚀
