import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Square, ArrowRight, Trash2, Box, Filter, Server } from 'lucide-react';
import { Button } from '../ui/Button';
import { SimulationNode, Packet } from '../../types';

// Simple types for the playground
type NodeType = 'source' | 'map' | 'filter' | 'sink