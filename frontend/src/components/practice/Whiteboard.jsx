import { useState, useRef, useEffect } from 'react';
import ToolBar from './ToolBar';
import { Palette, Eraser, Square, SquareDashed, Circle, Type, Save, Download } from 'lucide-react';
import Button from '../common/Button';
import { createAuthedSocket } from '../../utils/socket';

const Whiteboard = ({ questionId, whiteboardId }) => {
  const canvasRef = useRef(null);
  const boardRef = useRef(null);
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
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null); // {x, y, w, h}
  const itemsEmitRafRef = useRef(null);

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

    // Live collaboration: receive peer item overlays
    socket.on('whiteboard:items', ({ items: peerItems }) => {
      if (Array.isArray(peerItems)) {
        setItems(peerItems);
      }
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

    socket.on('whiteboard:clear', () => {
      const canvas = canvasRef.current;
      const ctx = canvasRef.current?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  // Emit items overlay to peers (throttled with rAF)
  const emitItems = (nextItems) => {
    if (!socketRef.current || !whiteboardId) return;
    const doEmit = () => {
      itemsEmitRafRef.current = null;
      socketRef.current.emit('whiteboard:items', { whiteboardId, items: nextItems });
    };
    if (itemsEmitRafRef.current) return;
    itemsEmitRafRef.current = requestAnimationFrame(doEmit);
  };

  // Draw a single icon item into canvas honoring tint color
  const drawItemToCtx = (ctx, item) => {
    const img = new Image();
    img.onload = () => {
      if (!item.tint) {
        ctx.drawImage(img, item.x, item.y, item.width, item.height);
        return;
      }
      const off = document.createElement('canvas');
      off.width = item.width;
      off.height = item.height;
      const offCtx = off.getContext('2d');
      offCtx.drawImage(img, 0, 0, item.width, item.height);
      offCtx.globalCompositeOperation = 'source-in';
      offCtx.fillStyle = item.tint;
      offCtx.fillRect(0, 0, item.width, item.height);
      ctx.drawImage(off, item.x, item.y);
    };
    img.src = item.src;
  };

  // Paint provided items onto canvas and broadcast snapshot
  const bakeItemsToCanvas = (itemsToBake) => {
    if (!itemsToBake || itemsToBake.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    itemsToBake.forEach((it) => drawItemToCtx(ctx, it));
    if (socketRef.current && whiteboardId) {
      const image = canvas.toDataURL('image/png');
      socketRef.current.emit('whiteboard:snapshot', { whiteboardId, image });
    }
  };

  const startDrawing = (e) => {
    if (tool === 'select') {
      // Begin marquee selection
      const rect = boardRef.current?.getBoundingClientRect();
      const startX = e.clientX - (rect?.left || 0);
      const startY = e.clientY - (rect?.top || 0);
      setIsSelecting(true);
      setSelectionRect({ x: startX, y: startY, w: 0, h: 0 });
      const onMove = (ev) => {
        const curX = ev.clientX - (rect?.left || 0);
        const curY = ev.clientY - (rect?.top || 0);
        const x = Math.min(startX, curX);
        const y = Math.min(startY, curY);
        const w = Math.abs(curX - startX);
        const h = Math.abs(curY - startY);
        setSelectionRect({ x, y, w, h });
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        setIsSelecting(false);
        // Use the final rect directly for faster selection resolution
        const finalRect = selectionRect;
        setSelectedIds(items.filter((it) => rectsIntersect({ x: it.x, y: it.y, w: it.width, h: it.height }, finalRect || { x: 0, y: 0, w: 0, h: 0 })).map((it) => it.id));
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      return;
    }
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

  // Helper: AABB intersection
  const rectsIntersect = (a, b) => {
    if (!a || !b) return false;
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  };

  // Select single item on click
  const handleItemMouseDown = (e, id) => {
    if (tool === 'select') {
      // Select the item and allow drag
      setSelectedIds([id]);
    }
    startDragItem(e, id);
  };

  // Keyboard handlers for delete/backspace
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length) {
          setItems((prev) => {
            const remaining = prev.filter((it) => !selectedIds.includes(it.id));
            emitItems(remaining);
            return remaining;
          });
          setSelectedIds([]);
        }
        if (selectionRect) {
          // Clear canvas area inside selection rect
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (canvas && ctx) {
            ctx.clearRect(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
          }
          setSelectionRect(null);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIds, selectionRect]);

  // When picking a color, update selected icons' tint if any are selected
  const handlePickColor = (nextColor) => {
    if (selectedIds.length) {
      setItems((prev) => {
        const updated = prev.map((it) => selectedIds.includes(it.id) ? { ...it, tint: nextColor } : it);
        emitItems(updated);
        return updated;
      });
    } else {
      setColor(nextColor);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (socketRef.current && whiteboardId) {
      socketRef.current.emit('whiteboard:clear', { whiteboardId });
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `system-design-${questionId}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // Drag-and-drop icons from ToolBar
  const handleDrop = (e) => {
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    try {
      const payload = JSON.parse(raw);
      if (payload?.type !== 'WHITEBOARD_ICON') return;
      const rect = boardRef.current?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);
      const size = 64;
      const newItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        key: payload.item.key,
        src: payload.item.src,
        x: Math.max(0, x - size / 2),
        y: Math.max(0, y - size / 2),
        width: size,
        height: size
      };
      setItems((prev) => {
        const next = [...prev, newItem];
        emitItems(next);
        return next;
      });
    } catch {}
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const startDragItem = (e, id) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, _drag: { startX, startY, startXPos: it.x, startYPos: it.y } } : it));
    const onMove = (ev) => {
      const rect = boardRef.current?.getBoundingClientRect();
      setItems((prev) => {
        const next = prev.map((it) => {
          if (it.id !== id || !it._drag) return it;
          const dx = ev.clientX - it._drag.startX;
          const dy = ev.clientY - it._drag.startY;
          const newX = it._drag.startXPos + dx;
          const newY = it._drag.startYPos + dy;
          const maxX = (rect?.width || 0) - it.width;
          const maxY = (rect?.height || 0) - it.height;
          return { ...it, x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) };
        });
        emitItems(next);
        return next;
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setItems((prev) => {
        const after = prev.map((it) => it.id === id ? { ...it, _drag: undefined } : it);
        emitItems(after);
        return after;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const startResizeItem = (e, id) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, _resize: { startX, startY, startW: it.width, startH: it.height } } : it));
    const onMove = (ev) => {
      setItems((prev) => {
        const next = prev.map((it) => {
          if (it.id !== id || !it._resize) return it;
          const dx = ev.clientX - it._resize.startX;
          const dy = ev.clientY - it._resize.startY;
          const width = Math.max(24, it._resize.startW + dx);
          const height = Math.max(24, it._resize.startH + dy);
          return { ...it, width, height };
        });
        emitItems(next);
        return next;
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setItems((prev) => {
        const after = prev.map((it) => it.id === id ? { ...it, _resize: undefined } : it);
        emitItems(after);
        return after;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const tools = [
    { name: 'pen', icon: Type, label: 'Pen' },
    { name: 'eraser', icon: Eraser, label: 'Eraser' },
    { name: 'select', icon: SquareDashed, label: 'Select area' },
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
            <Button variant="outline" size="small" onClick={() => bakeItemsToCanvas(items)}>
              Bake
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
                onClick={() => handlePickColor(colorOption)}
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

      <div className="flex-1 p-4">
        <div className="h-full w-full flex gap-3">
          <div className="w-56 shrink-0">
            <ToolBar />
          </div>
          <div
            ref={boardRef}
            className="relative flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className={`absolute inset-0 w-full h-full ${tool === 'select' ? 'cursor-crosshair' : 'cursor-crosshair'}`}
            />
            {isSelecting && selectionRect && (
              <div
                className="absolute border-2 border-primary-500/60 bg-primary-500/10 pointer-events-none"
                style={{ left: selectionRect.x, top: selectionRect.y, width: selectionRect.w, height: selectionRect.h }}
              />
            )}
            {items.map((it) => (
              <div
                key={it.id}
                className={`absolute group ${selectedIds.includes(it.id) ? 'ring-2 ring-primary-500' : ''}`}
                style={{ left: it.x, top: it.y, width: it.width, height: it.height, cursor: 'move' }}
                onMouseDown={(e) => handleItemMouseDown(e, it.id)}
              >
                {it.tint ? (
                  <div
                    className="w-full h-full select-none pointer-events-none"
                    style={{
                      WebkitMaskImage: `url(${it.src})`,
                      maskImage: `url(${it.src})`,
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      backgroundColor: it.tint
                    }}
                  />
                ) : (
                  <img src={it.src} alt={it.key} className="w-full h-full select-none pointer-events-none" />
                )}
                <div
                  onMouseDown={(e) => startResizeItem(e, it.id)}
                  className="absolute -bottom-1 -right-1 h-3 w-3 bg-primary-500 rounded-sm border border-white shadow opacity-0 group-hover:opacity-100 cursor-se-resize"
                />
              </div>
            ))}
          </div>
        </div>
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