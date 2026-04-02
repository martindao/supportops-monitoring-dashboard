import { useState } from 'react';
import type { Alert } from '../types/monitoring';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AlertTableProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  onAcknowledge?: (alertId: string) => void;
  selectedAlertId?: string | null;
}

const severityVariants = {
  critical: 'destructive' as const,
  warning: 'secondary' as const,
  info: 'outline' as const,
};

const statusVariants = {
  active: 'destructive' as const,
  acknowledged: 'secondary' as const,
  resolved: 'default' as const,
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
      <Card className="rounded-xl p-8 text-center">
        <p style={{ color: 'var(--text-500)' }}>No active alerts</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px] uppercase tracking-widest font-semibold">
              Severity
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-widest font-semibold">
              Service
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-widest font-semibold">
              Title
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-widest font-semibold">
              Time
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-widest font-semibold">
              Status
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-widest font-semibold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow
              key={alert.id}
              onClick={() => {
                setInternalSelectedId(alert.id);
                onAlertClick?.(alert);
              }}
              className="cursor-pointer"
              style={{
                background: selectedId === alert.id ? 'var(--surface-700)' : 'transparent',
              }}
            >
              <TableCell>
                <Badge variant={severityVariants[alert.severity]}>
                  {alert.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className="text-xs font-medium capitalize"
                  style={{ color: 'var(--text-400)' }}
                >
                  {alert.serviceId.replace('-', ' ')}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>
                    {alert.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-500)' }}>
                    {alert.message}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs tabular-nums" style={{ color: 'var(--text-500)' }}>
                  {formatTimeAgo(alert.timestamp)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[alert.status]}>
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell>
                {alert.status === 'active' && onAcknowledge && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAcknowledge(alert.id);
                    }}
                  >
                    Acknowledge
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
