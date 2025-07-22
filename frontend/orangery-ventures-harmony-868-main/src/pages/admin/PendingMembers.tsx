import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import AdminShell from '@/components/layout/AdminShell';
import {
  Check,
  X,
  Calendar,
  Mail,
  User,
  AlertCircle
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockPendingMembers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    submittedAt: '2025-01-20T10:30:00Z',
    birthday: { day: 15, month: 3, year: 1990 },
    additionalEvents: [
      { type: 'Anniversary', label: 'Wedding Anniversary', day: 12, month: 6, year: 2015 }
    ]
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    submittedAt: '2025-01-19T14:15:00Z',
    birthday: { day: 22, month: 8, year: 1985 },
    additionalEvents: []
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@example.com',
    submittedAt: '2025-01-18T09:45:00Z',
    birthday: { day: 7, month: 12, year: undefined },
    additionalEvents: [
      { type: 'Memorial', label: 'Dad\'s Memorial Day', day: 25, month: 4, year: 2020 },
      { type: 'Other', label: 'Graduation Day', day: 15, month: 5, year: 2010 }
    ]
  }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface PendingMember {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  submittedAt: string;
  birthday?: { day: number; month: number; year?: number };
  additionalEvents: Array<{
    type: string;
    label: string;
    day: number;
    month: number;
    year?: number;
  }>;
}

const PendingMembers: React.FC = () => {
  const [members, setMembers] = useState<PendingMember[]>(mockPendingMembers);
  const [selectedMember, setSelectedMember] = useState<PendingMember | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventDate = (day: number, month: number, year?: number) => {
    const monthName = MONTHS[month - 1];
    return year ? `${monthName} ${day}, ${year}` : `${monthName} ${day}`;
  };

  const handleAction = (member: PendingMember, action: 'approve' | 'reject') => {
    setSelectedMember(member);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedMember || !actionType) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      if (actionType === 'approve') {
        console.log('Approving member:', selectedMember.id);
      } else {
        console.log('Rejecting member:', selectedMember.id, 'Reason:', rejectReason);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove from pending list (optimistic update)
      setMembers(prev => prev.filter(m => m.id !== selectedMember.id));

      // Reset state
      setSelectedMember(null);
      setActionType(null);
      setRejectReason('');
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAction = () => {
    setSelectedMember(null);
    setActionType(null);
    setRejectReason('');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Anniversary':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Memorial':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Other':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <AdminShell>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Pending Members</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve new member registrations.
          </p>
        </div>

        {members.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Pending Registrations</h3>
              <p className="text-muted-foreground text-center">
                All member registrations have been processed. New submissions will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {members.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {member.firstName} {member.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {member.email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(member.submittedAt)}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Birthday */}
                  {member.birthday && (
                    <div>
                      <h4 className="font-medium mb-2">Birthday</h4>
                      <div className="text-sm text-muted-foreground">
                        {formatEventDate(member.birthday.day, member.birthday.month, member.birthday.year)}
                      </div>
                    </div>
                  )}

                  {/* Additional Events */}
                  {member.additionalEvents.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Additional Events ({member.additionalEvents.length})</h4>
                      <div className="space-y-2">
                        {member.additionalEvents.map((event, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{event.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatEventDate(event.day, event.month, event.year)}
                              </p>
                            </div>
                            <Badge variant="outline" className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => handleAction(member, 'approve')}
                      className="flex-1"
                      variant="default"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleAction(member, 'reject')}
                      className="flex-1"
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={!!selectedMember && !!actionType} onOpenChange={cancelAction}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'approve' ? 'Approve' : 'Reject'} Member Registration
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'approve' ? (
                  <>
                    Are you sure you want to approve <strong>{selectedMember?.firstName} {selectedMember?.lastName}</strong>? 
                    They will be notified via email and can start receiving community messages.
                  </>
                ) : (
                  <>
                    Are you sure you want to reject <strong>{selectedMember?.firstName} {selectedMember?.lastName}</strong>'s registration?
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {actionType === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="rejectReason">Reason for rejection (optional)</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="Provide a reason that will be included in the notification email..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelAction} disabled={isLoading}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                disabled={isLoading}
                className={actionType === 'reject' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    {actionType === 'approve' ? 'Approving...' : 'Rejecting...'}
                  </>
                ) : (
                  actionType === 'approve' ? 'Approve' : 'Reject'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminShell>
  );
};

export default PendingMembers;
