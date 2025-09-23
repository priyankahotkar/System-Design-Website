import { useState, useRef, useEffect } from 'react';
import { Palette, Eraser, Square, Circle, Type, Save, Download } from 'lucide-react';
import Button from '../common/Button';
import { createAuthedSocket } from '../../utils/socket';

const Whiteboard = ({ questionId, whiteboardId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(2);
  const socketRef = useRef(null);
  const ctxRef = useRef(null);
  const drawQueueRef = useRef([]);
  const rafRef = useRef(null);
  const lastPointRef = useRef(null);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (!whiteboardId) return;
    const socket = createAuthedSocket();
    if (!socket) return;
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('whiteboard:join', { whiteboardId });
    });

    socket.on('whiteboard:init', ({ snapshotImage, strokes }) => {
      // draw latest saved image state if available
      if (snapshotImage) {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = ctxRef.current;
          if (!canvas || !ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = snapshotImage;
      }
      // Replay strokes after snapshot
      if (Array.isArray(strokes) && strokes.length) {
        drawQueueRef.current.push(...strokes);
        scheduleDraw();
      }
    });

    socket.on('whiteboard:update', ({ type, x, y, tool: peerTool, color: peerColor, lineWidth: peerWidth, fullState }) => {
      // Apply fullState image if provided (e.g., after someone finished a stroke)
      if (fullState && fullState.image) {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = ctxRef.current;
          if (!canvas || !ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = fullState.image;
        return;
      }

      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      if (type === 'strokeStart') {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (type === 'strokeMove') {
        if (peerTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = (peerWidth || 2) * 3;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = peerColor || '#2563eb';
          ctx.lineWidth = peerWidth || 2;
        }
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (type === 'strokeEnd') {
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
      }
    });

    socket.on('whiteboard:stroke', ({ stroke }) => {
      if (!stroke) return;
      drawQueueRef.current.push(stroke);
      scheduleDraw();
    });

    socket.on('whiteboard:snapshot', ({ image }) => {
      if (!image) return;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = image;
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [whiteboardId]);

  const scheduleDraw = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;
      let stroke;
      while ((stroke = drawQueueRef.current.shift())) {
        const { x1, y1, x2, y2, color: sColor, thickness, erase } = stroke;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        if (erase) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = (thickness || 2) * 3;
        } else {
          ctx.strokeStyle = sColor || '#2563eb';
          ctx.lineWidth = thickness || 2;
          ctx.globalCompositeOperation = 'source-over';
        }
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
      }
      // reset to normal after batch
      ctx.globalCompositeOperation = 'source-over';
    });
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    lastPointRef.current = { x, y };
    // set mode immediately for first segment
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    if (socketRef.current && whiteboardId) {
      socketRef.current.emit('whiteboard:update', { whiteboardId, type: 'strokeStart', x, y });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x2 = e.clientX - rect.left;
    const y2 = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    
    const isErase = tool === 'eraser';
    if (isErase) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (socketRef.current && whiteboardId) {
      // Emit stroke segment (approximate by using previous point from path)
      const prev = lastPointRef.current || { x: x2, y: y2 };
      const now = performance.now();
      if (now - lastEmitRef.current >= 16) { // ~60fps throttle
        socketRef.current.emit('whiteboard:stroke', {
          whiteboardId,
          stroke: { x1: prev.x, y1: prev.y, x2, y2, color, thickness: lineWidth, erase: isErase, ts: Date.now() },
        });
        lastEmitRef.current = now;
      }
      lastPointRef.current = { x: x2, y: y2 };
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
    if (socketRef.current && whiteboardId) {
      socketRef.current.emit('whiteboard:update', { whiteboardId, type: 'strokeEnd' });

      // snapshot current canvas and send as fullState for persistence and late joiners
      const canvas = canvasRef.current;
      if (canvas) {
        const image = canvas.toDataURL('image/png');
        socketRef.current.emit('whiteboard:snapshot', { whiteboardId, image });
      }
    }
    // ensure we return to normal mode
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.globalCompositeOperation = 'source-over';
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `system-design-${questionId}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const tools = [
    { name: 'pen', icon: Type, label: 'Pen' },
    { name: 'eraser', icon: Eraser, label: 'Eraser' },
    { name: 'rectangle', icon: Square, label: 'Rectangle' },
    { name: 'circle', icon: Circle, label: 'Circle' }
  ];

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2'];

  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Whiteboard</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="small" onClick={saveCanvas}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="small" onClick={clearCanvas}>
              Clear
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            {tools.map((toolItem) => (
              <button
                key={toolItem.name}
                onClick={() => setTool(toolItem.name)}
                className={`p-2 rounded-md transition-colors ${
                  tool === toolItem.name 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={toolItem.label}
              >
                <toolItem.icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-slate-400" />
            {colors.map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => setColor(colorOption)}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === colorOption ? 'border-slate-400' : 'border-slate-200'
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-slate-600">Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(e.target.value)}
              className="w-20"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-0">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full cursor-crosshair bg-white"
          style={{ minHeight: '500px' }}
        />
      </div>

      <div className="p-4 border-t border-slate-200 text-center">
        <p className="text-sm text-slate-500">
          💡 Tip: Use the whiteboard to design system architecture, draw diagrams, and visualize your solution
        </p>
      </div>
    </div>
  );
};

export default Whiteboard;