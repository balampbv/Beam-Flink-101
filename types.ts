export enum AppSection {
  HOME = 'HOME',
  CONCEPTS = 'CONCEPTS',
  PIPELINE = 'PIPELINE',
  FLINK_SIM = 'FLINK_SIM',
  DEBUG = 'DEBUG',
  GLOSSARY = 'GLOSSARY',
}

export interface SimulationNode {
  id: string;
  type: 'source' | 'map' | 'filter' | 'keyby' | 'window' | 'sink';
  label: string;
  x: number;
  y: number;
  config?: any;
}

export interface Packet {
  id: string;
  nodeId: string;
  progress: number; // 0 to 100
  data: any;
  isLate?: boolean;
}

export interface FlinkSlot {
  id: string;
  tmId: string;
  status: 'idle' | 'running' | 'backpressure' | 'failed';
  taskName?: string;
  load: number;
}

export interface TaskManager {
  id: string;
  slots: FlinkSlot[];
  cpuUsage: number;
  memoryUsage: number;
}

export const BEAM_ORANGE = '#F66D02';
export const FLINK_PINK = '#E65662';