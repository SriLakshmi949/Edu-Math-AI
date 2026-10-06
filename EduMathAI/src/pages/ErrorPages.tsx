import React from 'react';
import { AlertOctagon, ShieldAlert, ServerCrash, ArrowLeft, Home } from 'lucide-react';

interface ErrorViewProps {
  type: '404' | '403' | '500';
  onNavigateHome: () => void;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ type, onNavigateHome, onRetry }) => {
  const configs = {
    '404': {
      code: '404',
      title: 'Page Not Found',
      desc: 'The Class 9 mathematical resource or destination you requested does not exist or may have been reorganized.',
      icon: <AlertOctagon className="w-12 h-12 text-sky-400" />,
      accent: 'border-sky-500/30'
    },
    '403': {
      code: '403',
      title: 'Access Restricted',
      desc: 'Role-Based Access Control: Your account role does not have authorization to view this institutional dashboard.',
      icon: <ShieldAlert className="w-12 h-12 text-rose-400" />,
      accent: 'border-rose-500/30'
    },
    '500': {
      code: '500',
      title: 'Server Calculation Error',
      desc: 'An unexpected internal arithmetic or system exception occurred. The server diagnostic telemetry has been logged.',
      icon: <ServerCrash className="w-12 h-12 text-amber-400" />,
      accent: 'border-amber-500/30'
    }
  };

  const config = configs[type];

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className={`glass-card max-w-lg w-full p-8 rounded-3xl border ${config.accent} text-center space-y-5 shadow-2xl`}>
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto shadow-inner">
          {config.icon}
        </div>

        <div>
          <span className="text-4xl font-black text-white font-mono tracking-wider block">
            {config.code}
          </span>
          <h2 className="text-xl font-bold text-white mt-1">{config.title}</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
            {config.desc}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              Retry Operation
            </button>
          )}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/25 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to EduMathAI Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
