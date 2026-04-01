import { useState } from 'react';
import type { Alert } from '../types/monitoring';

interface AlertTableProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  onAcknowledge?: (alertId: string) => void;
  selectedAlertId?: string | null;
}

const severityConfig = {
  critical: {
    bgColor: 'var(--semantic-critical-muted)',
    textColor: 'var(--semantic-critical)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    label: 'Critical',
  },
  warning: {
    bgColor: 'var(--accent-secondary-muted)',
    textColor: 'var(--accent-secondary)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    label: 'Warning',
  },
  info: {
    bgColor: 'var(--semantic-info-muted)',
    textColor: 'var(--semantic-info)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    label: 'Info',
  },
};

const statusConfig = {
  active: {
    bgColor: 'var(--semantic-critical-muted)',
    textColor: 'var(--semantic-critical)',
    label: 'Active',
  },
  acknowledged: {
    bgColor: 'var(--accent-secondary-muted)',
    textColor: 'var(--accent-secondary)',
    label: 'Acknowledged',
  },
  resolved: {
    bgColor: 'var(--accent-primary-muted)',
    textColor: 'var(--accent-primary)',
    label: 'Resolved',
  },
};

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function AlertTable({ alerts, onAlertClick, onAcknowledge, selectedAlertId }: AlertTableProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedId = selectedAlertId ?? internalSelectedId;
  if (alerts.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{
          background: 'var(--surface-800)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <p style={{ color: 'var(--text-500)' }}>No active alerts</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface-800)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
      }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <th
              className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3"
              style={{ color: 'var(--text-500)' }}
            >
              Severity
            </th>
            <th
              className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3"
              style={{ color: 'var(--text-500)' }}
            >
              Service
            </th>
            <th
              className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3"
              style={{ color: 'var(--text-500)' }}
            >
              Title
            </th>
            <th
              className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3"
              style={{ color: 'var(--text-500)' }}
            >
              Time
            </th>
            <th
              className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3"
              style={{ color: 'var(--text-500)' }}
            >
              Status
            </th>
            <th
              className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3"
              style={{ color: 'var(--text-500)' }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const severity = severityConfig[alert.severity];
            const status = statusConfig[alert.status];

        return (
        <tr
          key={alert.id}
          onClick={() => {
            setInternalSelectedId(alert.id);
            onAlertClick?.(alert);
          }}
          className={`alert-table-row cursor-pointer transition-colors ${selectedId === alert.id ? 'alert-row-selected' : ''}`}
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: selectedId === alert.id ? 'var(--surface-700)' : 'transparent'
          }}
        >
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      background: severity.bgColor,
                      color: severity.textColor,
                      border: `1px solid ${severity.borderColor}`
                    }}
                  >
                    {severity.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium capitalize"
                    style={{ color: 'var(--text-400)' }}
                  >
                    {alert.serviceId.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>
                      {alert.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-500)' }}>
                      {alert.message}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs tabular-nums" style={{ color: 'var(--text-500)' }}>
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: status.bgColor,
                      color: status.textColor
                    }}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {alert.status === 'active' && onAcknowledge && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge(alert.id);
                }}
                className="ack-btn px-2.5 py-1 text-xs font-semibold rounded transition-colors"
                style={{
                  color: 'var(--accent-secondary)',
                  background: 'var(--accent-secondary-muted)',
                  border: '1px solid rgba(245, 158, 11, 0.25)'
                }}
              >
                      Acknowledge
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
