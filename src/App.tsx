import { useState, useMemo, useEffect, useCallback } from 'react';
import { Clock, Bell, RefreshCw, Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { HeartbeatBar } from './components/HeartbeatBar';
import { ServiceCard } from './components/ServiceCard';
import { AlertTable } from './components/AlertTable';
import { IncidentPanel } from './components/IncidentPanel';
import { services, alerts as initialAlerts, incidents } from './data';
import type { Incident, Alert } from './types/monitoring';

function App() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [alertsState, setAlertsState] = useState<Alert[]>(initialAlerts);
  const [toast, setToast] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<Alert['severity'] | 'all'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAcknowledge = useCallback((alertId: string) => {
    setAlertsState((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' as const } : a))
    );
    setToast(`Alert ${alertId} acknowledged`);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 600);
  }, []);

  const filteredAlerts = useMemo(() => {
    return alertsState.filter((a) => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (serviceFilter !== 'all' && a.serviceId !== serviceFilter) return false;
      return true;
    });
  }, [alertsState, severityFilter, serviceFilter]);

  const uniqueServices = useMemo(
    () => [...new Set(alertsState.map((a) => a.serviceId))],
    [alertsState]
  );

  const stats = useMemo(() => {
    const up = services.filter((s) => s.health === 'healthy').length;
    const degraded = services.filter((s) => s.health === 'degraded').length;
    const down = services.filter((s) => s.health === 'down').length;
    const paused = 0; // No paused state in current data, placeholder for uptime-kuma parity
    const activeAlerts = alertsState.filter((a) => a.status === 'active').length;

    return {
      up,
      degraded,
      down,
      paused,
      activeAlerts,
      totalServices: services.length,
    };
  }, [alertsState]);

  // Important events derived from alerts (uptime-kuma style)
  const importantEvents = useMemo(() => {
    return [...alertsState]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [alertsState]);

  const handleServiceClick = (serviceId: string) => {
    const incident = incidents.find((i) => i.serviceId === serviceId);
    if (incident) {
      setSelectedIncident(incident);
      setIsPanelOpen(true);
    }
  };

  const handleAlertClick = (alert: Alert) => {
    const incident = incidents.find(
      (i) => i.serviceId === alert.serviceId && i.relatedAlerts.includes(alert.id)
    );
    if (incident) {
      setSelectedIncident(incident);
      setIsPanelOpen(true);
    }
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedIncident(null), 300);
  };

  const handleAddMonitor = () => {
    setToast('Add Monitor clicked (UI demo)');
  };

  return (
    <div 
      className="min-h-screen flex"
      style={{ background: 'var(--canvas)' }}
    >
      {/* Sidebar */}
      <Sidebar activeView="dashboard" onAddMonitor={handleAddMonitor} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
{/* Top Bar */}
<header
  className="sticky top-0 z-30 backdrop-blur-sm"
  style={{
    borderBottom: '1px solid var(--border-subtle)',
    background: 'rgba(10, 15, 26, 0.8)'
  }}
>
  <div className="px-4 md:px-8">
    <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <h2 
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-200)' }}
                >
                  Dashboard
                </h2>
              </div>
              <div className="flex items-center gap-4">
      <button
        onClick={handleAddMonitor}
        className="header-cta flex items-center gap-2 rounded-lg"
        style={{
          background: 'var(--accent-primary)',
          color: 'var(--surface-950)'
        }}
      >
          <Plus className="w-4 h-4" />
          Add Monitor
        </button>
                <div 
                  className="flex items-center gap-2 text-xs"
                  style={{ color: 'var(--text-400)' }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{currentTime.toLocaleTimeString()}</span>
                </div>
      <button
        onClick={handleRefresh}
        className="refresh-btn flex items-center gap-1.5 px-2.5 py-2 text-xs rounded-lg transition-all"
        style={{ color: 'var(--text-400)' }}
        title="Refresh data"
      >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-mono)' }}>
                    {Math.floor((currentTime.getTime() - lastRefreshed.getTime()) / 1000)}s
                  </span>
                </button>
      <button
        className="notification-btn relative p-2 rounded-lg transition-all"
      >
                  <Bell className="w-4 h-4" style={{ color: 'var(--text-400)' }} />
                  {stats.activeAlerts > 0 && (
                    <span 
                      className="absolute top-1 right-1 w-2 h-2 rounded-full"
                      style={{ background: 'var(--semantic-critical)' }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

{/* Dashboard Content */}
<main
  className="flex-1 px-4 md:px-8 py-6 overflow-y-auto"
  style={{ background: 'var(--canvas)' }}
>
      {/* Quick Stats Strip — Compact single-line summary */}
      <div className="flex items-center gap-6 mb-6 px-4 py-3 rounded-lg" style={{ background: 'var(--surface-800)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-100)' }}>{stats.up}</span>
          <span className="text-xs" style={{ color: 'var(--text-400)' }}>Up</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--semantic-critical)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-100)' }}>{stats.down}</span>
          <span className="text-xs" style={{ color: 'var(--text-400)' }}>Down</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-secondary)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-100)' }}>{stats.degraded}</span>
          <span className="text-xs" style={{ color: 'var(--text-400)' }}>Degraded</span>
        </div>
        {stats.paused > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--text-500)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-300)' }}>{stats.paused}</span>
            <span className="text-xs" style={{ color: 'var(--text-500)' }}>Paused</span>
          </div>
        )}
      </div>

          {/* Heartbeat Bar */}
          <div className="mb-6">
            <HeartbeatBar services={services} />
          </div>

      {/* Monitor List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>Monitors</h2>
          <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--accent-primary)' }}>
            {stats.up}<span className="text-sm font-normal text-[var(--text-400)]">/{stats.totalServices}</span>
            <span className="text-xs font-normal text-[var(--text-500)] ml-1">up</span>
          </span>
        </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => handleServiceClick(service.id)}
                />
              ))}
            </div>
          </div>

      {/* Important Events — Uptime Kuma style compact table */}
      <div className="mb-6">
        <div className="flex items-center justify-between important-events-header">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>Important Events</h2>
        <button
          onClick={() => {
            const incident = incidents[0];
            if (incident) {
              setSelectedIncident(incident);
              setIsPanelOpen(true);
            }
          }}
          className="view-incident-link text-xs transition-colors"
          style={{ color: 'var(--accent-primary)' }}
        >
            View Incident →
          </button>
        </div>
        <div
          className="rounded-lg overflow-hidden"
          style={{ background: 'var(--surface-800)', border: '1px solid var(--border-default)' }}
        >
          <table className="w-full important-events-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th className="text-left text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>Name</th>
                <th className="text-left text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>Status</th>
                <th className="text-left text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>Date Time</th>
                <th className="text-left text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {importantEvents.map((event) => {
                const serviceName = event.serviceId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                const statusColor = event.severity === 'critical'
                  ? 'var(--semantic-critical)'
                  : event.severity === 'warning'
                  ? 'var(--accent-secondary)'
                  : 'var(--semantic-info)';

                return (
        <tr
          key={event.id}
          onClick={() => handleAlertClick(event)}
          className="cursor-pointer transition-colors"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
                    <td>
                      <span className="text-xs" style={{ color: 'var(--text-200)' }}>{serviceName}</span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: statusColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                        {event.severity}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs" style={{ color: 'var(--text-400)' }}>
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs" style={{ color: 'var(--text-300)' }}>{event.title}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    {/* Alerts Section (detailed view) */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>Alerts</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>Severity</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as Alert['severity'] | 'all')}
            className="text-xs rounded-lg px-2.5 py-1.5 filter-select"
            style={{
              background: 'var(--surface-700)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-200)'
            }}
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>Service</label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-xs rounded-lg px-2.5 py-1.5 filter-select"
            style={{
              background: 'var(--surface-700)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-200)'
            }}
          >
            <option value="all">All Services</option>
            {uniqueServices.map((svc) => (
              <option key={svc} value={svc}>
                {svc.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        {(severityFilter !== 'all' || serviceFilter !== 'all') && (
          <button
            onClick={() => {
              setSeverityFilter('all');
              setServiceFilter('all');
            }}
            className="text-xs"
            style={{ color: 'var(--accent-primary)' }}
          >
            Clear filters
          </button>
        )}
      </div>

            <AlertTable
              alerts={filteredAlerts}
              onAlertClick={handleAlertClick}
              onAcknowledge={handleAcknowledge}
            />
          </div>
        </main>
      </div>

      {/* Incident Panel */}
      <IncidentPanel
        incident={selectedIncident}
        alerts={alertsState}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-sm backdrop-blur-sm toast-notification toast-animate"
          style={{
            background: 'var(--accent-primary-muted)',
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)'
          }}
        >
          <span className="toast-content">{toast}</span>
          <div className="toast-progress-bar" />
        </div>
      )}
    </div>
  );
}

export default App;
