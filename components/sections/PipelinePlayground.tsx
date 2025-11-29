import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Square, ArrowRight, Trash2, Box, Filter, Server } from 'lucide-react';
import { Button } from '../ui/Button';
import { SimulationNode, Packet } from '../../types';

// Simple types for the playground
type NodeType = 'source' | 'map' | 'filter' | 'sink';

const NODE_CONFIG = {
  source: { label: 'Kafka Source', color: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300', icon: Server, processingTime: 500 },
  map: { label: 'ParDo (Map)', color: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300', icon: Box, processingTime: 800 },
  filter: { label: 'Filter (>10)', color: 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/40 dark:border-orange-700 dark:text-orange-300', icon: Filter, processingTime: 300 },
  sink: { label: 'Sink', color: 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300', icon: Square, processingTime: 100 },
};

export const PipelinePlayground: React.FC = () => {
  const [nodes, setNodes] = useState<SimulationNode[]>([
    { id: '1', type: 'source', label: 'Kafka', x: 50, y: 150 },
    { id: '2', type: 'sink', label: 'Console', x: 600, y: 150 },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const nextId = useRef(3);
  const packetId = useRef(0);

  // Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPackets(prev => {
        const newPackets = prev.map(p => {
            // Find current node index
            const currentNodeIndex = nodes.findIndex(n => n.id === p.nodeId);
            const currentNode = nodes[currentNodeIndex];
            
            // Logic: Move progress forward
            let nextProgress = p.progress + (1000 / NODE_CONFIG[currentNode.type as NodeType].processingTime) * 5; 

            if (nextProgress >= 100) {
                // Move to next node
                if (currentNodeIndex < nodes.length - 1) {
                    // Check logic (Filter)
                    if (currentNode.type === 'filter' && Math.random() > 0.5) {
                        return null; // Drop packet
                    }
                    return { ...p, nodeId: nodes[currentNodeIndex + 1].id, progress: 0 };
                } else {
                    return null; // Finished
                }
            }
            return { ...p, progress: nextProgress };
        }).filter(Boolean) as Packet[];

        // Generate new packet at source
        if (Math.random() > 0.8) { // Random emission
            newPackets.push({
                id: `pkt-${packetId.current++}`,
                nodeId: nodes[0].id,
                progress: 0,
                data: {}
            });
        }

        return newPackets;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, nodes]);

  const addNode = (type: NodeType) => {
    // Insert before the sink
    const newNodes = [...nodes];
    const sinkIndex = newNodes.length - 1;
    const prevNode = newNodes[sinkIndex - 1];
    
    // Simple layout logic
    const x = prevNode.x + 150;
    
    // Shift sink
    newNodes[sinkIndex].x = x + 150;

    newNodes.splice(sinkIndex, 0, {
        id: String(nextId.current++),
        type,
        label: NODE_CONFIG[type].label,
        x,
        y: 150
    });
    setNodes(newNodes);
  };

  const removeNode = (id: string) => {
    if (id === nodes[0].id || id === nodes[nodes.length-1].id) return; // Cant remove source/sink
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex gap-2">
            <h2 className="text-lg font-bold mr-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Box className="text-orange-500"/> Pipeline Simulator
            </h2>
            <Button variant="secondary" onClick={() => addNode('map')} icon={<Plus size={16}/>}>Add ParDo</Button>
            <Button variant="secondary" onClick={() => addNode('filter')} icon={<Filter size={16}/>}>Add Filter</Button>
        </div>
        <div className="flex gap-2">
             <Button 
                variant={isRunning ? 'danger' : 'primary'} 
                onClick={() => setIsRunning(!isRunning)}
                icon={isRunning ? <Square size={16}/> : <Play size={16}/>}
            >
                {isRunning ? 'Stop' : 'Simulate'}
            </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
         <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }} 
         />
         <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw connections */}
            {nodes.map((node, i) => {
                if (i === nodes.length - 1) return null;
                const next = nodes[i + 1];
                return (
                    <line 
                        key={`link-${node.id}-${next.id}`}
                        x1={node.x + 60} 
                        y1={node.y + 40} 
                        x2={next.x + 60} 
                        y2={next.y + 40} 
                        className="stroke-slate-300 dark:stroke-slate-700"
                        strokeWidth="4" 
                        strokeDasharray="8 4"
                    />
                );
            })}
         </svg>

         {/* Draw Nodes */}
         {nodes.map((node) => {
            const config = NODE_CONFIG[node.type as NodeType];
            const Icon = config.icon;
            
            return (
                <motion.div
                    key={node.id}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x: node.x, y: node.y }}
                    className={`absolute w-32 h-20 rounded-lg border-2 shadow-sm flex flex-col items-center justify-center z-10 transition-colors ${config.color}`}
                >
                    <Icon className="mb-1 w-5 h-5 opacity-70" />
                    <span className="text-xs font-bold text-center px-1">{node.label}</span>
                    {node.type !== 'source' && node.type !== 'sink' && (
                        <button 
                            onClick={() => removeNode(node.id)}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200 dark:bg-red-900/80 dark:text-red-300 dark:hover:bg-red-800"
                        >
                            <Trash2 size={12}/>
                        </button>
                    )}
                </motion.div>
            );
         })}

         {/* Draw Packets */}
         <div className="absolute inset-0 pointer-events-none">
             {packets.map(p => {
                 const nodeIndex = nodes.findIndex(n => n.id === p.nodeId);
                 if (nodeIndex === -1) return null;
                 const currentNode = nodes[nodeIndex];
                 
                 // Interpolate position based on progress
                 let x = currentNode.x + 60;
                 let y = currentNode.y + 40;
                 let scale = 1;

                 if (p.progress > 50 && nodeIndex < nodes.length - 1) {
                     const nextNode = nodes[nodeIndex + 1];
                     const travelRatio = (p.progress - 50) / 50;
                     x = (currentNode.x + 60) + ((nextNode.x + 60) - (currentNode.x + 60)) * travelRatio;
                     y = (currentNode.y + 40) + ((nextNode.y + 40) - (currentNode.y + 40)) * travelRatio;
                     scale = 0.6; // Smaller when traveling
                 }

                 return (
                     <motion.div
                        key={p.id}
                        className="absolute w-4 h-4 bg-indigo-500 rounded-full shadow-sm z-20 border border-white dark:border-slate-800"
                        style={{ left: x - 8, top: y - 8 }}
                        animate={{ scale }}
                     />
                 )
             })}
         </div>

         {/* Legend/Info */}
         <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg text-sm text-slate-500 dark:text-slate-400 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
            <p className="font-bold mb-1 text-slate-700 dark:text-slate-300">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-green-700 dark:text-green-400">Source</strong> emits events randomly.</li>
                <li><strong className="text-blue-700 dark:text-blue-400">ParDo</strong> transforms data (delay).</li>
                <li><strong className="text-orange-700 dark:text-orange-400">Filter</strong> randomly drops 50% of events.</li>
                <li>Watch events flow to the Sink!</li>
            </ul>
         </div>
      </div>
    </div>
  );
};