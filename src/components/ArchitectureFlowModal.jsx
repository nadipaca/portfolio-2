import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';

export default function ArchitectureFlowModal({ open, onClose, title, flow }) {
  const [zoom, setZoom] = useState(1);

  const safeFlow = useMemo(() => (Array.isArray(flow) ? flow : []), [flow]);
  const canZoomOut = zoom > 0.75;
  const canZoomIn = zoom < 1.75;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-4 md:inset-10 z-[71] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Architecture flow"
          >
            <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Architecture</div>
                <div className="text-lg font-bold text-slate-900">{title || 'System Architecture Flow'}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => canZoomOut && setZoom((z) => Math.max(0.75, Math.round((z - 0.25) * 100) / 100))}
                  disabled={!canZoomOut}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  aria-label="Zoom out"
                >
                  <Minus size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => canZoomIn && setZoom((z) => Math.min(1.75, Math.round((z + 0.25) * 100) / 100))}
                  disabled={!canZoomIn}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  aria-label="Zoom in"
                >
                  <Plus size={16} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
              <div className="mx-auto max-w-5xl">
                <div className="text-xs text-slate-500 mb-4">
                  Tip: use +/- to zoom. This is a “documentation-style” view of the system flow.
                </div>
                <div
                  className="bg-white border border-slate-200 rounded-2xl p-6 overflow-auto"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                >
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {safeFlow.map((node, idx) => (
                      <div key={`${node}-${idx}`} className="flex items-center gap-4">
                        <div className="px-5 py-2.5 rounded-full border border-blue-200 bg-blue-50 text-blue-900 font-semibold">
                          {node}
                        </div>
                        {idx < safeFlow.length - 1 && (
                          <div className="text-blue-600 font-bold select-none">→</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


