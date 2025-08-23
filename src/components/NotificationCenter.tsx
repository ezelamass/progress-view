import { useState, useEffect } from 'react';
import { Bell, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActivities, ActivityWithProject } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { activities, refetch } = useActivities(undefined, 20);
  const { profile } = useAuth();

  // Mock unread count for demo - in real app, store in database
  useEffect(() => {
    setUnreadCount(activities.filter(activity => {
      // Mark as unread if created in last 24 hours
      const activityDate = new Date(activity.created_at);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return activityDate > oneDayAgo;
    }).length);
  }, [activities]);

  // Set up real-time subscription for new activities
  useEffect(() => {
    const channel = supabase
      .channel('activity-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment_created':
        return '💳';
      case 'project_updated':
        return '📋';
      case 'deliverable_created':
      case 'deliverable_updated':
        return '📦';
      default:
        return '📢';
    }
  };

  const formatActivityDescription = (activity: ActivityWithProject) => {
    if (activity.projects?.name) {
      return `${activity.description} in ${activity.projects.name}`;
    }
    return activity.description;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={`relative ${className}`}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {activities.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((activity) => {
                const isRecent = new Date(activity.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                
                return (
                  <div 
                    key={activity.id}
                    className={`p-3 hover:bg-muted/50 transition-colors border-l-2 ${
                      isRecent ? 'border-l-primary bg-muted/20' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-sm">{getActivityIcon(activity.activity_type)}</span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {formatActivityDescription(activity)}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </span>
                          {isRecent && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;