import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';
import PublicShell from '@/components/layout/PublicShell';

const PendingPage: React.FC = () => {
  return (
    <PublicShell>
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Registration Submitted!</CardTitle>
            <CardDescription className="text-base">
              Thank you for joining our community
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg text-left">
              <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Awaiting Approval</p>
                <p className="text-sm text-muted-foreground">
                  Your registration is being reviewed by our community admin. 
                  You'll receive an email notification once your account has been approved.
                </p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                This usually takes 1-2 business days. If you have any questions, 
                please contact your community administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
};

export default PendingPage;
