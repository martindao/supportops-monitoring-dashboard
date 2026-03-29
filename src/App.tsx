import { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowUpCircle, ArrowDownCircle, AlertTriangle, Clock, Bell, RefreshCw, Pause, Plus } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <Sidebar activeView="dashboard" onAddMonitor={handleAddMonitor} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-6">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-gray-300">Dashboard</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddMonitor}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 text-xs font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Monitor
                </button>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">
                    {Math.floor((currentTime.getTime() - lastRefreshed.getTime()) / 1000)}s
                  </span>
                </button>
                <button className="relative p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 text-gray-400" />
                  {stats.activeAlerts > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {/* Quick Stats Row — Uptime Kuma style: Up / Down / Degraded / Paused */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-100">{stats.up}</p>
                <p className="text-[11px] text-gray-500">Up</p>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="p-1.5 bg-rose-500/10 rounded-lg">
                <ArrowDownCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-100">{stats.down}</p>
                <p className="text-[11px] text-gray-500">Down</p>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="p-1.5 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-100">{stats.degraded}</p>
                <p className="text-[11px] text-gray-500">Degraded</p>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="p-1.5 bg-gray-500/10 rounded-lg">
                <Pause className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-100">{stats.paused}</p>
                <p className="text-[11px] text-gray-500">Paused</p>
              </div>
            </div>
          </div>

          {/* Heartbeat Bar */}
          <div className="mb-6">
            <HeartbeatBar services={services} />
          </div>

          {/* Monitor List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-300">Monitors</h2>
              <span className="text-xs text-gray-500">
                {stats.up}/{stats.totalServices} up
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-300">Important Events</h2>
              <button
                onClick={() => {
                  const incident = incidents[0];
                  if (incident) {
                    setSelectedIncident(incident);
                    setIsPanelOpen(true);
                  }
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View Incident →
              </button>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider px-4 py-2">Name</th>
                    <th className="text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider px-4 py-2">Status</th>
                    <th className="text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider px-4 py-2">Date Time</th>
                    <th className="text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider px-4 py-2">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {importantEvents.map((event) => {
                    const serviceName = event.serviceId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                    const statusColor = event.severity === 'critical'
                      ? 'text-rose-400'
                      : event.severity === 'warning'
                      ? 'text-amber-400'
                      : 'text-blue-400';
                    const statusDot = event.severity === 'critical'
                      ? 'bg-rose-500'
                      : event.severity === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-blue-500';

                    return (
                      <tr
                        key={event.id}
                        onClick={() => handleAlertClick(event)}
                        className="border-b border-gray-800/50 last:border-b-0 hover:bg-gray-800/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-2">
                          <span className="text-xs text-gray-300">{serviceName}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center gap-1.5 text-xs ${statusColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                            {event.severity}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-xs text-gray-400">{event.title}</span>
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
              <h2 className="text-sm font-medium text-gray-300">Alerts</h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as Alert['severity'] | 'all')}
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Service</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
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
                  className="text-xs text-emerald-400 hover:text-emerald-300"
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
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg text-sm shadow-lg backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
