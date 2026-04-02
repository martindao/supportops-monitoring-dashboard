import { LayoutDashboard, Globe, Settings, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
        <Button
          onClick={onAddMonitor}
          className="w-full gap-2"
          style={{
            background: 'var(--accent-primary)',
            color: 'var(--surface-950)'
          }}
        >
          <Plus className="w-4 h-4" />
          Add Monitor
        </Button>
      </div>

      <Separator className="mx-3" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3"
                  style={{
                    background: isActive ? 'var(--surface-700)' : 'transparent',
                    color: isActive ? 'var(--text-100)' : 'var(--text-300)'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="mx-3" />

      {/* Notifications */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          style={{ color: 'var(--text-300)' }}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          <span
            className="ml-auto w-2 h-2 rounded-full"
            style={{ background: 'var(--semantic-critical)' }}
          />
        </Button>
      </div>
    </aside>
  );
}
