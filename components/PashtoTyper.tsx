"use client";

import { useState, useEffect, useRef } from 'react';

// Icons as React components
const Icons = {
    Eye: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
        </svg>
    ),
    EyeOff: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" />
        </svg>
    ),
    Brain: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    ),
    Maximize: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
    ),
    Minimize: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
    ),
    RotateCcw: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
        </svg>
    ),
    Trophy: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17" /><path d="M14 14.66V17" /><path d="M12 2v20" />
        </svg>
    )
};

interface Word {
    p: string; // Pashto
    t: string; // Transliteration
    e: string; // English
    firstKey?: string; // Explicit first key to type (romanized)
}

interface Line {
    words: Word[];
}

// Data with Verse groupings
const prayerData: Line[] = [
    // Verse 9
    {
        words: [
            { p: "ای", t: "Ay", e: "O" },
            { p: "زمونږ", t: "zamong", e: "our" },
            { p: "اسماني", t: "asmani", e: "Heavenly" },
            { p: "پلاره،", t: "plara,", e: "Father," }
        ]
    },
    {
        words: [
            { p: "ستا", t: "Sta", e: "Your" },
            { p: "نوم", t: "noom", e: "name" },
            { p: "دې", t: "de", e: "may" },
            { p: "پاک", t: "pak", e: "holy" },
            { p: "وي،", t: "wi,", e: "be," }
        ]
    },

    // Verse 10
    {
        words: [
            { p: "ستا", t: "Sta", e: "Your" },
            { p: "پاچاهي", t: "pachahi", e: "kingdom" },
            { p: "دې", t: "de", e: "may" },
            { p: "راشي.", t: "rashi.", e: "come." }
        ]
    },
    {
        words: [
            { p: "ستا", t: "Sta", e: "Your" },
            { p: "اراده", t: "irada", e: "will" },
            { p: "دې", t: "de", e: "may" },
            { p: "په", t: "pa", e: "on" },
            { p: "ځمکه", t: "zmaka", e: "earth" },
            { p: "هم", t: "ham", e: "also" },
            { p: "پوره", t: "pura", e: "done" },
            { p: "شي", t: "shi", e: "be" }
        ]
    },
    {
        words: [
            { p: "لکه", t: "Laka", e: "Just" },
            { p: "څنګه", t: "tsanga", e: "how" },
            { p: "چې", t: "che", e: "that" },
            { p: "په", t: "pa", e: "in" },
            { p: "اسمان", t: "asman", e: "heaven" },
            { p: "کې", t: "ke", e: "in" },
            { p: "پوره", t: "pura", e: "done" },
            { p: "کیږي.", t: "kegi.", e: "is." }
        ]
    },

    // Verse 11
    {
        words: [
            { p: "مونږ", t: "Mong", e: "Us" },
            { p: "ته", t: "ta", e: "to" },
            { p: "خپل", t: "khpal", e: "our" },
            { p: "ورځنی", t: "wrazanay", e: "daily" },
            { p: "رزق", t: "rizq", e: "provision" },
            { p: "همدا", t: "hamda", e: "this very" },
            { p: "نن", t: "nan", e: "today" },
            { p: "راکړه.", t: "rakra.", e: "give." }
        ]
    },

    // Verse 12
    {
        words: [
            { p: "زمونږ", t: "Zamong", e: "Our" },
            { p: "ګناهونه", t: "gunahuna", e: "sins" },
            { p: "وبخښه،", t: "wabakhsha,", e: "forgive," }
        ]
    },
    {
        words: [
            { p: "لکه", t: "Laka", e: "Just" },
            { p: "څنګه", t: "tsanga", e: "how" },
            { p: "چې", t: "che", e: "that" },
            { p: "مونږ", t: "mong", e: "we" },
            { p: "هم", t: "ham", e: "also" },
            { p: "هغه", t: "hagha", e: "those" },
            { p: "خلک", t: "khalk", e: "people" },
            { p: "بخښو", t: "bakhsho", e: "forgive" }
        ]
    },
    {
        words: [
            { p: "چې", t: "Che", e: "who" },
            { p: "زمونږ", t: "zamong", e: "our" },
            { p: "په", t: "pa", e: "in" },
            { p: "وړاندې", t: "wrande", e: "front/against" },
            { p: "ګناه", t: "gunah", e: "sin" },
            { p: "کوي.", t: "kawi.", e: "do." }
        ]
    },

    // Verse 13
    {
        words: [
            { p: "مونږ", t: "Mong", e: "Us" },
            { p: "په", t: "pa", e: "in" },
            { p: "ازمېښت", t: "azmekht", e: "trial/temptation" },
            { p: "کې", t: "ke", e: "in" },
            { p: "مه", t: "ma", e: "do not" },
            { p: "اچوه،", t: "achawa,", e: "throw/lead," }
        ]
    },
    {
        words: [
            { p: "خو", t: "Kho", e: "but" },
            { p: "مونږ", t: "mong", e: "us" },
            { p: "د", t: "da", e: "from" },
            { p: "شیطان", t: "shaitan", e: "Satan" },
            { p: "د", t: "da", e: "of" },
            { p: "بدۍ", t: "badi", e: "evil" },
            { p: "نه", t: "na", e: "from" },
            { p: "وساته،", t: "wasata,", e: "protect," }
        ]
    },

    // Doxology
    {
        words: [
            { p: "ځکه", t: "Zaka", e: "Because" },
            { p: "چې", t: "che", e: "that" },
            { p: "پاچاهي،", t: "pachahi,", e: "kingdom," },
            { p: "قدرت", t: "qudrat", e: "power" },
            { p: "او", t: "aw", e: "and" },
            { p: "لویي", t: "loyi", e: "glory" },
            { p: "به", t: "ba", e: "will" },
            { p: "تل", t: "tal", e: "always" },
            { p: "ترتله", t: "tartala", e: "forever" },
            { p: "ستا", t: "sta", e: "yours" },
            { p: "وي.", t: "wi.", e: "be." },
            { p: "امین.", t: "Amin.", e: "Amen." }
        ]
    }
];

