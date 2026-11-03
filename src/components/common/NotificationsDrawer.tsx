import React from 'react';
import { useDemoData } from '@/context/DemoDataContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useDemoData();
  const { role } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const relevantNotifications = notifications.filter(
    (n) => n.recipientRole === 'all' || n.recipientRole === role
  );

  const handleNotificationClick = (notifId: string, ticketId?: string) => {
    markNotificationAsRead(notifId);
    if (ticketId) {
      onClose();
      if (role === 'admin') {
        navigate(`/admin/complaints?ticket=${ticketId}`);
      } else {
        navigate(`/student/complaints?ticket=${ticketId}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-md bg-surface-1 border-l border-border-subtle flex flex-col shadow-2xl relative h-full">
        {/* Header */}
        <div className="p-space-md border-b border-border-subtle flex items-center justify-between bg-surface-raised">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">notifications_active</span>
            <div>
              <h3 className="font-headline-4 text-headline-4 text-text-primary">Civic Signals &amp; Alerts</h3>
              <p className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">
                {role === 'admin' ? 'Administrative Operations' : 'Student Redressal Node'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Action bar */}
        <div className="px-space-md py-2 bg-surface-inset border-b border-border-subtle flex items-center justify-between">
          <span className="font-micro-label text-micro-label text-text-muted">
            {relevantNotifications.filter((n) => !n.isRead).length} UNREAD TRANSMISSIONS
          </span>
          <button
            onClick={() => markAllNotificationsAsRead(role || undefined)}
            className="font-micro-label text-micro-label text-brand-300 hover:text-brand-200 uppercase tracking-wider transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
          {relevantNotifications.length === 0 ? (
            <div className="p-8 text-center text-text-muted flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-text-disabled">notifications_off</span>
              <p className="font-body-sm text-body-sm">No notification transmissions currently on frequency.</p>
            </div>
          ) : (
            relevantNotifications.map((notif) => {
              const isAlert = notif.type === 'alert' || notif.type === 'escalation';
              const isSuccess = notif.type === 'success';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.ticketId)}
                  className={`p-space-md flex items-start gap-3 transition-colors cursor-pointer ${
                    notif.isRead ? 'bg-surface-1 hover:bg-surface-2 opacity-75' : 'bg-surface-2/60 hover:bg-surface-2'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isAlert
                        ? 'bg-status-reopened-bg text-priority-critical'
                        : isSuccess
                        ? 'bg-status-verified-bg text-status-verified-text'
                        : 'bg-surface-3 text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isAlert ? 'warning' : isSuccess ? 'task_alt' : 'info'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-label text-label font-semibold text-text-primary truncate">
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-copper-400 shrink-0"></span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {notif.ticketId && (
                        <span className="px-1.5 py-0.5 rounded bg-surface-3 font-micro-label text-micro-label text-copper-400 font-mono">
                          #{notif.ticketId}
                        </span>
                      )}
                      <span className="font-micro-label text-micro-label text-text-muted">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-inset border-t border-border-subtle flex items-center justify-between text-text-muted text-xs">
          <span className="font-micro-label text-micro-label">SanketOne Telemetry Engine</span>
          <span className="font-micro-label text-micro-label text-brand-300">REALTIME WEBSOCKET EMULATION</span>
        </div>
      </div>
    </div>
  );
};

