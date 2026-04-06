import { User } from '../types/weight-tracker';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { UserCircle, Users, Moon, Sun } from 'lucide-react';

interface UserSwitcherProps {
  currentUser: User;
  availableUsers: User[];
  onSwitchUser: (userId: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  notificationButton?: React.ReactNode;
}

export function UserSwitcher({ 
  currentUser, 
  availableUsers, 
  onSwitchUser,
  darkMode = false,
  onToggleDarkMode,
  notificationButton
}: UserSwitcherProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="flex items-center gap-2">
        {/* Hide avatar on mobile */}
        <UserCircle className="hidden sm:block w-8 h-8 text-gray-600 dark:text-gray-400" />
        <div>
          <p className="font-medium dark:text-white">{currentUser.name}</p>
          <div className="flex items-center gap-2">
            <Badge variant={currentUser.role === 'coach' ? 'default' : 'secondary'}>
              {currentUser.role === 'coach' ? (
                <>
                  <Users className="w-3 h-3 mr-1" />
                  Coach
                </>
              ) : (
                'Athlete'
              )}
            </Badge>
            {/* Selector + Theme Switch + Notifications on same line as badge on mobile */}
            <div className="sm:hidden flex items-center gap-2">
              <Select value={currentUser.id} onValueChange={onSwitchUser}>
                <SelectTrigger className="h-7 w-28 text-xs">
                  <SelectValue placeholder="Switch" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <span>{user.name}</span>
                        <Badge 
                          variant={user.role === 'coach' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {onToggleDarkMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleDarkMode}
                  className="h-7 w-7 p-0"
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}
              {notificationButton && currentUser.role === 'coach' && notificationButton}
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop selector + Theme Switch */}
      <div className="ml-auto hidden sm:flex items-center gap-2">
        <Select value={currentUser.id} onValueChange={onSwitchUser}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Switch user" />
          </SelectTrigger>
          <SelectContent>
            {availableUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center gap-2">
                  <span>{user.name}</span>
                  <Badge 
                    variant={user.role === 'coach' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {user.role}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onToggleDarkMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="h-9 w-9 p-0"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        )}
        {notificationButton && currentUser.role === 'coach' && notificationButton}
      </div>
    </div>
  );
}