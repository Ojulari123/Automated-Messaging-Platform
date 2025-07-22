import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { CalendarDays, Plus, X, AlertCircle } from 'lucide-react';
import PublicShell from '@/components/layout/PublicShell';

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  birthday: z.object({
    day: z.number().min(1).max(31),
    month: z.number().min(1).max(12),
    year: z.number().optional()
  }).optional(),
  additionalEvents: z.array(z.object({
    type: z.enum(['Anniversary', 'Memorial', 'Other']),
    label: z.string().min(1, 'Event label is required'),
    day: z.number().min(1).max(31),
    month: z.number().min(1).max(12),
    year: z.number().optional()
  })).default([])
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const DAYS = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: (i + 1).toString() }));
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => ({ 
  value: CURRENT_YEAR - i, 
  label: (CURRENT_YEAR - i).toString() 
}));

const RegistrationPage: React.FC = () => {
  const { inviteToken } = useParams<{ inviteToken?: string }>();
  const navigate = useNavigate();
  const [tokenValidation, setTokenValidation] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [showAdditionalEvent, setShowAdditionalEvent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      additionalEvents: []
    }
  });

  const additionalEvents = watch('additionalEvents') || [];

  // Validate invite token
  useEffect(() => {
    if (inviteToken) {
      // TODO: Replace with actual API call
      setTimeout(() => {
        if (inviteToken === 'invalid') {
          setTokenValidation('invalid');
        } else {
          setTokenValidation('valid');
        }
      }, 1000);
    } else {
      setTokenValidation('valid'); // Allow direct access for now
    }
  }, [inviteToken]);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // TODO: Replace with actual API call
      console.log('Registration data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set flag to avoid refilling form on return visits
      localStorage.setItem('registration_submitted', 'true');
      
      // Navigate to pending page
      navigate('/join/pending');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const addAdditionalEvent = () => {
    const newEvent = {
      type: 'Other' as const,
      label: '',
      day: 1,
      month: 1,
      year: undefined
    };
    setValue('additionalEvents', [...additionalEvents, newEvent]);
    setShowAdditionalEvent(true);
  };

  const removeAdditionalEvent = (index: number) => {
    const updated = additionalEvents.filter((_, i) => i !== index);
    setValue('additionalEvents', updated);
    if (updated.length === 0) {
      setShowAdditionalEvent(false);
    }
  };

  const updateAdditionalEvent = (index: number, field: string, value: any) => {
    const updated = [...additionalEvents];
    updated[index] = { ...updated[index], [field]: value };
    setValue('additionalEvents', updated);
  };

  if (tokenValidation === 'loading') {
    return (
      <PublicShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8" />
        </div>
      </PublicShell>
    );
  }

  if (tokenValidation === 'invalid') {
    return (
      <PublicShell>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Invalid Invitation</CardTitle>
              <CardDescription>
                This invitation link is invalid or has expired. Please contact your community admin for a new invitation.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell showSplitLayout={false}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Join Our Community</CardTitle>
            <CardDescription>
              Help us celebrate your special occasions! Fill out the form below to get started.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    />
                    {errors.firstName && (
                      <p id="firstName-error" className="text-sm text-destructive">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Birthday */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Birthday (Optional)</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select onValueChange={(value) => setValue('birthday.day', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select onValueChange={(value) => setValue('birthday.month', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Year (Optional)</Label>
                    <Select onValueChange={(value) => setValue('birthday.year', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((year) => (
                          <SelectItem key={year.value} value={year.value.toString()}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Events */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Additional Events</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAdditionalEvent}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>

                {additionalEvents.map((event, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Event {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdditionalEvent(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Event Type</Label>
                          <Select 
                            value={event.type}
                            onValueChange={(value) => updateAdditionalEvent(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Anniversary">Anniversary</SelectItem>
                              <SelectItem value="Memorial">Memorial</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Event Label</Label>
                          <Input
                            value={event.label}
                            onChange={(e) => updateAdditionalEvent(index, 'label', e.target.value)}
                            placeholder="e.g., Wedding Anniversary, Memorial Day"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Day</Label>
                          <Select 
                            value={event.day.toString()}
                            onValueChange={(value) => updateAdditionalEvent(index, 'day', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS.map((day) => (
                                <SelectItem key={day.value} value={day.value.toString()}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Month</Label>
                          <Select 
                            value={event.month.toString()}
                            onValueChange={(value) => updateAdditionalEvent(index, 'month', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MONTHS.map((month) => (
                                <SelectItem key={month.value} value={month.value.toString()}>
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Year (Optional)</Label>
                          <Select 
                            value={event.year?.toString() || ''}
                            onValueChange={(value) => updateAdditionalEvent(index, 'year', value ? parseInt(value) : undefined)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {YEARS.map((year) => (
                                <SelectItem key={year.value} value={year.value.toString()}>
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Join Community'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
};

export default RegistrationPage;
