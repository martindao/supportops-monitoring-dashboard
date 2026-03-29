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
  open: { label: 'Open', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
  investigating: { label: 'Investigating', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  identified: { label: 'Identified', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  resolved: { label: 'Resolved', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
};

const severityConfig = {
  critical: { label: 'Critical', color: 'text-rose-500' },
  warning: { label: 'Warning', color: 'text-amber-500' },
  info: { label: 'Info', color: 'text-blue-500' },
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-gray-900 border-l border-gray-800 shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gray-500">{incident.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-100">{incident.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-800/50 rounded-lg">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Severity</span>
              <p className={`text-sm font-medium mt-1 ${severity.color}`}>{severity.label}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Service</span>
              <p className="text-sm font-medium text-gray-300 mt-1 capitalize">
                {incident.serviceId.replace('-', ' ')}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Created</span>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(incident.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Updated</span>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(incident.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-4">
              Timeline
            </h3>
            <Timeline events={incident.timeline} />
          </div>

          {/* Related Alerts */}
          {relatedAlertsList.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-4">
                Related Alerts
              </h3>
              <div className="space-y-2">
                {relatedAlertsList.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-gray-800/50 rounded-lg border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-gray-500">{alert.id}</span>
                      <span
                        className={`text-xs capitalize ${
                          alert.severity === 'critical'
                            ? 'text-rose-500'
                            : alert.severity === 'warning'
                            ? 'text-amber-500'
                            : 'text-blue-500'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{alert.title}</p>
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
