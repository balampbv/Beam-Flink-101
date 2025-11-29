import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ArrowRight, Clock, Database, GitMerge, LayoutGrid, X } from 'lucide-react';

const concepts = [
  {
    id: 'pcollection',
    title: 'PCollection',
    color: 'bg-orange-500',
    icon: <Database className="w-6 h-6" />,
    description: 'An immutable, distributed dataset. It can be bounded (batch) or unbounded (stream).',
    animation: 'pcollection'
  },
  {
    id: 'pardo',
    title: 'ParDo (DoFn)',
    color: 'bg-blue-500',
    icon: <ArrowRight className="w-6 h-6" />,
    description: 'Parallel processing. Similar to "Map", but more powerful. 1 input -> 0, 1, or N outputs.',
    animation: 'pardo'
  },
  {
    id: 'windowing',
    title: 'Windowing',
    color: 'bg-green-500',
    icon: <LayoutGrid className="w-6 h-6" />,
    description: 'Slicing unbounded data into finite chunks (Fixed, Sliding, Session) based on event time.',
    animation: 'windowing'
  },
  {
    id: 'watermark',
    title: 'Watermarks',
    color: 'bg-indigo-500',
    icon: <Clock className="w-6 h-6" />,
    description: 'System notion of time. "No data older than T will arrive". Triggers window results.',
    animation: 'watermark'
  },
  {
    id: 'checkpoints',
    title: 'Flink Checkpoints',
    color: 'bg-rose-500',
    icon: <GitMerge className="w-6 h-6" />,
    description: 'Periodic state snapshots. Ensures Exactly-Once semantics upon failure recovery.',
    animation: 'checkpoint'
  }
];

