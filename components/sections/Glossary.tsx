import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Book, ArrowRight, CornerRightUp, Layers, Zap, Globe, AlignLeft } from 'lucide-react';

interface Term {
  id: string;
  term: string;
  definition: string;
  details: string;
  category: 'Beam' | 'Flink' | 'General';
}

const terms: Term[] = [
  { 
    id: 'pcollection', 
    term: 'PCollection', 
    definition: 'The core abstraction in Beam: an immutable, distributed dataset. It can be bounded (batch) or unbounded (streaming).', 
    details: 'A PCollection (Parallel Collection) is the fundamental data structure in Apache Beam. It represents a potentially huge, distributed dataset. PCollections are immutable; applying a transformation to a PCollection yields a new PCollection. They can be bounded (fixed size, batch processing) or unbounded (infinite, stream processing). Every element in a PCollection has a timestamp and is associated with a Window, which is crucial for event-time processing.',
    category: 'Beam' 
  },
  { 
    id: 'pardo', 
    term: 'ParDo', 
    definition: 'The core parallel processing operation in Beam. Similar to "Map", but more flexible: one input can produce 0, 1, or many outputs.', 
    details: 'ParDo is the most generic parallel processing primitive in Beam. It is similar to the "Map" or "FlatMap" phase in MapReduce but significantly more powerful. It invokes a user-specified function (DoFn) on each element of the input PCollection. A ParDo can filter elements, produce multiple outputs for a single input, or output to different side outputs (Tagging). DoFns have a lifecycle (setup, startBundle, finishBundle, teardown) allowing for resource management like database connections.',
    category: 'Beam' 
  },
  { 
    id: 'watermark', 
    term: 'Watermark', 
    definition: 'A timestamp representing the progress of event time. "No events older than T will arrive". Triggers windows.', 
    details: 'Watermarks are the mechanism Beam and Flink use to solve the problem of out-of-order data in streaming. A watermark is a monotonically increasing timestamp "T" that asserts: "The system believes all data with event time less than T has arrived." When the watermark passes the end of a window, the window is considered complete and can trigger its results. Data arriving after the watermark is considered "late" and requires special handling via "Allowed Lateness" configuration.',
    category: 'Beam' 
  },
  { 
    id: 'backpressure', 
    term: 'Backpressure', 
    definition: 'When a downstream operator is too slow, buffers fill up, forcing upstream operators to slow down. This propagates to the source.', 
    details: 'Backpressure occurs when a system cannot process incoming data as fast as it arrives. In Flink, if a downstream operator (e.g., a complex calculation or a slow database sink) is slow, its input buffers fill up. It stops requesting new data from upstream. This "pressure" propagates up the execution graph all the way to the source, effectively slowing down ingestion. This is a safety mechanism to prevent the system from crashing under load (Out of Memory) but results in increased latency.',
    category: 'General' 
  },
  { 
    id: 'checkpoint', 
    term: 'Checkpoint', 
    definition: 'A periodic, consistent snapshot of the entire distributed job state, used for fault tolerance and recovery.', 
    details: 'Checkpoints are the core of Flink\'s fault tolerance mechanism. Flink injects "Checkpoint Barriers" into the data stream at the source. These barriers flow through the graph. When an operator receives barriers from all its inputs, it snapshots its local state (e.g., current counts, buffers) to durable storage (like HDFS or S3). This algorithm is a variation of Chandy-Lamport. If the job fails, Flink restores all operators to the state of the last completed checkpoint, ensuring exactly-once processing semantics.',
    category: 'Flink' 
  },
  { 
    id: 'state', 
    term: 'State', 
    definition: 'Information remembered across events (e.g., a counter, a buffer). Managed by the runner and fault-tolerant.', 
    details: 'State allows operations to remember information across multiple independent events. In streaming, operations like aggregations (sum, count) or complex pattern matching need to store data. Beam offers partitioned state (Keyed State) like ValueState, BagState, and MapState. This state is managed by the runner (Flink), stored locally (e.g., on the TaskManager heap or in embedded RocksDB), and backed up during checkpoints.',
    category: 'Beam' 
  },
  { 
    id: 'taskmanager', 
    term: 'TaskManager', 
    definition: 'The worker process in Flink. It executes tasks in one or more slots.', 
    details: 'A TaskManager (Worker) is a JVM process in a Flink cluster that executes the actual data processing logic. It accepts tasks from the JobManager. A TaskManager can have multiple task slots, allowing it to execute multiple subtasks in parallel threads. It manages data exchange (network shuffle) between itself and other TaskManagers and handles local state management.',
    category: 'Flink' 
  },
  { 
    id: 'slot', 
    term: 'Slot', 
    definition: 'A slice of resources (CPU/Memory) in a TaskManager. Determines the maximum parallelism per TaskManager.', 
    details: 'A Task Slot represents a fixed slice of resources in a TaskManager. If a TaskManager is configured with 3 slots, it dedicates 1/3 of its managed memory to each slot. Slots provide resource isolation (primarily memory) but typically share CPU threads/cores. The total number of slots in a cluster limits the maximum parallelism a Flink job can achieve. One slot can run one slice of a parallel pipeline.',
    category: 'Flink' 
  },
  { 
    id: 'chaining', 
    term: 'Chaining', 
    definition: 'Optimization where multiple operators are fused into a single thread to reduce serialization and network overhead.', 
    details: 'Operator Chaining is a critical performance optimization in Flink. Consecutive operators (e.g., Source -> Map -> Filter) that have the same degree of parallelism are fused into a single task running in one thread. This eliminates the overhead of serialization/deserialization, thread switching, and network buffering, allowing data to be passed effectively as object references between functions.',
    category: 'Flink' 
  },
  { 
    id: 'sideinput', 
    term: 'Side Input', 
    definition: 'An additional input to a ParDo, usually smaller and slowly changing (e.g., a lookup table broadcast to all workers).', 
    details: 'Side Inputs allow a ParDo transform to access additional data beyond the main input stream. For example, a main stream of "Orders" might need to look up exchange rates from a slowly updating "Rates" stream. The "Rates" PCollection is broadcast to all workers as a Side Input. The main stream processing for a window will be buffered until the corresponding window of the Side Input is ready.',
    category: 'Beam' 
  },
  { 
    id: 'akka', 
    term: 'Akka Framesize', 
    definition: 'The maximum size of a message sent between Flink components (default 10MB). Large records can crash the job if they exceed this.', 
    details: 'Flink uses the Akka actor system for control messages (coordination between JobManager and TaskManager). The `akka.framesize` setting limits the maximum message size (default is often 10MB). While data flows through Netty, control metadata or very large single records in older Flink versions might traverse Akka paths. If a state snapshot metadata or a closure is larger than this limit, the job will fail with a `TooLongFrameException`.',
    category: 'Flink' 
  },
  { 
    id: 'shuffle', 
    term: 'Shuffle', 
    definition: 'Redistributing data across the cluster, typically for GroupByKey operations. Data is partitioned by key.', 
    details: 'A Shuffle is the process of redistributing data between operators, usually involving a network transfer. Operations like `GroupByKey` or `rebalance` trigger a shuffle. Data is hashed by key and sent to the specific TaskManager responsible for that key range. Shuffles are expensive operations involving serialization, network I/O, and often disk I/O (spill-to-disk) if buffers are full.',
    category: 'General' 
  },
  { 
    id: 'partition', 
    term: 'Partition', 
    definition: 'A subset of the data stream processed independently. Parallelism implies multiple partitions.', 
    details: 'A Partition is a subset of a PCollection or Stream that is processed independently. When you set parallelism to 10, the logical stream is divided into 10 physical partitions. Each partition is processed by a separate SubTask instance. Keyed streams are logically partitioned by key, ensuring all records with the same key end up in the same partition to guarantee correctness for stateful operations.',
    category: 'General' 
  },
];

