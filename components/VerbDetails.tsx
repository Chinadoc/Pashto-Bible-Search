'use client';

import React, { useState } from 'react';
import { Box, Typography, Chip, Button, Collapse, Paper } from '@mui/material';

interface VerbDetailsProps {
    word: string;
    metadata: {
        id: number;
        pashto_word: string;
        english?: string;
        verb_type?: string;
        transitivity?: string;
        romanization?: string;
    } | null;
    conjugations: Array<{
        form: string;
        tense?: string;
        person?: string;
    }>;
    lingdocsUrl?: string | null;
}

export default function VerbDetails({ word, metadata, conjugations, lingdocsUrl }: VerbDetailsProps) {
    const [expanded, setExpanded] = useState(false);

    if (!metadata && conjugations.length === 0) return null;

    const displayWord = metadata?.pashto_word || word;
    const english = metadata?.english || 'Unknown definition';
    const verbType = metadata?.verb_type?.replace('_', ' ') || 'Verb';
    const transitivity = metadata?.transitivity || '';

    // Group conjugations by tense
    const groupedConjugations = conjugations.reduce((acc, curr) => {
        const tense = curr.tense || 'Other';
        if (!acc[tense]) acc[tense] = [];
        acc[tense].push(curr);
        return acc;
    }, {} as Record<string, typeof conjugations>);

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
                borderLeft: '6px solid #1976d2'
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h4" component="h2" sx={{ fontFamily: 'Noto Naskh Arabic', fontWeight: 'bold', mb: 1 }}>
                        {displayWord}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {english}
                    </Typography>

                    <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                        <Chip label={verbType} size="small" color="primary" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                        {transitivity && (
                            <Chip label={transitivity} size="small" color="secondary" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                        )}
                        {metadata?.romanization && (
                            <Chip label={metadata.romanization} size="small" variant="outlined" />
                        )}
                    </Box>
                </Box>

                {lingdocsUrl && (
                    <Button
                        variant="contained"
                        color="primary"
                        href={lingdocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        View on LingDocs ↗
                    </Button>
                )}
            </Box>

            {conjugations.length > 0 && (
                <Box mt={3}>
                    <Button
                        onClick={() => setExpanded(!expanded)}
                        sx={{ textTransform: 'none', color: 'text.secondary' }}
                    >
                        {expanded ? 'Hide Conjugations ▲' : `Show ${conjugations.length} Conjugations ▼`}
                    </Button>

                    <Collapse in={expanded}>
                        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                            {Object.entries(groupedConjugations).map(([tense, forms]) => (
                                <Box key={tense} sx={{ flex: '1 1 300px', minWidth: 0 }}>
                                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                                        <Typography variant="subtitle2" color="primary" gutterBottom sx={{ textTransform: 'capitalize', borderBottom: '1px solid #eee', pb: 0.5 }}>
                                            {tense}
                                        </Typography>
                                        <Box display="flex" flexDirection="column" gap={0.5}>
                                            {forms.map((f, idx) => (
                                                <Box key={idx} display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {f.person || '-'}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontFamily: 'Noto Naskh Arabic' }}>
                                                        {f.form}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Box>
                            ))}
                        </Box>
                    </Collapse>
                </Box>
            )}
        </Paper>
    );
}
