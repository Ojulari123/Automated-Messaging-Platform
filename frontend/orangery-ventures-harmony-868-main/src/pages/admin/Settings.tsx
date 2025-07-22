import React from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { Card, CardContent } from '@/components/ui/card';

const Settings: React.FC = () => {
  return (
    <AdminShell>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure community settings and notification preferences.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Community Settings</h3>
            <p className="text-muted-foreground text-center">
              This page will contain community name, send times, notification preferences, and other settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
};

export default Settings;
