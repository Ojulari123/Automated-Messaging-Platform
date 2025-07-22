import React from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { Card, CardContent } from '@/components/ui/card';

const Templates: React.FC = () => {
  return (
    <AdminShell>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Message Templates</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage message templates for different event types.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Message Templates</h3>
            <p className="text-muted-foreground text-center">
              This page will allow management of message templates with token placeholders for personalization.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
};

export default Templates;
