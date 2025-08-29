import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'booking' | 'earning' | 'withdrawal' | 'deposit';
  description: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Clock;
      case 'earning':
        return TrendingUp;
      case 'withdrawal':
        return ArrowUpCircle;
      case 'deposit':
        return ArrowDownCircle;
      default:
        return Activity;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'failed':
        return 'text-red-500 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'earning':
      case 'deposit':
        return 'text-green-500';
      case 'withdrawal':
        return 'text-orange-500';
      case 'booking':
        return 'text-blue-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your transactions will appear here
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const StatusIcon = getStatusIcon(activity.status);
              
              return (
                <div 
                  key={activity.id} 
                  className="flex items-center space-x-4 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-200"
                >
                  {/* Activity Icon */}
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <ActivityIcon className="h-5 w-5 text-primary" />
                  </div>
                  
                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${getAmountColor(activity.type)}`}>
                      {activity.type === 'withdrawal' ? '-' : ''}₹{activity.amount.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Status */}
                  <Badge className={`${getStatusColor(activity.status)} flex items-center gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    <span className="capitalize text-xs">{activity.status}</span>
                  </Badge>
                </div>
              );
            })
          )}
        </div>
        
        {activities.length > 0 && (
          <div className="mt-4 text-center">
            <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200">
              View All Activity
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;