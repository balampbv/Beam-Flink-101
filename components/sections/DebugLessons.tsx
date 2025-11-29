import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package, XOctagon } from 'lucide-react';
import { Button } from '../ui/Button';

export const DebugLessons: React.FC = () => {
    const [frameSize, setFrameSize] = useState(5); // MB
    const [exploded, setExploded] = useState(false);

    const checkFrame = () => {
        if (frameSize > 10) {
            setExploded(true);
        } else {
            setExploded(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Debugging Zone</h2>
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-rose-50 border-b border-rose-100 p-6">
                    <h3 className="text-xl font-bold text-rose-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5"/> Lesson 1: Akka Frame Size
                    </h3>
                    <p className="text-rose-600 mt-2">
                        Flink uses Akka for distributed coordination. Messages between actors (TaskManagers) have a size limit (default 10MB).
                        What happens if a single record is too big?
                    </p>
                </div>

                <div className="p-8 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Object Size: <span className="font-bold">{frameSize} MB</span>
                            </label>
                            <input 
                                type="range" 
                                min="1" 
                                max="20" 
                                value={frameSize} 
                                onChange={(e) => { setFrameSize(parseInt(e.target.value)); setExploded(false); }}
                                className="w-full accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>1MB</span>
                                <span className="text-rose-500 font-bold">Limit: 10MB</span>
                                <span>20MB</span>
                            </div>
                         </div>
                         <Button onClick={checkFrame} className="w-full justify-center">
                            Send Record
                         </Button>
                    </div>

                    <div className="flex-1 h-64 bg-slate-100 rounded-xl border border-slate-200 relative flex items-center justify-center p-4">
                        {/* Pipe Visual */}
                        <div className="absolute inset-x-0 h-16 bg-slate-300 rounded overflow-hidden flex items-center">
                            <div className="w-full h-12 border-t border-b border-dashed border-slate-400 flex justify-between px-2 items-center text-xs text-slate-500 font-mono">
                                <span>TM 1</span>
                                <span>Network</span>
                                <span>TM 2</span>
                            </div>
                        </div>

                        {/* The Packet */}
                        <motion.div 
                            key={frameSize} // reset anim on change
                            animate={exploded ? { 
                                x: [0, 50],
                                scale: [1, 1.2],
                                opacity: [1, 0]
                            } : {
                                x: [0, 200],
                            }}
                            transition={{ duration: 1 }}
                            className={`relative z-10 flex items-center justify-center rounded shadow-lg transition-colors
                                ${exploded ? 'bg-red-600' : 'bg-blue-600'}
                            `}
                            style={{ 
                                width: Math.max(40, frameSize * 10), 
                                height: Math.max(40, frameSize * 5) 
                            }}
                        >
                            <Package className="text-white w-6 h-6" />
                        </motion.div>

                        {/* Explosion Effect */}
                        {exploded && (
                            <motion.div 
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                className="absolute z-20 text-red-600 font-bold flex flex-col items-center"
                            >
                                <XOctagon className="w-16 h-16 mb-2" />
                                <span className="bg-white px-2 py-1 rounded shadow text-sm whitespace-nowrap border border-red-200">
                                    TooLongFrameException!
                                </span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};