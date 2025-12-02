import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Layers, ArrowRight, Zap, Code, Box, GitMerge, Server, Cpu, Database } from 'lucide-react';

/* --- TYPES & CONFIG --- */

type ChapterId = 'intro' | 'beam-model' | 'comparison' | 'flink-runner' | 'internals' | 'execution';

interface Chapter {
    id: ChapterId;
    title: string;
    subtitle: string;
}

const CHAPTERS: Chapter[] = [
    { id: 'intro', title: '01. Introduction', subtitle: 'Why Beam x Flink?' },
    { id: 'beam-model', title: '02. The Beam Model', subtitle: 'Logical Pipelines' },
    { id: 'comparison', title: '03. Beam vs Flink vs Spark', subtitle: 'Engine Comparison' },
    { id: 'flink-runner', title: '04. The Flink Runner', subtitle: 'Translation Layer' },
    { id: 'internals', title: '05. Execution Internals', subtitle: 'The FnAPI & Harness' },
    { id: 'execution', title: '06. Runtime Model', subtitle: 'Tasks & Slots' },
];

/* --- MAIN COMPONENT --- */

export const Guide: React.FC = () => {
    const [activeChapter, setActiveChapter] = useState<ChapterId>('intro');

    return (
        <div className="flex h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto hidden md:block">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">The Guide</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Interactive Documentation</p>
                </div>
                <div className="p-2 space-y-1">
                    {CHAPTERS.map(chapter => (
                        <button
                            key={chapter.id}
                            onClick={() => setActiveChapter(chapter.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all group ${
                                activeChapter === chapter.id 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{chapter.title}</span>
                                {activeChapter === chapter.id && <ChevronRight className="w-4 h-4" />}
                            </div>
                            <span className="text-xs text-slate-400 block mt-0.5 opacity-80 group-hover:opacity-100">{chapter.subtitle}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-8 md:p-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeChapter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChapterContent id={activeChapter} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

/* --- CHAPTER CONTENT RENDERER --- */

const ChapterContent: React.FC<{ id: ChapterId }> = ({ id }) => {
    switch(id) {
        case 'intro': return <IntroContent />;
        case 'beam-model': return <BeamModelContent />;
        case 'comparison': return <ComparisonContent />;
        case 'flink-runner': return <FlinkRunnerContent />;
        case 'internals': return <InternalsContent />;
        case 'execution': return <ExecutionContent />;
        default: return <IntroContent />;
    }
};

/* --- CONTENT SECTIONS --- */

const IntroContent = () => (
    <div className="prose dark:prose-invert max-w-none">
        <h1>Beam x Flink: The Missing Manual</h1>
        <p className="lead text-xl text-slate-600 dark:text-slate-300">
            Welcome to the interactive guide for Apache Beam on Apache Flink.
            This tool bridges the gap between the logical <strong>Beam Model</strong> and the physical <strong>Flink Runtime</strong>.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/50">
                <h3 className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold text-lg mb-2">
                    <Layers className="w-5 h-5"/> The "What"
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Apache Beam is the <strong>Unified Programming Model</strong>. 
                    It defines <em>what</em> needs to be calculated (PCollections, ParDo, Windowing) 
                    without worrying about <em>where</em> it runs.
                </p>
            </div>
            <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-900/50">
                <h3 className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-lg mb-2">
                    <Zap className="w-5 h-5"/> The "How"
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Apache Flink is the <strong>Execution Engine</strong>. 
                    It handles the distributed reality: network shuffles, state backends, checkpoints, 
                    and resource management.
                </p>
            </div>
        </div>

        <h3>How to use this guide</h3>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Navigate through chapters using the sidebar.</li>
            <li>Look for <strong>Interactive Diagrams</strong> embedded in the text.</li>
            <li>Use the <strong>Simulators</strong> in the main app menu for hands-on experiments.</li>
        </ul>
    </div>
);

const BeamModelContent = () => (
    <div className="prose dark:prose-invert max-w-none">
        <h1>The Beam Model</h1>
        <p>
            The Beam Model separates the logic of your pipeline from the underlying execution engine. 
            It asks four questions: <strong>What</strong> results are calculated? <strong>Where</strong> in event time? 
            <strong>When</strong> in processing time? <strong>How</strong> do refinements relate?
        </p>

        <div className="my-12 p-8 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h4 className="text-center font-bold text-slate-500 mb-8 uppercase tracking-widest text-xs">Visualizing the Abstraction</h4>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                {/* Source */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <Database className="text-green-500" />
                    </div>
                    <span className="text-xs font-mono">IO.Read</span>
                </div>

                <div className="h-12 w-0.5 md:w-12 md:h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 px-2 text-[10px] whitespace-nowrap rounded text-slate-500">PCollection</div>
                </div>

                {/* Transform */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-500/10 scale-0 group-hover:scale-100 transition-transform rounded-lg" />
                        <Box className="text-indigo-500 relative z-10" />
                    </div>
                    <span className="text-xs font-mono">ParDo(Fn)</span>
                </div>

                <div className="h-12 w-0.5 md:w-12 md:h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 px-2 text-[10px] whitespace-nowrap rounded text-slate-500">PCollection</div>
                </div>

                {/* Group */}
                <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <GitMerge className="text-orange-500" />
                    </div>
                    <span className="text-xs font-mono">GroupByKey</span>
                </div>
            </div>
            
            <p className="text-center text-sm text-slate-500 mt-8 max-w-md">
                In Beam, you don't talk about "Shuffles" or "Partitions". You talk about <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">GroupByKey</code>. 
                The Runner decides how to implement it (e.g., via network shuffle).
            </p>
        </div>

        <h3>Core Primitives</h3>
        <ul className="space-y-4">
            <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold">P</div>
                <div>
                    <strong className="text-slate-900 dark:text-white">PCollection</strong>
                    <p className="text-sm">An immutable, distributed dataset. It's the only way data moves between transforms.</p>
                </div>
            </li>
            <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">T</div>
                <div>
                    <strong className="text-slate-900 dark:text-white">PTransform</strong>
                    <p className="text-sm">The operations logic (ParDo, GroupByKey, Flatten, Combine, Window).</p>
                </div>
            </li>
        </ul>
    </div>
);

const ComparisonContent = () => {
    const [selected, setSelected] = useState<'beam' | 'flink' | 'spark'>('beam');

    const data = {
        beam: {
            title: 'Apache Beam',
            desc: 'The Portability Layer. Beam is NOT an execution engine. It is a model and SDK.',
            pros: ['Write once, run anywhere', 'Unified Batch/Stream API', 'Advanced Windowing semantics'],
            cons: ['Performance overhead (slight)', 'Complexity of abstraction']
        },
        flink: {
            title: 'Apache Flink',
            desc: 'The Streaming-First Engine. Flink handles true event-at-a-time processing with low latency.',
            pros: ['True Streaming (not micro-batch)', 'Exactly-once state consistency', 'High throughput'],
            cons: ['Steep learning curve', 'Deployment complexity']
        },
        spark: {
            title: 'Apache Spark',
            desc: 'The Batch-First Engine. Spark Streaming uses micro-batches (fast small batches).',
            pros: ['Massive ecosystem', 'Great for large scale batch', 'SQL support'],
            cons: ['Higher latency than Flink', 'Micro-batch model limits windowing expressiveness']
        }
    };

    return (
        <div className="prose dark:prose-invert max-w-none">
            <h1>Beam vs Flink vs Spark</h1>
            <p>
                Understanding the difference between the Model (Beam) and the Engine (Flink/Spark) is crucial.
            </p>

            <div className="my-8">
                <div className="flex gap-2 mb-4">
                    {(['beam', 'flink', 'spark'] as const).map(k => (
                        <button
                            key={k}
                            onClick={() => setSelected(k)}
                            className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${
                                selected === k 
                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            {k}
                        </button>
                    ))}
                </div>

                <motion.div
                    key={selected}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl"
                >
                    <h2 className="mt-0 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                        {data[selected].title}
                    </h2>
                    <p className="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
                        {data[selected].desc}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <div>
                            <h4 className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-sm mb-4">Strengths</h4>
                            <ul className="space-y-2">
                                {data[selected].pros.map((p, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-sm mb-4">Trade-offs</h4>
                            <ul className="space-y-2">
                                {data[selected].cons.map((p, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const FlinkRunnerContent = () => (
    <div className="prose dark:prose-invert max-w-none">
        <h1>The Flink Runner</h1>
        <p>
            The <strong>FlinkRunner</strong> is the translation layer. It takes your portable Beam Pipeline (a language-agnostic graph) 
            and converts it into a Flink <code>JobGraph</code> that the Flink JobManager understands.
        </p>

        <div className="bg-slate-900 rounded-xl p-8 my-12 border border-slate-800 relative overflow-hidden">
             {/* Simple visual mapping */}
             <div className="flex justify-between items-center relative z-10">
                 {/* BEAM SIDE */}
                 <div className="flex flex-col gap-6">
                    <div className="text-center font-bold text-orange-400 text-sm mb-2">Beam Pipeline</div>
                    <div className="w-32 h-12 bg-slate-800 border border-orange-500/50 rounded flex items-center justify-center text-slate-200 text-xs shadow-lg shadow-orange-900/20">ReadFromKafka</div>
                    <div className="w-32 h-12 bg-slate-800 border border-orange-500/50 rounded flex items-center justify-center text-slate-200 text-xs shadow-lg shadow-orange-900/20">ParDo(Parse)</div>
                    <div className="w-32 h-12 bg-slate-800 border border-orange-500/50 rounded flex items-center justify-center text-slate-200 text-xs shadow-lg shadow-orange-900/20">GroupByKey</div>
                 </div>

                 {/* ARROWS */}
                 <div className="flex flex-col gap-8 items-center justify-center">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: 100 }} 
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-0.5 bg-slate-600" 
                    />
                    <div className="px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-400 border border-slate-700">Translation</div>
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: 100 }} 
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-0.5 bg-slate-600" 
                    />
                 </div>

                 {/* FLINK SIDE */}
                 <div className="flex flex-col gap-6">
                    <div className="text-center font-bold text-rose-400 text-sm mb-2">Flink JobGraph</div>
                    <div className="w-32 h-20 bg-slate-800 border-2 border-green-500/50 rounded flex flex-col items-center justify-center text-slate-200 text-xs shadow-lg shadow-green-900/20">
                        <span className="font-bold text-green-400 mb-1">Source + Map</span>
                        <span className="text-[10px] opacity-70">Operator Chain</span>
                    </div>
                    <div className="w-32 h-12 bg-slate-800 border border-rose-500/50 rounded flex items-center justify-center text-slate-200 text-xs shadow-lg shadow-rose-900/20">Keyed Window</div>
                 </div>
             </div>
             
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <h3>Key Translation Concepts</h3>
        <ul>
            <li><strong>Operator Chaining:</strong> Beam ParDos are often fused into a single Flink Operator to improve performance.</li>
            <li><strong>State & Timers:</strong> Beam State API calls are mapped to Flink's <code>KeyedStateBackend</code> (typically RocksDB).</li>
            <li><strong>Side Inputs:</strong> Translated into Flink Broadcast Streams or Asynchronous Access patterns.</li>
        </ul>
    </div>
);

const InternalsContent = () => (
    <div className="prose dark:prose-invert max-w-none">
        <h1>Execution Internals & Portability</h1>
        <p>
            How does Java/Python Beam code run on a Flink Java cluster? Through the <strong>Portability Framework</strong>.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="col-span-1 md:col-span-1 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-center mb-4">Runner (Flink)</h4>
                <div className="h-32 flex flex-col items-center justify-center gap-2">
                    <div className="w-full p-2 bg-white dark:bg-slate-800 rounded text-center text-xs shadow-sm">
                        Flink Operator
                        <div className="text-[10px] text-slate-400">ExecutableStage</div>
                    </div>
                    <ArrowRight className="rotate-90 text-slate-400" />
                    <div className="w-full p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-center text-xs font-mono">
                        Fn Data API
                    </div>
                </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center">
                <div className="flex-1">
                     <h4 className="font-bold text-center mb-4">SDK Harness (Docker/Process)</h4>
                     <div className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                        <div className="text-center">
                            <div className="flex gap-2 justify-center mb-2">
                                <Code className="w-5 h-5 text-blue-500" />
                                <span className="font-bold text-sm">User Code (Python/Go)</span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Your actual DoFn code runs here, isolated from Flink. 
                                Data is sent via gRPC over the Fn Data API.
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        <p>
            This architecture allows Flink (Java) to execute Python code. Flink manages the checkpointing and shuffling, but 
            delegates the actual <code>processElement()</code> call to a separate process (the SDK Harness) via gRPC.
        </p>
    </div>
);

const ExecutionContent = () => (
    <div className="prose dark:prose-invert max-w-none">
        <h1>Runtime Model: Tasks & Slots</h1>
        <p>
            Once the JobGraph is submitted, Flink orchestrates the execution.
        </p>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm my-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Cluster Hierarchy</h4>
            
            <div className="flex flex-col gap-4">
                {/* Cluster */}
                <div className="border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Server className="w-5 h-5 text-slate-400" />
                        <span className="font-bold text-sm">Flink Cluster</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {/* Task Manager 1 */}
                        <div className="flex-1 min-w-[200px] bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-3">
                            <div className="flex items-center gap-2 mb-3">
                                <Cpu className="w-4 h-4 text-blue-500" />
                                <span className="font-bold text-xs">TaskManager 1</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-slate-400">Slot 1</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse" />
                                </div>
                                <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-slate-400">Slot 2</span>
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mt-1" />
                                </div>
                            </div>
                        </div>

                         {/* Task Manager 2 */}
                         <div className="flex-1 min-w-[200px] bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-3">
                            <div className="flex items-center gap-2 mb-3">
                                <Cpu className="w-4 h-4 text-blue-500" />
                                <span className="font-bold text-xs">TaskManager 2</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-slate-400">Slot 1</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse" />
                                </div>
                                <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-slate-400">Slot 2</span>
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p>
            <strong>Parallelism</strong> dictates how many parallel tasks run. 
            <strong>Slots</strong> limit the maximum parallelism per TaskManager. 
            If you set Parallelism = 10 but have only 8 slots, the job will not start.
        </p>
    </div>
);