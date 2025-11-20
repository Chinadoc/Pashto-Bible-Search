'use client';

import PashtoTyper from '@/components/PashtoTyper';
import SearchHeader from '@/components/SearchHeader';

export default function TyperPage() {
    return (
        <div className="flex flex-col h-screen">
            <SearchHeader
                activeMainTab="typer"
                activeTranslation="afghan2023"
                onTranslationChange={() => { }}
            />
            <PashtoTyper />
        </div>
    );
}