export const Concepts: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Core Concepts</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Click a card to see the concept in action.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((c) => (
          <motion.div
            key={c.id}
            layoutId={`card-${c.id}`}
            onClick={() => setActiveId(c.id)}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 cursor-pointer hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
          >
            <div className={`w-12 h-12 rounded-lg ${c.color} bg-opacity-10 flex items-center justify-center text-${c.color.split('-')[1]}-600 dark:text-${c.color.split('-')[1]}-400 mb-4 group-hover:scale-110 transition-transform`}>
              {React.cloneElement(c.icon as React.ReactElement, { className: `w-6 h-6 text-${c.color.replace('bg-', 'text-')}` })}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{c.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{c.description}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              layoutId={`card-${activeId}`}
              className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full z-10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              
              <ConceptDetail content={concepts.find(c => c.id === activeId)!} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConceptDetail: React.FC<{ content: typeof concepts[0] }> = ({ content }) => {
  return (
    <div className="flex flex-col md:flex-row h-[500px]">
      <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${content.color.replace('bg-', 'bg-').replace('500', '100')} dark:bg-opacity-20 ${content.color.replace('bg-', 'text-').replace('500', '700')} dark:text-${content.color.split('-')[1]}-400`}>
          Interactive Demo
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{content.title}</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{content.description}</p>
        
        <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            Key takeaway: <br/>
            {content.id === 'watermark' && "Watermarks allow stream processing to handle out-of-order data."}
            {content.id === 'windowing' && "Windows group data by time to perform aggregations."}
            {content.id === 'pardo' && "ParDo is the most generic transform for parallel processing."}
            {content.id === 'checkpoints' && "Checkpoints save the state of operators to persistent storage."}
            {content.id === 'pcollection' && "PCollections are the edges in the execution graph."}
          </p>
        </div>
      </div>
      <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center border-l border-slate-800">
        {content.id === 'windowing' && <WindowingAnimation />}
        {content.id === 'watermark' && <WatermarkAnimation />}
        {content.id === 'pardo' && <ParDoAnimation />}
        {content.id === 'checkpoints' && <CheckpointAnimation />}
        {content.id === 'pcollection' && <PCollectionAnimation />}
      </div>
    </div>
  );
};

/* --- ANIMATIONS --- */

const WindowingAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div className="absolute inset-x-0 bottom-12 h-0.5 bg-slate-700" /> {/* Timeline */}
      
      {/* Windows */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: -200, opacity: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: i * 1.6 }}
          className="absolute bottom-12 h-32 w-24 border-l-2 border-r-2 border-slate-600 bg-slate-800/30 flex flex-col justify-end items-center pb-2"
        >
          <span className="text-xs text-slate-400 mb-1">Window {i+1}</span>
          <div className="flex flex-wrap gap-1 justify-center px-1">
             <motion.div 
               animate={{ scale: [0, 1] }} 
               transition={{ delay: 0.5 }}
               className="w-3 h-3 rounded-full bg-blue-500" 
             />
             <motion.div 
               animate={{ scale: [0, 1] }} 
               transition={{ delay: 1.2 }}
               className="w-3 h-3 rounded-full bg-blue-500" 
             />
             <motion.div 
               animate={{ scale: [0, 1] }} 
               transition={{ delay: 2.5 }}
               className="w-3 h-3 rounded-full bg-blue-500" 
             />
          </div>
        </motion.div>
      ))}

      {/* Falling Events */}
      <motion.div
        animate={{ y: [0, 200], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
        className="absolute top-10 w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]"
      />
    </div>
  );
};

const WatermarkAnimation = () => {
  return (
    <div className="w-full h-full p-8 flex flex-col justify-center">
      <div className="relative h-20 w-full border-b border-slate-700">
        {/* Events on timeline */}
        {[10, 30, 45, 60, 80].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg"
            style={{ left: `${pos}%` }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: -4, opacity: 1 }}
            transition={{ delay: i * 0.5 }}
          >
            T{pos}
          </motion.div>
        ))}

        {/* The Watermark Line */}
        <motion.div
          className="absolute top-[-50px] bottom-0 w-0.5 bg-yellow-500 z-10 flex flex-col items-center"
          animate={{ left: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-1 rounded -mt-4 whitespace-nowrap">
            WM: T<span className="tabular-nums">Dynamic</span>
          </div>
        </motion.div>
      </div>
      <p className="text-center text-slate-400 mt-8 text-sm">
        Events behind the yellow line are "on time". <br/> 
        Events to the left are finalized.
      </p>
    </div>
  );
};

const ParDoAnimation = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full gap-8">
            <div className="flex gap-4">
                <motion.div 
                    animate={{ y: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-white font-bold"
                >In</motion.div>
            </div>
            
            <div className="flex items-center gap-2">
                <ArrowRight className="text-slate-500 rotate-90" />
                <div className="bg-slate-700 px-4 py-2 rounded text-white font-mono text-sm border border-slate-500">
                    processElement()
                </div>
                <ArrowRight className="text-slate-500 rotate-90" />
            </div>

            <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, y: [0, 10, 0] }}
                        transition={{ delay: i * 0.2, repeat: Infinity, duration: 2 }}
                        className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs"
                    >Out</motion.div>
                ))}
            </div>
        </div>
    )
}

const CheckpointAnimation = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 relative">
             <div className="flex gap-8 mb-12">
                <div className="w-16 h-16 border-2 border-slate-600 rounded bg-slate-800 flex items-center justify-center text-slate-300">State A</div>
                <div className="w-16 h-16 border-2 border-slate-600 rounded bg-slate-800 flex items-center justify-center text-slate-300">State B</div>
             </div>

             {/* The Barrier */}
             <motion.div 
                className="absolute top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]"
                initial={{ left: '-10%' }}
                animate={{ left: '110%' }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
             />

             {/* Snapshot */}
             <motion.div
                className="absolute bottom-8 bg-rose-900/50 border border-rose-500 px-4 py-2 rounded text-rose-200 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 0], y: 0 }}
                transition={{ duration: 3, repeat: Infinity, times: [0.4, 0.5, 0.8] }}
             >
                Snapshot Saved to HDFS
             </motion.div>
        </div>
    )
}

const PCollectionAnimation = () => {
    return (
        <div className="flex items-center justify-center gap-2 w-full h-full px-8">
            <motion.div 
                className="w-16 h-16 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-300"
            >
                Transform A
            </motion.div>
            
            <div className="flex-1 h-12 border-t-2 border-b-2 border-dashed border-slate-600 relative overflow-hidden flex items-center">
                <div className="absolute inset-0 bg-slate-800/30" />
                <span className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-xs text-orange-400">PCollection&lt;String&gt;</span>
                
                {[1,2,3,4,5].map(i => (
                    <motion.div
                        key={i}
                        className="w-6 h-6 bg-orange-500 rounded-sm mx-4 shadow-md flex-shrink-0"
                        animate={{ x: [0, 200] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                    />
                ))}
            </div>

            <motion.div 
                className="w-16 h-16 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-300"
            >
                Transform B
            </motion.div>
        </div>
    )
}