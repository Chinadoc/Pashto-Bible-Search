# 📊 **Frequency Data Consolidation Plan**

## 🔍 **Current State Analysis**

### **Data Sources Identified:**
1. **`word_frequency_list.json`** (7,405 words) - Main frequency list
2. **`ot_word_frequencies_from_db.json`** (3,475 words) - OT-specific frequencies
3. **`nt_word_frequencies_from_db.json`** (2,731 words) - NT-specific frequencies
4. **`nt_reference.json`** (6,266 words) - NT references with detailed metadata

### **Overlap Analysis:**
- **OT words in main**: 1,501 words (43% overlap)
- **NT words in main**: 1,642 words (60% overlap)
- **NT ref words in main**: 5,895 words (94% overlap)

### **Key Issues:**
1. **Data Duplication**: Same words with different frequency counts
2. **Inconsistent Structure**: Different field names and formats
3. **Missing Testament Info**: Main frequency list lacks testament breakdown
4. **Metadata Loss**: NT references have rich metadata missing in other sources

## 🎯 **Consolidation Strategy**

### **Option 1: Single Unified Table (Recommended)**
Create one comprehensive frequency table that combines all sources:

```sql
CREATE TABLE word_frequencies_unified (
  id bigserial PRIMARY KEY,
  pashto_word text NOT NULL,
  total_frequency integer NOT NULL,
  ot_frequency integer DEFAULT 0,
  nt_frequency integer DEFAULT 0,
  romanization text,
  pos text,
  english_translation text,
  metadata jsonb, -- For rich data from nt_reference.json
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE UNIQUE INDEX word_frequencies_unified_word_idx ON word_frequencies_unified (pashto_word);
CREATE INDEX word_frequencies_unified_total_freq_idx ON word_frequencies_unified (total_frequency DESC);
CREATE INDEX word_frequencies_unified_ot_freq_idx ON word_frequencies_unified (ot_frequency DESC);
CREATE INDEX word_frequencies_unified_nt_freq_idx ON word_frequencies_unified (nt_frequency DESC);
CREATE INDEX word_frequencies_unified_roman_idx ON word_frequencies_unified USING gin (to_tsvector('simple', romanization));
```

### **Option 2: Enhanced Existing Tables**
Keep current structure but add missing fields and create views for unified access.

### **Migration Steps:**

1. **Create backup** of existing tables
2. **Create unified table** with proper schema
3. **Migrate data** with conflict resolution rules
4. **Update application code** to use new table
5. **Drop old tables** after verification

## 📋 **Data Migration Rules**

### **Conflict Resolution:**
1. **Main frequency list** as base truth for total counts
2. **OT/NT specific** counts from respective sources
3. **Rich metadata** from nt_reference.json where available
4. **Romanization/POS** from most complete source

### **Migration Script Structure:**
```python
def consolidate_frequency_data():
    # 1. Load all sources
    # 2. Create unified mapping
    # 3. Handle conflicts
    # 4. Generate SQL for bulk insert
```

## 🚀 **Benefits After Consolidation**

- ✅ **Single source of truth** for all frequency data
- ✅ **Faster queries** (no JOINs needed)
- ✅ **Consistent data structure**
- ✅ **Rich metadata preservation**
- ✅ **Better search performance**

## ⚡ **Performance Impact**

**Before**: Complex queries with multiple JOINs
```sql
SELECT wf.pashto_word, wf.frequency_count, ot.frequency_count as ot_count
FROM word_frequencies wf
LEFT JOIN ot_word_frequencies_from_db ot ON ot.pashto_word = wf.pashto_word
-- Multiple table joins...
```

**After**: Simple single-table lookups
```sql
SELECT pashto_word, total_frequency, ot_frequency, nt_frequency
FROM word_frequencies_unified
WHERE pashto_word = 'وهل';
```

**Expected improvement**: 50-80% faster queries

## 🎯 **Implementation Priority**

1. **Phase 1**: Create unified table structure
2. **Phase 2**: Migrate data with consolidation logic
3. **Phase 3**: Update application code
4. **Phase 4**: Performance testing and optimization
5. **Phase 5**: Remove old tables

**Timeline**: 2-3 days for full implementation
