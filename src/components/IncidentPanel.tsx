import { useEffect } from 'react';
import type { Incident, Alert } from '../types/monitoring';
import { Timeline } from './Timeline';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface IncidentPanelProps {
  incident: Incident | null;
  alerts: Alert[];
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  open: { label: 'Open', variant: 'destructive' as const },
  investigating: { label: 'Investigating', variant: 'secondary' as const },
  identified: { label: 'Identified', variant: 'default' as const },
  resolved: { label: 'Resolved', variant: 'outline' as const },
};

const severityConfig = {
  critical: { label: 'Critical', variant: 'destructive' as const },
  warning: { label: 'Warning', variant: 'secondary' as const },
  info: { label: 'Info', variant: 'outline' as const },
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

  if (!incident) return null;

  const status = statusConfig[incident.status];
  const severity = severityConfig[incident.severity];
  const relatedAlertsList = alerts.filter((alert) =>
    incident.relatedAlerts.includes(alert.id)
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="w-full max-w-lg overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, var(--surface-900) 0%, var(--surface-950) 100%)',
        }}
      >
        <SheetHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono font-medium"
              style={{ color: 'var(--text-500)' }}
            >
              {incident.id}
            </span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <SheetTitle
            className="text-xl font-semibold tracking-tight"
            style={{ color: 'var(--text-100)' }}
          >
            {incident.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Details Card */}
          <Card
            style={{
              background: 'var(--surface-800)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <CardContent className="grid grid-cols-2 gap-4 p-4">
              <div>
                <span
                  className="text-[10px] uppercase tracking-widest font-medium"
                  style={{ color: 'var(--text-500)' }}
                >
                  Severity
                </span>
                <p className="mt-1">
                  <Badge variant={severity.variant}>{severity.label}</Badge>
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
            </CardContent>
          </Card>

          {/* Timeline */}
          <div>
            <h3
              className="text-[10px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-500)' }}
            >
              Timeline
            </h3>
            <Timeline events={incident.timeline} />
          </div>

          <Separator />

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
                  <Card
                    key={alert.id}
                    style={{
                      background: 'var(--surface-800)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[10px] font-mono font-medium"
                          style={{ color: 'var(--text-500)' }}
                        >
                          {alert.id}
                        </span>
                        <Badge
                          variant={
                            alert.severity === 'critical'
                              ? 'destructive'
                              : alert.severity === 'warning'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-300)' }}>
                        {alert.title}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
