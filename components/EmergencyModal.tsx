import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { EmergencyContent, Language } from '@/types';

interface EmergencyModalProps {
  content: EmergencyContent;
  onClose: () => void;
  lang?: Language;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ content, onClose, lang = 'zh' }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-brand-bg rounded-lg shadow-2xl w-full max-w-md m-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brand-red">{content.title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-brand-red">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-brand-text">
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-bold">{lang === 'zh' ? '美国电话' : 'U.S. Phone Number'}</h3>
                <a href="tel:+17143325323" className="text-brand-red flex items-center space-x-2 mt-1">
                  <Phone size={16} />
                  <span>+1 (714)332-5323 ({content.call})</span>
                </a>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-bold">{lang === 'zh' ? '台湾电话' : 'Taiwan Phone Number'}</h3>
                <a href="tel:+886936615150" className="text-brand-red flex items-center space-x-2 mt-1">
                  <Phone size={16} />
                  <span>+886 0936615150 ({content.call})</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmergencyModal;

