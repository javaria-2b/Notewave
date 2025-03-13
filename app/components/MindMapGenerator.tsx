'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { generateMindMap, MindMapNode } from '../lib/actions';

interface MindMapGeneratorProps {
  noteContent: string;
  noteTitle: string;
  onClose: () => void;
}

export default function MindMapGenerator({ noteContent, noteTitle, onClose }: MindMapGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate mind map data based on note content
  const handleGenerateMindMap = async () => {
    if (!noteContent.trim()) {
      setError("Note content is empty. Cannot generate mind map.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedMindMap = await generateMindMap(noteContent);
      setMindMapData(generatedMindMap);
    } catch (err) {
      console.error("Error generating mind map:", err);
      setError("Failed to generate mind map. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Draw the mind map on canvas when data is available
  useEffect(() => {
    if (!mindMapData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw mind map
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw root node
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 80, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw root text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mindMapData.label, centerX, centerY);
    
    // Draw child nodes
    if (mindMapData.children) {
      const radius = 150;
      const angleStep = (2 * Math.PI) / mindMapData.children.length;
      
      mindMapData.children.forEach((child, index) => {
        const angle = index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Draw line to child
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw child node
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.ellipse(x, y, 60, 30, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw child text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(child.label, x, y);
        
        // Draw grandchildren
        if (child.children) {
          const childRadius = 80;
          const childAngleStep = Math.PI / (child.children.length + 1);
          const baseAngle = angle - Math.PI / 4;
          
          child.children.forEach((grandchild, grandchildIndex) => {
            const grandchildAngle = baseAngle + (grandchildIndex + 1) * childAngleStep;
            const gx = x + childRadius * Math.cos(grandchildAngle);
            const gy = y + childRadius * Math.sin(grandchildAngle);
            
            // Draw line to grandchild
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(gx, gy);
            ctx.stroke();
            
            // Draw grandchild node
            ctx.fillStyle = '#93c5fd';
            ctx.beginPath();
            ctx.ellipse(gx, gy, 50, 20, 0, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw grandchild text
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(grandchild.label, gx, gy);
          });
        }
      });
    }
  }, [mindMapData]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mindMapData && canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        // Redraw mind map (simplified - in a real app, you'd call a draw function)
        setMindMapData({...mindMapData});
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mindMapData]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mind Map: {noteTitle}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!mindMapData ? (
          <div className="text-center py-8">
            <p className="mb-4">Generate a mind map based on your note content to visualize key concepts and their relationships.</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button 
              onClick={handleGenerateMindMap} 
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                  Generating Mind Map...
                </>
              ) : (
                "Generate Mind Map"
              )}
            </Button>
          </div>
        ) : (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Mind Map Visualization</CardTitle>
                <CardDescription>
                  Visual representation of key concepts from your note
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full" 
                    style={{ height: '500px' }}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => setMindMapData(null)} 
                    className="mr-2"
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 