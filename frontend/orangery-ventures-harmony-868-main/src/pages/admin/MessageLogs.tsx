import React from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { Card, CardContent } from '@/components/ui/card';

const MessageLogs: React.FC = () => {
  return (
    <AdminShell>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Message Logs</h1>
          <p className="text-muted-foreground mt-2">
            View sent messages and delivery status.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Message History</h3>
            <p className="text-muted-foreground text-center">
              This page will show all sent messages with filtering, search, and retry options for failed sends.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
};

export default MessageLogs;
