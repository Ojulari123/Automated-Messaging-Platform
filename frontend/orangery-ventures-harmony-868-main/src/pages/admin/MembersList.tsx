import React from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { Card, CardContent } from '@/components/ui/card';

const MembersList: React.FC = () => {
  return (
    <AdminShell>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground mt-2">
            Manage community members and their events.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Members List</h3>
            <p className="text-muted-foreground text-center">
              This page will show all community members with search, filtering, and management options.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
};

export default MembersList;
