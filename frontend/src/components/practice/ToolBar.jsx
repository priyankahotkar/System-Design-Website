import { useMemo } from 'react';
import { getIconEntries } from '../../services/iconService';

const DRAG_TYPE = 'WHITEBOARD_ICON';

const ToolBar = ({ onDragStart }) => {
  const items = useMemo(() => getIconEntries(), []);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: DRAG_TYPE, item }));
    if (onDragStart) onDragStart(item);
  };

  return (
    <div className="card p-3 flex flex-col gap-2 max-h-[70vh] overflow-auto">
      <div className="text-xs font-medium text-slate-600 mb-1">Tools</div>
      <div className="grid grid-cols-4 gap-2">
        {items.map(({ key, src }) => (
          <button
            key={key}
            draggable
            onDragStart={(e) => handleDragStart(e, { key, src })}
            className="flex items-center justify-center h-12 w-12 rounded-md border border-slate-200 bg-white hover:bg-slate-50 active:scale-[.98]"
            title={key}
          >
            <img src={src} alt={key} className="h-6 w-6 pointer-events-none" />
          </button>
        ))}
      </div>
      <div className="text-[11px] text-slate-500 mt-2">Drag an item onto the whiteboard</div>
    </div>
  );
};

export default ToolBar;


