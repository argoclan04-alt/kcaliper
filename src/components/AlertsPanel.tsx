import { useState } from 'react';
import { Alert } from '../types/weight-tracker';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, BellOff, TrendingDown, TrendingUp, AlertTriangle, Edit3, Award, Target, X, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface AlertsPanelProps {
  alerts: Alert[];
  unreadAlerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onViewClient?: (clientId: string) => void;
}

export function AlertsPanel({ alerts, unreadAlerts, onMarkAsRead, onViewClient }: AlertsPanelProps) {
  const [activeTab, setActiveTab] = useState('unread');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'lowest':
        return <TrendingDown className="w-4 h-4" />;
      case 'highest':
        return <TrendingUp className="w-4 h-4" />;
      case 'rate_deviation':
        return <AlertTriangle className="w-4 h-4" />;
      case 'weight_modified':
        return <Edit3 className="w-4 h-4" />;
      case 'no_weight_entry':
        return <AlertTriangle className="w-4 h-4" />;
      case 'milestone_achieved':
        return <Award className="w-4 h-4" />;
      case 'target_streak':
        return <Target className="w-4 h-4" />;
      case 'photo_uploaded':
        return <Camera className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'lowest':
        return {
          border: 'border-l-green-500',
          bg: 'bg-green-50 dark:bg-green-950/20',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'highest':
        return {
          border: 'border-l-red-500',
          bg: 'bg-red-50 dark:bg-red-950/20',
          icon: 'text-red-600 dark:text-red-400'
        };
      case 'rate_deviation':
        return {
          border: 'border-l-orange-500',
          bg: 'bg-orange-50 dark:bg-orange-950/20',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'weight_modified':
        return {
          border: 'border-l-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      case 'no_weight_entry':
        return {
          border: 'border-l-orange-500',
          bg: 'bg-orange-50 dark:bg-orange-950/20',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'milestone_achieved':
        return {
          border: 'border-l-yellow-500',
          bg: 'bg-yellow-50 dark:bg-yellow-950/20',
          icon: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'target_streak':
        return {
          border: 'border-l-purple-500',
          bg: 'bg-purple-50 dark:bg-purple-950/20',
          icon: 'text-purple-600 dark:text-purple-400'
        };
      case 'photo_uploaded':
        return {
          border: 'border-l-cyan-500',
          bg: 'bg-cyan-50 dark:bg-cyan-950/20',
          icon: 'text-cyan-600 dark:text-cyan-400'
        };
      default:
        return {
          border: 'border-l-gray-500',
          bg: 'bg-gray-50 dark:bg-gray-950/20',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Sort alerts by date (most recent first)
  const sortedUnreadAlerts = [...unreadAlerts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const readAlerts = alerts.filter(a => a.isRead).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const renderAlert = (alert: Alert, isUnread: boolean) => {
    const colors = getAlertColor(alert.type);
    
    return (
      <div
        key={alert.id}
        className={`relative p-3 rounded-lg border-l-4 ${colors.border} ${colors.bg} cursor-pointer transition-all hover:shadow-md`}
        onClick={() => {
          if (alert.type === 'photo_uploaded' && alert.photoUrl) {
            setSelectedPhotoUrl(alert.photoUrl);
            if (isUnread) {
              onMarkAsRead(alert.id);
            }
          } else {
            if (isUnread) {
              onMarkAsRead(alert.id);
            }
            if (onViewClient) {
              onViewClient(alert.clientId);
            }
          }
        }}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 ${colors.icon}`}>
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${isUnread ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
              {alert.message}
            </p>
            {alert.type === 'photo_uploaded' && (
              <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                Click to view photo
              </p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(alert.date)}
              </p>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(alert.date)}
              </p>
            </div>
          </div>
          {isUnread && (
            <Button
              size="sm"
              variant="ghost"
              className="flex-shrink-0 h-7 w-7 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(alert.id);
              }}
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (alerts.length === 0) {
    return (
      <>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
              No alerts yet
            </p>
          </CardContent>
        </Card>

        {/* Photo View Dialog */}
        {selectedPhotoUrl && (
          <Dialog open={!!selectedPhotoUrl} onOpenChange={() => setSelectedPhotoUrl(null)}>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  Uploaded Photo
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img 
                  src={selectedPhotoUrl} 
                  alt="Uploaded progress photo"
                  className="w-full rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <>
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3 border-b dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Bell className="w-5 h-5" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4 pb-2">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="unread" className="relative">
                Unread
                {sortedUnreadAlerts.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 min-w-5 px-1.5 bg-blue-500 hover:bg-blue-500 text-white text-xs"
                  >
                    {sortedUnreadAlerts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">
                Read
                {readAlerts.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 min-w-5 px-1.5 bg-gray-400 hover:bg-gray-400 text-white text-xs"
                  >
                    {readAlerts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="unread" className="px-4 py-4 space-y-3 m-0">
            {sortedUnreadAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
                  No unread alerts
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm text-center mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              sortedUnreadAlerts.map((alert) => renderAlert(alert, true))
            )}
          </TabsContent>

          <TabsContent value="read" className="px-4 py-4 space-y-3 m-0">
            {readAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
                  No read alerts
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm text-center mt-1">
                  Read alerts will appear here
                </p>
              </div>
            ) : (
              readAlerts.slice(0, 10).map((alert) => renderAlert(alert, false))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    {/* Photo View Dialog */}
    {selectedPhotoUrl && (
      <Dialog open={!!selectedPhotoUrl} onOpenChange={() => setSelectedPhotoUrl(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Uploaded Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={selectedPhotoUrl} 
              alt="Uploaded progress photo"
              className="w-full rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
}
