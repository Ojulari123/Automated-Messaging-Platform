import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import AdminShell from '@/components/layout/AdminShell';
import {
  Users,
  UserCheck,
  Calendar,
  AlertTriangle,
  Bell,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockStats = {
  pendingMembers: 3,
  totalMembers: 45,
  upcomingEvents: 8,
  failedSends: 2
};

const mockPendingMembers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', submittedAt: '2025-01-20' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', submittedAt: '2025-01-19' },
  { id: '3', name: 'Mike Davis', email: 'mike@example.com', submittedAt: '2025-01-18' }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'registration',
    description: 'New member registration: John Smith',
    timestamp: '2 hours ago',
    status: 'pending'
  },
  {
    id: '2',
    type: 'message',
    description: 'Birthday message sent to Emma Wilson',
    timestamp: '5 hours ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'approval',
    description: 'Member approved: David Brown',
    timestamp: '1 day ago',
    status: 'success'
  },
  {
    id: '4',
    type: 'message',
    description: 'Failed to send anniversary message to Lisa Chen',
    timestamp: '1 day ago',
    status: 'error'
  },
  {
    id: '5',
    type: 'registration',
    description: 'New member registration: Sarah Johnson',
    timestamp: '2 days ago',
    status: 'pending'
  }
];

const AdminDashboard: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <AdminShell>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening in your community.
          </p>
        </div>

        {/* Notification Banner */}
        {mockStats.pendingMembers > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <Bell className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                You have {mockStats.pendingMembers} new member registration{mockStats.pendingMembers === 1 ? '' : 's'} awaiting approval.
              </span>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/pending">
                  Review <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="pattern-card border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-950/50 dark:to-yellow-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Members</CardTitle>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <UserCheck className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{mockStats.pendingMembers}</div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="pattern-card border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStats.totalMembers}</div>
              <p className="text-xs text-primary/70">Active community members</p>
            </CardContent>
          </Card>

          <Card className="pattern-card border-l-4 border-l-accent bg-gradient-to-r from-accent/5 to-accent/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <div className="p-2 bg-accent/20 rounded-lg">
                <Calendar className="h-4 w-4 text-accent-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-foreground">{mockStats.upcomingEvents}</div>
              <p className="text-xs text-accent-foreground/70">Next 7 days</p>
            </CardContent>
          </Card>

          <Card className="pattern-card border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Sends</CardTitle>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">{mockStats.failedSends}</div>
              <p className="text-xs text-red-600 dark:text-red-400">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Registrations
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/pending">View All</Link>
                </Button>
              </CardTitle>
              <CardDescription>
                New members waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockPendingMembers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending registrations</p>
              ) : (
                <div className="space-y-3">
                  {mockPendingMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.submittedAt}</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions in your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminDashboard;
