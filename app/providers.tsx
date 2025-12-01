"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { SearchFiltersProvider } from './contexts/SearchFiltersContext';
import { VerseAnalysisProvider } from '@/components/InteractiveVerse';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3B82F6" },
    background: { default: "#111827", paper: "#1F2937" },
    text: { primary: "#F9FAFB", secondary: "#D1D5DB" }
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#374151',
          borderColor: '#4B5563',
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#374151',
            color: '#F9FAFB',
            '&:hover': {
              borderColor: '#6B7280'
            },
            '&.Mui-focused': {
              borderColor: '#3B82F6',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
            }
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#9CA3AF'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#F9FAFB',
          '&:disabled': { color: '#6B7280' }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#2563EB'
          },
          '&:disabled': {
            backgroundColor: '#6B7280',
            color: '#D1D5DB'
          }
        }
      }
    }
  }
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SearchFiltersProvider>
      <VerseAnalysisProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </VerseAnalysisProvider>
    </SearchFiltersProvider>
  );
}
