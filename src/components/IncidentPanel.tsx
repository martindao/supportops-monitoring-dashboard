import { useEffect } from 'react';
import type { Incident, Alert } from '../types/monitoring';
import { Timeline } from './Timeline';
import { X } from 'lucide-react';

interface IncidentPanelProps {
  incident: Incident | null;
  alerts: Alert[];
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  open: { label: 'Open', textColor: 'var(--semantic-critical)', bgColor: 'var(--semantic-critical-muted)', borderColor: 'rgba(239, 68, 68, 0.25)' },
  investigating: { label: 'Investigating', textColor: 'var(--accent-secondary)', bgColor: 'var(--accent-secondary-muted)', borderColor: 'rgba(245, 158, 11, 0.25)' },
  identified: { label: 'Identified', textColor: 'var(--semantic-info)', bgColor: 'var(--semantic-info-muted)', borderColor: 'rgba(59, 130, 246, 0.25)' },
  resolved: { label: 'Resolved', textColor: 'var(--accent-primary)', bgColor: 'var(--accent-primary-muted)', borderColor: 'rgba(16, 185, 129, 0.25)' },
};

const severityConfig = {
  critical: { label: 'Critical', color: 'var(--semantic-critical)' },
  warning: { label: 'Warning', color: 'var(--accent-secondary)' },
  info: { label: 'Info', color: 'var(--semantic-info)' },
};

export function IncidentPanel({ incident, alerts, isOpen, onClose }: IncidentPanelProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !incident) return null;

  const status = statusConfig[incident.status];
  const severity = severityConfig[incident.severity];
  const relatedAlertsList = alerts.filter((alert) =>
    incident.relatedAlerts.includes(alert.id)
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-lg z-50 overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, var(--surface-900) 0%, var(--surface-950) 100%)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-mono font-medium"
                  style={{ color: 'var(--text-500)' }}
                >
                  {incident.id}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    color: status.textColor,
                    background: status.bgColor,
                    border: `1px solid ${status.borderColor}`
                  }}
                >
                  {status.label}
                </span>
              </div>
              <h2
                className="text-xl font-semibold tracking-tight"
                style={{ color: 'var(--text-100)' }}
              >
                {incident.title}
              </h2>
            </div>
          <button
            onClick={onClose}
            className="incident-close-btn p-2 rounded-lg transition-colors"
            style={{
              background: 'var(--surface-800)',
              border: '1px solid var(--border-subtle)'
            }}
          >
              <X className="w-4 h-4" style={{ color: 'var(--text-400)' }} />
            </button>
          </div>

          {/* Details */}
          <div
            className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl"
            style={{
              background: 'var(--surface-800)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <span
                className="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: 'var(--text-500)' }}
              >
                Severity
              </span>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: severity.color }}
              >
                {severity.label}
              </p>
            </div>
            <div>
              <span
                className="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: 'var(--text-500)' }}
              >
                Service
              </span>
              <p
                className="text-sm font-medium mt-1 capitalize"
                style={{ color: 'var(--text-300)' }}
              >
                {incident.serviceId.replace('-', ' ')}
              </p>
            </div>
            <div>
              <span
                className="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: 'var(--text-500)' }}
              >
                Created
              </span>
              <p className="text-sm mt-1" style={{ color: 'var(--text-400)' }}>
                {new Date(incident.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span
                className="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: 'var(--text-500)' }}
              >
                Updated
              </span>
              <p className="text-sm mt-1" style={{ color: 'var(--text-400)' }}>
                {new Date(incident.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h3
              className="text-[10px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-500)' }}
            >
              Timeline
            </h3>
            <Timeline events={incident.timeline} />
          </div>

          {/* Related Alerts */}
          {relatedAlertsList.length > 0 && (
            <div>
              <h3
                className="text-[10px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-500)' }}
              >
                Related Alerts
              </h3>
              <div className="space-y-2">
                {relatedAlertsList.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg"
                    style={{
                      background: 'var(--surface-800)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-[10px] font-mono font-medium"
                        style={{ color: 'var(--text-500)' }}
                      >
                        {alert.id}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-wide font-semibold"
                        style={{
                          color:
                            alert.severity === 'critical'
                              ? 'var(--semantic-critical)'
                              : alert.severity === 'warning'
                                ? 'var(--accent-secondary)'
                                : 'var(--semantic-info)'
                        }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-300)' }}>
                      {alert.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
