import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, Users, HeartHandshake, School as SchoolIcon, ShieldCheck } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, showIcon = true, size = 'sm' }) => {
  const configs: Record<UserRole, { label: string; icon: React.ReactNode; style: string }> = {
    STUDENT: {
      label: 'Student',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      style: 'bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-sky-500/10'
    },
    TEACHER: {
      label: 'Teacher',
      icon: <Users className="w-3.5 h-3.5" />,
      style: 'bg-purple-500/15 text-purple-400 border-purple-500/30 shadow-purple-500/10'
    },
    PARENT: {
      label: 'Parent',
      icon: <HeartHandshake className="w-3.5 h-3.5" />,
      style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
    },
    SCHOOL_ADMIN: {
      label: 'School Admin',
      icon: <SchoolIcon className="w-3.5 h-3.5" />,
      style: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10'
    },
    PLATFORM_ADMIN: {
      label: 'Platform Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      style: 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10'
    }
  };

  const config = configs[role] || configs.STUDENT;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-2',
    lg: 'text-base px-4 py-1.5 gap-2.5 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm backdrop-blur-md ${config.style} ${sizeClasses[size]}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
