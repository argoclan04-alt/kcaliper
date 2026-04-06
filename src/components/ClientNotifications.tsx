import { ClientNotification } from '../types/weight-tracker';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bell, BellOff, Scale, Target, Camera, Award, Clock, Check } from 'lucide-react';
import { Badge } from './ui/badge';

interface ClientNotificationsProps {
  notifications: ClientNotification[];
  onMarkAsRead: (notificationId: string) => void;
}

export function ClientNotifications({ notifications, onMarkAsRead }: ClientNotificationsProps) {
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getIcon = (type: ClientNotification['type']) => {
    switch (type) {
      case 'weight_modified':
        return <Scale className="w-4 h-4" />;
      case 'target_rate_changed':
        return <Target className="w-4 h-4" />;
      case 'photo_requested':
        return <Camera className="w-4 h-4" />;
      case 'milestone_set':
        return <Award className="w-4 h-4" />;
      case 'reminder_updated':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: ClientNotification['type']) => {
    switch (type) {
      case 'weight_modified':
        return 'text-blue-600 bg-blue-50';
      case 'target_rate_changed':
        return 'text-purple-600 bg-purple-50';
      case 'photo_requested':
        return 'text-green-600 bg-green-50';
      case 'milestone_set':
        return 'text-amber-600 bg-amber-50';
      case 'reminder_updated':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <BellOff className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No notifications yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          {unreadNotifications.length > 0 && (
            <Badge variant="destructive">{unreadNotifications.length} new</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedNotifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 transition-colors ${
                notification.isRead ? 'bg-white' : 'bg-blue-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getIconColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm mb-1">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
