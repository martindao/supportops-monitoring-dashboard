import type { Alert } from '../types/monitoring';

interface AlertTableProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  onAcknowledge?: (alertId: string) => void;
}

const severityConfig = {
  critical: {
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    borderColor: 'border-rose-500/30',
    label: 'Critical',
  },
  warning: {
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    label: 'Warning',
  },
  info: {
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    label: 'Info',
  },
};

const statusConfig = {
  active: {
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    label: 'Active',
  },
  acknowledged: {
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    label: 'Acknowledged',
  },
  resolved: {
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
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

export function AlertTable({ alerts, onAlertClick, onAcknowledge }: AlertTableProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-500">No active alerts</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
              Severity
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
              Service
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
              Title
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
              Time
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
              Status
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
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
                onClick={() => onAlertClick?.(alert)}
                className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${severity.bgColor} ${severity.textColor} ${severity.borderColor}`}
                  >
                    {severity.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-400 capitalize">
                    {alert.serviceId.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{alert.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.textColor}`}
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
                      className="px-2.5 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded hover:bg-amber-500/20 transition-colors"
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
