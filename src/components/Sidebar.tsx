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
    <aside
      className="hidden md:flex w-60 flex-col h-screen sticky top-0"
      style={{
        background: 'var(--surface-900)',
        borderRight: '1px solid var(--border-default)'
      }}
    >
      {/* Logo */}
      <div 
        className="p-5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-1.5 rounded-lg"
            style={{ 
              background: 'var(--accent-primary-subtle)',
              border: '1px solid var(--accent-primary-muted)'
            }}
          >
            <div 
              className="w-5 h-5 rounded-sm"
              style={{ background: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <h1 
              className="text-sm font-semibold"
              style={{ color: 'var(--text-100)' }}
            >
              SupportOps
            </h1>
            <p 
              className="text-[10px] tracking-wide uppercase"
              style={{ color: 'var(--text-400)' }}
            >
              Uptime Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Add Monitor Button */}
      <div className="p-4">
      <button
        onClick={onAddMonitor}
        className="sidebar-add-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all"
        style={{
          background: 'var(--accent-primary)',
          color: 'var(--surface-950)'
        }}
      >
          <Plus className="w-4 h-4" />
          Add Monitor
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-0.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <li key={item.id}>
        <button
          className={`sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${isActive ? 'nav-item-active' : ''}`}
          style={{
            background: isActive ? 'var(--surface-700)' : 'transparent',
            color: isActive ? 'var(--text-100)' : 'var(--text-300)'
          }}
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
      <div 
        className="p-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
      <button
        className="sidebar-notif-btn w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all"
        style={{ color: 'var(--text-300)' }}
      >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          <span 
            className="ml-auto w-2 h-2 rounded-full"
            style={{ background: 'var(--semantic-critical)' }}
          />
        </button>
      </div>
    </aside>
  );
}
