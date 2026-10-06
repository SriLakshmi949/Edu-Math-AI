import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, ExternalLink, Award, FileText, Clock, Sparkles } from 'lucide-react';
import { Notification } from '../types';
import { api } from '../services/api';

interface NotificationsDropdownProps {
  userId: string;
  onNavigate?: (url: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ userId, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    if (!userId) return;
    try {
      const data = await api.getNotifications(userId);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 20000);
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ACHIEVEMENT':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'TEST_RESULT':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'ASSIGNMENT':
        return <Clock className="w-4 h-4 text-purple-400" />;
      case 'RECOMMENDATION':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all border border-slate-700/50"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl glass-card border border-slate-700/80 shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-300 font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-sky-400 transition"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  No notifications yet.
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (notif.actionUrl && onNavigate) {
                        onNavigate(notif.actionUrl);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3.5 hover:bg-slate-800/40 transition cursor-pointer flex gap-3 items-start ${
                      !notif.isRead ? 'bg-sky-500/5' : ''
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 mt-0.5 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className={`text-xs font-semibold truncate ${!notif.isRead ? 'text-white' : 'text-slate-300'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            title="Mark as read"
                            className="text-[10px] text-sky-400 hover:underline shrink-0"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/40 text-center">
              <span className="text-[11px] text-slate-500">EduMathAI Live Updates</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
