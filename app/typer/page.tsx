'use client';

import PashtoTyper from '@/components/PashtoTyper';
import SearchHeader from '@/components/SearchHeader';

export default function TyperPage() {
    return (
        <div className="flex flex-col h-screen">
            <SearchHeader
                query=""
                setQuery={() => { }}
                handleSearch={() => { }}
                handleKeyPress={() => { }}
                isLoading={false}
                activeMainTab="typer"
                activeTranslation="afghan2023"
                setActiveTranslation={() => { }}
                searchLanguage="pashto"
                isEnglishMode={false}
            />
            <PashtoTyper />
        </div>
    );
}