// Flatten for logic
// const flatList = prayerData.flatMap(line => line.words);

interface Props {
    data?: Line[];
    onComplete?: (score: number) => void;
    onExit?: () => void;
}

export default function PashtoTyper({ data, onComplete, onExit }: Props) {
    // Use provided data or fall back to prayer data
    const activeData = data && data.length > 0 ? data : prayerData;
    const flatList = activeData.flatMap(line => line.words);

    const [stage, setStage] = useState(1); // 1: Type It, 2: Memorize It, 3: Master It
    const [index, setIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [mistake, setMistake] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [errors, setErrors] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());
    const [audioUrls, setAudioUrls] = useState<Map<number, string>>(new Map());
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [lastCompletedVerse, setLastCompletedVerse] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Reset state when data changes
    useEffect(() => {
        setIndex(0);
        setIsComplete(false);
        setMistake(false);
        setAttempts(0);
        setErrors(0);
        setStage(1);
        setHiddenIndices(new Set());
    }, [data]);

    const containerRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const currentWordRef = useRef<HTMLSpanElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    // Map to track which verse each line belongs to
    const lineToVerse = [9, 9, 10, 10, 10, 11, 12, 12, 12, 13, 13, 13];

    // Fetch audio URLs on mount
    useEffect(() => {
        const fetchAudioUrls = async () => {
            try {
                const response = await fetch('/api/typer/verses?book=Matthew&chapter=6&start=9&end=13&translation=afghan2023');
                const data = await response.json();

                const urlMap = new Map<number, string>();
                data.verses.forEach((verse: any) => {
                    if (verse.audio_url) {
                        urlMap.set(verse.verseNumber, verse.audio_url);
                    }
                });
                setAudioUrls(urlMap);
                console.log('Loaded audio URLs:', urlMap);
            } catch (error) {
                console.error('Failed to fetch audio URLs:', error);
            }
        };

        fetchAudioUrls();
    }, []);

    // Initialize Hidden Words for Stage 2
    useEffect(() => {
        if (stage === 2) {
            const indices = new Set<number>();
            flatList.forEach((_, i) => {
                // Randomly hide ~50% of words, but never the very first one
                if (Math.random() > 0.5 && i > 0) indices.add(i);
            });
            setHiddenIndices(indices);
        } else if (stage === 3) {
            const indices = new Set<number>(flatList.map((_, i) => i)); // Hide all
            setHiddenIndices(indices);
        } else {
            setHiddenIndices(new Set());
        }
        reset();
    }, [stage]);

    // Focus management
    useEffect(() => {
        if (containerRef.current) containerRef.current.focus();
    }, [isComplete, stage]);

    // Check if mobile device and focus input
    useEffect(() => {
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(mobile);
        if (mobile && mobileInputRef.current && !isComplete) {
            // Focus the input to trigger system keyboard
            setTimeout(() => mobileInputRef.current?.focus(), 100);
        }
    }, [isComplete]);

    // --- AUTO SCROLL LOGIC ---
    useEffect(() => {
        if (currentWordRef.current && scrollAreaRef.current) {
            const word = currentWordRef.current;
            const scrollArea = scrollAreaRef.current;

            const scrollAreaRect = scrollArea.getBoundingClientRect();
            const wordRect = word.getBoundingClientRect();

            const wordTopRelativeToArea = wordRect.top - scrollAreaRect.top;
            const wordBottomRelativeToArea = wordRect.bottom - scrollAreaRect.top;

            // Strategy: Center the current word in the visible area
            // On real mobile devices, the viewport height shrinks when the keyboard opens
            // So scrollAreaRect.height is already the "visible" space above the keyboard

            const targetPosition = (scrollAreaRect.height / 2) - (wordRect.height / 2);

            // Calculate how much to scroll
            const scrollAmount = wordTopRelativeToArea - targetPosition;

            // Only scroll if the word is significantly off-center (50px buffer)
            const distFromCenter = Math.abs(wordTopRelativeToArea - targetPosition);

            if (distFromCenter > 50) {
                scrollArea.scrollTo({
                    top: scrollArea.scrollTop + scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }, [index, isMobile]);

    // Check for verse completion and play audio
    useEffect(() => {
        if (index === 0) return; // Don't check on initial render

        // Determine the current line index based on the global word index
        let currentLineIdx = 0;
        let wordsCount = 0;
        for (let i = 0; i < activeData.length; i++) {
            wordsCount += activeData[i].words.length;
            if (index < wordsCount) {
                currentLineIdx = i;
                break;
            }
        }

        const currentVerse = lineToVerse[currentLineIdx];

        // Check if we just completed a verse
        let wordsUpToCurrentVerseEnd = 0;
        for (let i = 0; i < activeData.length; i++) {
            wordsUpToCurrentVerseEnd += activeData[i].words.length;

            // Safe access to lineToVerse
            const thisLineVerse = i < lineToVerse.length ? lineToVerse[i] : 0;
            const nextLineVerse = (i + 1) < lineToVerse.length ? lineToVerse[i + 1] : 0;

            if (thisLineVerse === currentVerse && (i === activeData.length - 1 || nextLineVerse !== currentVerse)) {
                // This is the last line of the current verse
                if (index === wordsUpToCurrentVerseEnd && currentVerse !== lastCompletedVerse) {
                    setLastCompletedVerse(currentVerse);
                    playAudioForVerse(currentVerse);
                }
                break;
            }
        }
    }, [index, lastCompletedVerse, audioUrls]);


    const playAudioForVerse = async (verseNumber: number) => {
        const audioUrl = audioUrls.get(verseNumber);
        if (!audioUrl) {
            console.log(`No audio URL for verse ${verseNumber}`);
            return;
        }

        setIsPlayingAudio(true);

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
            setIsPlayingAudio(false);
            audioRef.current = null;
        };

        audio.onerror = (e) => {
            console.error(`Failed to play audio for verse ${verseNumber}:`, e);
            setIsPlayingAudio(false);
            audioRef.current = null;
        };

        try {
            await audio.play();
            console.log(`Playing audio for verse ${verseNumber}`);
        } catch (error) {
            console.error('Audio playback failed:', error);
            setIsPlayingAudio(false);
        }
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                    setIsFullscreen(false);
                }
            }
        } catch (err) {
            console.warn("Fullscreen request failed:", err);
        }
    };

    const handleKeyPress = (key: string) => {
        if (isComplete) return;

        const currentWord = flatList[index];
        // Use explicit firstKey if available, otherwise fall back to first char of transliteration
        const targetKey = (currentWord.firstKey || currentWord.t.charAt(0)).toLowerCase();
        const pressedKey = key.toLowerCase();

        setAttempts(prev => prev + 1);

        if (pressedKey === targetKey) {
            setMistake(false);
            if (index + 1 === flatList.length) {
                setIsComplete(true);
                if (onComplete) {
                    // Calculate score (0-5) based on accuracy
                    // 5 = 100%, 4 = 90%+, 3 = 80%+, etc.
                    const finalAccuracy = attempts > 0 ? ((attempts - errors) / attempts) : 1;
                    let score = 0;
                    if (finalAccuracy >= 1) score = 5;
                    else if (finalAccuracy >= 0.9) score = 4;
                    else if (finalAccuracy >= 0.8) score = 3;
                    else if (finalAccuracy >= 0.6) score = 2;
                    else score = 1;

                    onComplete(score);
                }
            } else {
                setIndex(index + 1);
            }
        } else {
            setMistake(true);
            setErrors(prev => prev + 1);
            setTimeout(() => setMistake(false), 300);
        }

        // Clear mobile input after processing
        if (mobileInputRef.current) {
            mobileInputRef.current.value = '';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key.length === 1) {
            e.preventDefault();
            handleKeyPress(e.key);
        }
    };

    const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Only process if there's a new character
        if (inputValue && inputValue.length > 0) {
            // Get the last character typed (in case of autocomplete/paste)
            const lastChar = inputValue[inputValue.length - 1];

            // Process the keystroke
            handleKeyPress(lastChar);
        }

        // CRITICAL: Clear input immediately in the next tick
        // This prevents text accumulation in the input field
        setTimeout(() => {
            if (mobileInputRef.current) {
                mobileInputRef.current.value = '';
            }
        }, 0);
    };

    const reset = () => {
        setIndex(0);
        setIsComplete(false);
        setErrors(0);
        setAttempts(0);
        setLastCompletedVerse(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlayingAudio(false);
        if (containerRef.current) containerRef.current.focus();
    };

    const currentWord = flatList[index] || {};
    const progressPercent = Math.round((index / flatList.length) * 100);
    const accuracy = attempts > 0 ? Math.round(((attempts - errors) / attempts) * 100) : 100;

    return (
        <div
            className="flex-grow flex flex-col outline-none bg-slate-900 h-full"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            ref={containerRef}
        >
            {/* Top bar with stage selectors and fullscreen */}
            <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex justify-between items-center z-20 shadow-md backdrop-blur flex-shrink-0">
                {/* Stage Selectors (Desktop) */}
                <div className="hidden md:flex gap-2">
                    {[
                        { id: 1, label: 'Type It', icon: 'Eye' },
                        { id: 2, label: 'Memorize It', icon: 'Brain' },
                        { id: 3, label: 'Master It', icon: 'EyeOff' }
                    ].map(s => {
                        const IconComp = Icons[s.icon as keyof typeof Icons];
                        return (
                            <button
                                key={s.id}
                                onClick={() => setStage(s.id)}
                                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all
                  ${stage === s.id
                                        ? 'bg-emerald-600 text-white shadow-lg ring-1 ring-emerald-400'
                                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}
                `}
                            >
                                <IconComp className="w-4 h-4" />
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleFullscreen} className="text-slate-400 hover:text-white transition-colors p-1">
                        {isFullscreen ? <Icons.Minimize className="w-5 h-5" /> : <Icons.Maximize className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Stage Selector */}
            <div className="md:hidden flex justify-center gap-2 p-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
                {[1, 2, 3].map(s => (
                    <button
                        key={s}
                        onClick={() => setStage(s)}
                        className={`h-2 w-1/3 rounded-full transition-all ${stage === s ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    />
                ))}
                <div className="absolute text-xs text-slate-400 mt-3">
                    {stage === 1 ? 'Type It' : stage === 2 ? 'Memorize It' : 'Master It'}
                </div>
            </div>

            {/* Main Text Area (Scrollable) */}
            <div
                className="flex-grow overflow-y-auto flex justify-center bg-[#0b1221] relative"
                ref={scrollAreaRef}
            >
                <div className="max-w-3xl w-full p-6 pb-96 pt-10">
                    <div className="flex flex-col gap-4 md:gap-6" dir="rtl">
                        {activeData.map((line, lineIdx) => (
                            <div
                                key={lineIdx}
                                className="flex flex-wrap gap-3 md:gap-4 leading-loose justify-start border-b border-slate-800/50 pb-4 last:border-0"
                            >
                                {line.words.map((word, wordIdx) => {
                                    // Calculate global index
                                    let globalIdx = 0;
                                    for (let i = 0; i < lineIdx; i++) globalIdx += activeData[i].words.length;
                                    globalIdx += wordIdx;

                                    const isTyped = globalIdx < index;
                                    const isCurrent = globalIdx === index;
                                    const isFuture = globalIdx > index;

                                    // Visibility Logic based on Stage
                                    let showText = true;
                                    if (!isTyped && !isCurrent) {
                                        // Future words: Check if they are hidden by the stage logic
                                        if (hiddenIndices.has(globalIdx)) {
                                            showText = false;
                                        }
                                    }

                                    return (
                                        <span
                                            key={globalIdx}
                                            ref={isCurrent ? currentWordRef : null}
                                            className={`
                        relative px-3 py-1 rounded-lg text-2xl md:text-3xl transition-all duration-300 cursor-default select-none
                        ${isTyped ? 'text-emerald-400 opacity-100' : ''}
                        ${isCurrent ? 'bg-slate-800 text-white shadow-lg scale-105 z-10 ring-1 ring-blue-500/50' : ''}
                        ${isFuture ? 'text-slate-500' : ''}
                        ${isCurrent && mistake ? 'animate-shake text-red-400 ring-red-500' : ''}
                      `}
                                            style={{ fontFamily: "'Noto Naskh Arabic', 'Arial', sans-serif", lineHeight: 1.8 }}
                                        >
                                            {/* Render Pashto or Dots */}
                                            {showText || isTyped || isCurrent ? word.p : '..........'}

                                            {/* Cursor */}
                                            {isCurrent && (
                                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Interaction Bar */}
            <div className="bg-slate-900/95 border-t border-slate-700 p-4 md:p-6 z-20 shadow-[0_-5px_30px_rgba(0,0,0,0.4)] backdrop-blur absolute bottom-0 w-full">
                <div className="max-w-2xl mx-auto text-center">
                    {!isComplete ? (
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">

                            {/* Hint Box */}
                            <div className="flex-1 w-full">
                                <div className="flex items-center justify-center gap-3 bg-slate-800/80 px-6 py-2 rounded-xl border border-slate-700">
                                    <span className="text-3xl font-bold text-blue-400 font-mono">{currentWord.t?.charAt(0)}</span>
                                    <span className="text-slate-600 text-xl">&rarr;</span>
                                    <div className="flex flex-col items-start text-left min-w-[120px]">
                                        {/* Expected key indicator */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-slate-400 text-xs">Type:</span>
                                            <span className={`
                                                px-3 py-1 rounded-lg text-lg font-bold uppercase
                                                ${stage === 3 
                                                    ? 'bg-slate-700 text-slate-400 blur-sm' 
                                                    : 'bg-emerald-600 text-white animate-pulse'
                                                }
                                            `}>
                                                {stage === 3 ? '?' : (currentWord.firstKey || currentWord.t.charAt(0))}
                                            </span>
                                        </div>
                                        {/* Romanization */}
                                        <span className={`font-medium text-base leading-none transition-all ${stage === 3 ? 'blur-sm select-none text-slate-500' : 'text-white'}`}>
                                            {stage === 3 ? '???' : currentWord.t}
                                        </span>
                                        {/* English definition */}
                                        {currentWord.e && (
                                            <span className="text-slate-400 text-sm italic mt-0.5">{currentWord.e}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mini Stats */}
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <div className="flex flex-col items-center">
                                    <span className="text-white text-lg font-bold">{progressPercent}%</span>
                                    <span>COMPLETE</span>
                                </div>
                                <div className="w-px bg-slate-700 h-8"></div>
                                <div className="flex flex-col items-center">
                                    <span className={`text-lg font-bold ${accuracy < 90 ? 'text-yellow-500' : 'text-emerald-500'}`}>{accuracy}%</span>
                                    <span>ACCURACY</span>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-4">
                            <div className="text-emerald-400 font-bold text-xl flex items-center justify-center gap-2">
                                <Icons.Trophy className="w-6 h-6" />
                                stage {stage} Complete!
                            </div>
                            {onComplete && stage === 2 && (
                                <div className="text-center text-sm text-gray-400 mb-2">
                                    SRS Progress Updated!
                                </div>
                            )}
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={reset}
                                    className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Icons.RotateCcw className="w-4 h-4" /> Retry
                                </button>
                                {stage < 3 ? (
                                    <button
                                        onClick={() => setStage(stage + 1)}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-0.5"
                                    >
                                        Next Stage &rarr;
                                    </button>
                                ) : (
                                    onExit && (
                                        <button
                                            onClick={onExit}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-0.5"
                                        >
                                            Done
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                    )}
                </div>
            </div>

            {/* Mobile typing input - uncontrolled, manually cleared after each keystroke */}
            {isMobile && !isComplete && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
                    <input
                        ref={mobileInputRef}
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        defaultValue=""
                        onChange={handleMobileInput}
                        onBlur={() => mobileInputRef.current?.focus()}
                        className="w-64 px-4 py-3 text-center text-lg bg-slate-800/95 border-2 border-emerald-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur shadow-lg"
                        placeholder="Tap to type..."
                    />
                </div>
            )}
        </div >
    );
}
