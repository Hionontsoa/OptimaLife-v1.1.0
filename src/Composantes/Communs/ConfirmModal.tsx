import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Supprimer", 
  cancelText = "Annuler",
  type = "danger"
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  title: string, 
  message: string,
  confirmText?: string,
  cancelText?: string,
  type?: "danger" | "warning"
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
        >
          <div className={`w-16 h-16 ${type === 'danger' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400'} rounded-full flex items-center justify-center mb-6 mx-auto`}>
            {type === 'danger' ? <Trash2 size={32} /> : <AlertTriangle size={32} />}
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-2 font-display">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8">{message}</p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 ${type === 'danger' ? 'bg-rose-500 shadow-rose-200 dark:shadow-none' : 'bg-amber-500 shadow-amber-200 dark:shadow-none'} text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