export const Glossary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const filteredTerms = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors duration-300">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <Book className="text-indigo-600 dark:text-indigo-400" /> Glossary
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search terms..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTerms.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTerm(t)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex justify-between items-center group ${
                selectedTerm?.id === t.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                 <div className={`p-1.5 rounded-md flex-shrink-0 ${
                    t.category === 'Beam' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                    t.category === 'Flink' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                    'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                 }`}>
                    {t.category === 'Beam' && <Layers className="w-4 h-4" />}
                    {t.category === 'Flink' && <Zap className="w-4 h-4" />}
                    {t.category === 'General' && <Globe className="w-4 h-4" />}
                 </div>
                 <span>{t.term}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto flex items-center justify-center relative bg-slate-50/50 dark:bg-slate-950/50">
        <AnimatePresence mode="wait">
          {selectedTerm ? (
            <motion.div
              key={selectedTerm.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                <div className="h-64 bg-slate-900 relative flex items-center justify-center overflow-hidden p-8 border-b border-slate-800">
                  <TermVisual id={selectedTerm.id} />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                     <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{selectedTerm.term}</h1>
                     <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        selectedTerm.category === 'Beam' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                        selectedTerm.category === 'Flink' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {selectedTerm.category === 'Beam' && <Layers className="w-3 h-3" />}
                        {selectedTerm.category === 'Flink' && <Zap className="w-3 h-3" />}
                        {selectedTerm.category === 'General' && <Globe className="w-3 h-3" />}
                        {selectedTerm.category}
                     </div>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedTerm.definition}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlignLeft className="w-3 h-3"/> Deep Dive
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-sm">
                        {selectedTerm.details}
                      </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <Book className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select a term to view its definition and visualization.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* --- MINI ANIMATIONS --- */

const TermVisual: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'pcollection': return <AnimPCollection />;
    case 'pardo': return <AnimParDo />;
    case 'watermark': return <AnimWatermark />;
    case 'backpressure': return <AnimBackpressure />;
    case 'checkpoint': return <AnimCheckpoint />;
    case 'state': return <AnimState />;
    case 'taskmanager': return <AnimTaskManager />;
    case 'slot': return <AnimSlot />;
    case 'chaining': return <AnimChaining />;
    case 'sideinput': return <AnimSideInput />;
    case 'akka': return <AnimAkka />;
    case 'shuffle': return <AnimShuffle />;
    case 'partition': return <AnimPartition />;
    default: return <div className="text-slate-500">Visual not available</div>;
  }
};

const AnimBackpressure = () => (
  <div className="flex items-center gap-1 w-full justify-center">
    <div className="w-16 h-16 border-2 border-slate-600 rounded bg-slate-800 flex items-center justify-center text-xs text-white">Source</div>
    <div className="flex-1 h-8 bg-slate-800/50 rounded-full relative overflow-hidden mx-2 flex items-center px-1 gap-1">
       {/* Dots piling up */}
       {[...Array(8)].map((_, i) => (
         <motion.div
            key={i}
            className={`w-4 h-4 rounded-full flex-shrink-0 ${i > 4 ? 'bg-red-500' : 'bg-green-500'}`}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
         />
       ))}
    </div>
    <div className="w-16 h-16 border-2 border-red-500 rounded bg-red-900/20 flex flex-col items-center justify-center text-xs text-white">
      <span>Slow Op</span>
      <span className="text-[10px] text-red-400 mt-1">Stalled</span>
    </div>
  </div>
);

const AnimShuffle = () => (
  <div className="relative w-64 h-32">
     <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2">
        <div className="w-8 h-8 bg-orange-500 rounded text-[10px] flex items-center justify-center text-white">A</div>
        <div className="w-8 h-8 bg-blue-500 rounded text-[10px] flex items-center justify-center text-white">B</div>
        <div className="w-8 h-8 bg-orange-500 rounded text-[10px] flex items-center justify-center text-white">A</div>
     </div>

     <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2">
        <div className="w-8 h-8 bg-orange-500/20 border border-orange-500 rounded text-[10px] flex items-center justify-center text-white">Key A</div>
        <div className="w-8 h-8 bg-blue-500/20 border border-blue-500 rounded text-[10px] flex items-center justify-center text-white">Key B</div>
        <div className="w-8 h-8 bg-green-500/20 border border-green-500 rounded text-[10px] flex items-center justify-center text-white">Key C</div>
     </div>

     <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path d="M 40 20 C 100 20, 150 20, 210 20" stroke="#f97316" strokeWidth="2" fill="none" 
            strokeDasharray="4" animate={{ strokeDashoffset: [100, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
        <motion.path d="M 40 64 C 100 64, 150 64, 210 64" stroke="#3b82f6" strokeWidth="2" fill="none"
            strokeDasharray="4" animate={{ strokeDashoffset: [100, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} />
        <motion.path d="M 40 108 C 100 108, 150 20, 210 20" stroke="#f97316" strokeWidth="2" fill="none"
            strokeDasharray="4" animate={{ strokeDashoffset: [100, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
     </svg>
  </div>
);

const AnimChaining = () => (
  <div className="flex items-center gap-4">
    <div className="flex flex-col gap-2 items-center">
        <div className="w-12 h-12 border border-slate-500 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-300">Map</div>
        <ArrowRight className="rotate-90 text-slate-500" size={16}/>
        <div className="w-12 h-12 border border-slate-500 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-300">Filter</div>
    </div>
    
    <ArrowRight className="text-slate-500" size={24}/>

    <div className="w-24 h-32 border-2 border-green-500 rounded-lg bg-green-900/20 flex flex-col items-center justify-center gap-2 p-2">
        <span className="text-green-400 text-xs font-bold mb-1">Operator Chain</span>
        <div className="w-full h-8 border border-green-700 rounded bg-green-900/50 flex items-center justify-center text-[10px] text-green-200">Map</div>
        <div className="w-full h-8 border border-green-700 rounded bg-green-900/50 flex items-center justify-center text-[10px] text-green-200">Filter</div>
    </div>
  </div>
);

const AnimState = () => {
    const [count, setCount] = useState(0);
    React.useEffect(() => {
        const i = setInterval(() => setCount(c => c + 1), 1000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="flex items-center gap-4">
            <motion.div 
                animate={{ x: [0, 100], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 bg-orange-500 rounded-full"
            />
            <div className="w-24 h-24 border-2 border-indigo-500 rounded-xl bg-slate-800 flex flex-col items-center justify-center relative">
                <span className="text-xs text-indigo-300 absolute top-2">ValueState</span>
                <span className="text-4xl font-mono font-bold text-white">{count}</span>
            </div>
        </div>
    );
};

const AnimSideInput = () => (
    <div className="flex flex-col gap-8 relative w-64">
        {/* Main Stream */}
        <div className="flex items-center gap-2">
            <motion.div className="w-32 h-2 bg-slate-700 rounded overflow-hidden">
                <motion.div className="h-full bg-blue-500 w-12" animate={{ x: [-50, 150] }} transition={{ repeat: Infinity, duration: 2 }} />
            </motion.div>
            <div className="w-16 h-16 border-2 border-slate-500 bg-slate-800 rounded flex items-center justify-center text-xs text-white z-10">ParDo</div>
            <motion.div className="w-16 h-2 bg-slate-700 rounded overflow-hidden">
                <motion.div className="h-full bg-blue-500 w-8" animate={{ x: [-50, 150] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />
            </motion.div>
        </div>

        {/* Side Input */}
        <div className="absolute top-12 left-8">
            <div className="flex items-center">
                 <motion.div 
                    className="w-4 h-4 bg-yellow-500 rounded-sm"
                    animate={{ y: [0, -35], x: [0, 20], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                 />
                 <CornerRightUp className="text-yellow-500 ml-2 -mt-4" />
            </div>
            <span className="text-[10px] text-yellow-500 ml-6">Broadcast View</span>
        </div>
    </div>
);

const AnimSlot = () => (
    <div className="w-48 h-32 border-2 border-slate-600 bg-slate-800 rounded-lg p-2 flex flex-col gap-2">
        <span className="text-xs text-slate-400 text-center">TaskManager (2 Slots)</span>
        <div className="flex-1 flex gap-2">
            <div className="flex-1 border border-slate-500 rounded bg-slate-700/50 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-300">Slot 1</span>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full mt-2" />
            </div>
            <div className="flex-1 border border-slate-500 rounded bg-slate-700/50 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-300">Slot 2</span>
                <span className="text-[10px] text-slate-500 mt-2">Idle</span>
            </div>
        </div>
    </div>
);

const AnimPartition = () => (
    <div className="flex flex-col items-center gap-2">
        <div className="w-32 h-4 bg-slate-700 rounded-full overflow-hidden flex">
            <motion.div animate={{ x: [0, -32] }} transition={{ repeat: Infinity, ease: 'linear', duration: 1 }} className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-3 h-4 flex-shrink-0 ${i % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500'}`} />
                ))}
            </motion.div>
        </div>
        
        <div className="flex gap-8 mt-4">
             <div className="flex flex-col items-center">
                <div className="w-12 h-12 border border-slate-600 rounded bg-slate-800 flex items-center justify-center text-orange-500 font-bold">P1</div>
                <motion.div className="w-2 h-2 bg-orange-500 rounded-full mt-2" animate={{ y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} />
             </div>
             <div className="flex flex-col items-center">
                <div className="w-12 h-12 border border-slate-600 rounded bg-slate-800 flex items-center justify-center text-blue-500 font-bold">P2</div>
                <motion.div className="w-2 h-2 bg-blue-500 rounded-full mt-2" animate={{ y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }} />
             </div>
        </div>
    </div>
);

// Reuse simpler versions of existing animations for others
const AnimPCollection = () => (
    <div className="h-12 w-64 border-t-2 border-b-2 border-dashed border-slate-600 relative overflow-hidden flex items-center bg-slate-800/30">
        {[1,2,3,4].map(i => (
            <motion.div
                key={i}
                className="w-6 h-6 bg-orange-500 rounded-sm mx-8 shadow-md flex-shrink-0 text-[10px] flex items-center justify-center text-white font-mono"
                animate={{ x: [0, 200] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.7 }}
            >
                El
            </motion.div>
        ))}
    </div>
);

const AnimParDo = () => (
    <div className="flex items-center gap-4">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white text-xs">Fn</motion.div>
        <div className="flex flex-col gap-2">
            <motion.div animate={{ x: [0, 20], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 bg-orange-400 rounded-full" />
            <motion.div animate={{ x: [0, 20], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} className="w-4 h-4 bg-orange-400 rounded-full" />
        </div>
    </div>
);

const AnimWatermark = () => (
    <div className="w-64 h-24 relative border-b border-slate-600 flex items-end">
        <motion.div 
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
            animate={{ left: ['10%', '90%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
            <div className="bg-yellow-400 text-slate-900 text-[10px] px-1 absolute -top-4 -left-3">WM</div>
        </motion.div>
        <div className="absolute bottom-2 left-1/4 w-4 h-4 bg-blue-500 rounded opacity-50" />
        <div className="absolute bottom-2 left-1/2 w-4 h-4 bg-blue-500 rounded" />
        <div className="absolute bottom-2 left-3/4 w-4 h-4 bg-blue-500 rounded opacity-30" />
    </div>
);

const AnimCheckpoint = () => (
    <div className="flex flex-col items-center gap-2">
        <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded border border-slate-500" />
            <div className="w-12 h-12 bg-slate-700 rounded border border-slate-500" />
        </div>
        <motion.div 
            className="w-full h-1 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs text-rose-400">Snapshotting...</span>
    </div>
);

const AnimTaskManager = () => (
    <div className="w-32 h-32 bg-slate-800 border-2 border-slate-600 rounded-xl p-2 flex flex-wrap gap-2 content-start">
        <div className="w-full text-center text-xs text-slate-400 mb-1">JVM Process</div>
        {[1,2,3,4].map(i => <div key={i} className="w-12 h-8 bg-slate-700 rounded border border-slate-600" />)}
    </div>
);

const AnimAkka = () => (
    <div className="w-full flex items-center justify-center">
        <div className="relative w-32 h-12 border-2 border-dashed border-red-500 rounded flex items-center justify-center overflow-hidden">
            <span className="text-[10px] text-red-400 absolute top-1">Limit: 10MB</span>
            <motion.div 
                className="h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold"
                animate={{ width: ['20%', '120%'], opacity: [1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Payload
            </motion.div>
        </div>
    </div>
);