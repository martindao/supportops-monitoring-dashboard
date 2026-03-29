import { LayoutDashboard, Globe, Settings, Bell, Plus } from 'lucide-react';

interface SidebarProps {
  activeView?: 'dashboard' | 'status-pages' | 'settings';
  onAddMonitor?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'status-pages', label: 'Status Pages', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeView = 'dashboard', onAddMonitor }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            <div className="w-5 h-5 bg-emerald-500 rounded-sm" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-100">SupportOps</h1>
            <p className="text-[10px] text-gray-500">Uptime Monitoring</p>
          </div>
        </div>
      </div>

      {/* Add Monitor Button */}
      <div className="p-3">
        <button
          onClick={onAddMonitor}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Monitor
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-gray-100'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Notifications */}
      <div className="p-3 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          <span className="ml-auto w-2 h-2 bg-rose-500 rounded-full" />
        </button>
      </div>
    </aside>
  );
}
