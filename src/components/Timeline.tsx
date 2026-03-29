interface TimelineEvent {
  timestamp: string;
  type: string;
  message: string;
  author?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const typeConfig: Record<string, { icon: string; color: string }> = {
  incident_created: { icon: '⚠️', color: 'text-rose-500' },
  alert_triggered: { icon: '🔔', color: 'text-amber-500' },
  status_update: { icon: '📝', color: 'text-blue-500' },
  resolved: { icon: '✅', color: 'text-emerald-500' },
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function Timeline({ events }: TimelineProps) {
  // Sort events by timestamp (oldest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />

      <div className="space-y-6">
        {sortedEvents.map((event, index) => {
          const config = typeConfig[event.type] || { icon: '•', color: 'text-gray-500' };

          return (
            <div key={index} className="relative flex gap-4">
              {/* Timeline dot/icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 border border-gray-800 ${config.color}`}
              >
                <span className="text-sm">{config.icon}</span>
              </div>

              {/* Event content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">
                    {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                  </span>
                  {event.author && (
                    <span className="text-xs text-gray-600">by {event.author}</span>
                  )}
                </div>
                <p className="text-sm text-gray-300">{event.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
