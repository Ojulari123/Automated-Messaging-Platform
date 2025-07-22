import React from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/layout/AdminShell';
import { Card, CardContent } from '@/components/ui/card';

const MemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AdminShell>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Member Details</h1>
          <p className="text-muted-foreground mt-2">
            View and manage member information and events.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Member Detail (ID: {id})</h3>
            <p className="text-muted-foreground text-center">
              This page will show detailed member information, events, and management options.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
};

export default MemberDetail;
