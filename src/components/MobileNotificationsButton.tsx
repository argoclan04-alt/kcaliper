import { useState } from 'react';
import { Alert } from '../types/weight-tracker';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, BellOff, TrendingDown, TrendingUp, AlertTriangle, Edit3, Award, Target, X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface MobileNotificationsButtonProps {
  alerts?: Alert[];
  unreadAlerts?: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onViewClient?: (clientId: string) => void;
}

export function MobileNotificationsButton({ 
  alerts = [], 
  unreadAlerts = [], 
  onMarkAsRead, 
  onViewClient 
}: MobileNotificationsButtonProps) {
  const [activeTab, setActiveTab] = useState('unread');

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
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'lowest':
        return {
          border: 'border-l-green-500',
          bg: 'bg-green-50 dark:bg-green-950/30',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'highest':
        return {
          border: 'border-l-red-500',
          bg: 'bg-red-50 dark:bg-red-950/30',
          icon: 'text-red-600 dark:text-red-400'
        };
      case 'rate_deviation':
        return {
          border: 'border-l-orange-500',
          bg: 'bg-orange-50 dark:bg-orange-950/30',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'weight_modified':
        return {
          border: 'border-l-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      case 'no_weight_entry':
        return {
          border: 'border-l-orange-500',
          bg: 'bg-orange-50 dark:bg-orange-950/30',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'milestone_achieved':
        return {
          border: 'border-l-yellow-500',
          bg: 'bg-yellow-50 dark:bg-yellow-950/30',
          icon: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'target_streak':
        return {
          border: 'border-l-purple-500',
          bg: 'bg-purple-50 dark:bg-purple-950/30',
          icon: 'text-purple-600 dark:text-purple-400'
        };
      default:
        return {
          border: 'border-l-gray-500',
          bg: 'bg-gray-50 dark:bg-gray-950/30',
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

  // Get notification color based on alert types
  const getNotificationColor = () => {
    const priorityTypes = ['milestone_achieved', 'rate_deviation', 'lowest', 'highest'];
    const relevantAlert = unreadAlerts.find(alert => priorityTypes.includes(alert.type));
    
    if (!relevantAlert) return 'bg-red-500';
    
    switch (relevantAlert.type) {
      case 'lowest':
        return 'bg-green-500';
      case 'highest':
        return 'bg-red-500';
      case 'rate_deviation':
        return 'bg-orange-500';
      case 'milestone_achieved':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const renderAlert = (alert: Alert, isUnread: boolean) => {
    const colors = getAlertColor(alert.type);
    
    return (
      <div
        key={alert.id}
        className={`relative p-4 rounded-lg border-l-4 ${colors.border} ${colors.bg} cursor-pointer transition-all hover:shadow-md`}
        onClick={() => {
          if (isUnread) {
            onMarkAsRead(alert.id);
          }
          if (onViewClient) {
            onViewClient(alert.clientId);
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          {unreadAlerts.length > 0 && (
            <div className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full ${getNotificationColor()} flex items-center justify-center border-2 border-white dark:border-gray-900`}>
              <span className="text-white text-[10px]">{unreadAlerts.length}</span>
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] max-w-md overflow-y-auto bg-white dark:bg-gray-900 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b dark:border-gray-800">
          <SheetTitle className="flex items-center gap-2 dark:text-white">
            <Bell className="w-5 h-5" />
            Notifications
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex ml-1">
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-3">
                  <p className="font-semibold text-xs mb-2">Guía de Colores</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500" /><span>Nuevo peso mínimo</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500" /><span>Nuevo peso máximo</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-orange-500" /><span>Desviación de tasa / Sin registro</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span>Peso modificado</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-yellow-500" /><span>Milestone alcanzado</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-purple-500" /><span>Racha de objetivos</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan-500" /><span>Foto subida</span></div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 pb-2 border-b dark:border-gray-800">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadAlerts.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 min-w-5 px-1.5 bg-blue-500 hover:bg-blue-500 text-white text-xs"
                  >
                    {unreadAlerts.length}
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

          <TabsContent value="unread" className="px-6 py-4 space-y-3 m-0">
            {sortedUnreadAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
                  No unread notifications
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm text-center mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              sortedUnreadAlerts.map((alert) => renderAlert(alert, true))
            )}
          </TabsContent>

          <TabsContent value="read" className="px-6 py-4 space-y-3 m-0">
            {readAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
                  No read notifications
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm text-center mt-1">
                  Read notifications will appear here
                </p>
              </div>
            ) : (
              readAlerts.map((alert) => renderAlert(alert, false))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
