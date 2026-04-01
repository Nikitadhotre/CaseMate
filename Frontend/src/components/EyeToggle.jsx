import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function EyeToggle({ isVisible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
      tabIndex="-1"
    >
      {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );
}

