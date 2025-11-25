import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Pencil } from 'lucide-react';

interface DrawingPadProps {
  color: string;
}

export const DrawingPad: React.FC<DrawingPadProps> = ({ color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 12;
    ctx.strokeStyle = color;
    
    setContext(ctx);
  }, [color]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    e.preventDefault(); // Prevent scrolling on touch
    const { x, y } = getCoordinates(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="relative w-full max-w-sm aspect-square bg-white rounded-3xl border-4 border-dashed border-gray-300 overflow-hidden shadow-inner">
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-9xl font-display text-gray-400 select-none">✍️</span>
         </div>
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex gap-4">
        <button 
          onClick={clearCanvas}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 font-bold transition-colors"
        >
          <Eraser size={20} />
          重写
        </button>
      </div>
    </div>
  );
};