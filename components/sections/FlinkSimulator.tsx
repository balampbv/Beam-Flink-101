import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, Activity, AlertCircle } from 'lucide-react';

interface TaskManagerData {
    id: number;
    slots: boolean[]; // true = occupied/busy
    load: number;
}

export const FlinkSimulator: React.FC = () => {
    const [parallelism, setParallelism] = useState(4);
    const [slotsPerTM, setSlotsPerTM] = useState(2);
    const [tmCount, setTmCount] = useState(2);
    const [tms, setTms] = useState<TaskManagerData[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Rebuild cluster when configs change
    useEffect(() => {
        const newTms: TaskManagerData[] = [];
        for (let i = 0; i < tmCount; i++) {
            newTms.push({
                id: i,
                slots: Array(slotsPerTM).fill(false),
                load: 0
            });
        }
        setTms(newTms);
    }, [slotsPerTM, tmCount]);

    // Simulate load distribution
    useEffect(() => {
        if (!isProcessing) {
             setTms(prev => prev.map(tm => ({ ...tm, slots: tm.slots.map(() => false), load: 0 })));
             return;
        }

        const interval = setInterval(() => {
            setTms(prev => {
                let remainingTasks = parallelism;
                return prev.map(tm => {
                    const mySlots = [...tm.slots];
                    let occupiedCount = 0;
                    
                    // Distribute tasks round-robin (simulated)
                    for(let i=0; i<mySlots.length; i++) {
                         if (remainingTasks > 0) {
                             mySlots[i] = true;
                             occupiedCount++;
                             remainingTasks--;
                         } else {
                             mySlots[i] = false;
                         }
                    }
                    
                    // Load fluctuation
                    const baseLoad = (occupiedCount / slotsPerTM) * 60;
                    const noise = Math.random() * 20;
                    
                    return {
                        ...tm,
                        slots: mySlots,
                        load: Math.min(100, baseLoad + noise)
                    };
                });
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isProcessing, parallelism, slotsPerTM, tmCount]);

    const totalSlots = tmCount * slotsPerTM;
    const isOverprovisioned = parallelism > totalSlots;

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Controls */}
            <div className="w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="text-rose-500" /> Cluster Config
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Adjust resources to see how tasks are scheduled.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Parallelism (Tasks)</label>
                        <input 
                            type="range" min="1" max="16" value={parallelism} 
                            onChange={(e) => setParallelism(parseInt(e.target.value))}
                            className="w-full accent-rose-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>1</span>
                            <span className="font-bold text-rose-600">{parallelism}</span>
                            <span>16</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">TaskManagers</label>
                        <input 
                            type="range" min="1" max="8" value={tmCount} 
                            onChange={(e) => setTmCount(parseInt(e.target.value))}
                            className="w-full accent-slate-600"
                        />
                         <div className="text-right text-xs font-bold text-slate-600">{tmCount} TMs</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Slots per TM</label>
                        <input 
                            type="range" min="1" max="4" value={slotsPerTM} 
                            onChange={(e) => setSlotsPerTM(parseInt(e.target.value))}
                            className="w-full accent-slate-600"
                        />
                        <div className="text-right text-xs font-bold text-slate-600">{slotsPerTM} Slots</div>
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={() => setIsProcessing(!isProcessing)}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${isProcessing ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-800 hover:bg-slate-900'}`}
                    >
                        {isProcessing ? 'Stop Workload' : 'Start Job'}
                    </button>
                    {isOverprovisioned && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-100">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>
                                <strong>Backpressure Alert!</strong><br/>
                                Parallelism ({parallelism}) exceeds total slots ({totalSlots}). Tasks will wait.
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Visualizer */}
            <div className="flex-1 bg-slate-100 p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* JobManager */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="col-span-full mb-4"
                    >
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                    <Server className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">JobManager</h3>
                                    <p className="text-xs text-slate-500">Orchestrator</p>
                                </div>
                            </div>
                            <div className="flex gap-8 text-sm">
                                <div>
                                    <span className="text-slate-400">Status</span>
                                    <div className="font-medium text-green-600 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-400">Total Slots</span>
                                    <div className="font-medium text-slate-800">{totalSlots}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* TaskManagers */}
                    {tms.map((tm) => (
                        <motion.div
                            key={tm.id}
                            layout
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-slate-400" />
                                    <span className="font-semibold text-slate-700">TaskManager {tm.id + 1}</span>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                    {isProcessing ? `${Math.round(tm.load)}% CPU` : 'Idle'}
                                </div>
                            </div>
                            
                            {/* Slots Grid */}
                            <div className="p-4 grid grid-cols-2 gap-3">
                                {tm.slots.map((isActive, idx) => (
                                    <div 
                                        key={idx}
                                        className={`
                                            h-16 rounded border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500
                                            ${isActive 
                                                ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm' 
                                                : 'bg-slate-50 border-slate-200 text-slate-300'}
                                        `}
                                    >
                                        <span className="text-xs font-bold uppercase mb-1">Slot {idx + 1}</span>
                                        {isActive && (
                                            <motion.div 
                                                initial={{ scale: 0 }} 
                                                animate={{ scale: 1 }}
                                                className="w-2 h-2 rounded-full bg-rose-500" 
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Load Bar */}
                            <div className="h-1 w-full bg-slate-100">
                                <motion.div 
                                    className={`h-full ${tm.load > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                                    animate={{ width: `${tm.load}%` }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};