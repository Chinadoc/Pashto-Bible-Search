'use client';

import React from 'react';
import { Box, Typography, Chip, Button, Paper } from '@mui/material';

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
    if (!metadata && conjugations.length === 0) return null;

    const displayWord = metadata?.pashto_word || word;
    const english = metadata?.english || 'Unknown definition';
    const verbType = metadata?.verb_type?.replace('_', ' ') || 'Verb';
    const transitivity = metadata?.transitivity || '';

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

            {/* Conjugation info now shown on word mouseover instead of dropdown */}
        </Paper>
    );
}
