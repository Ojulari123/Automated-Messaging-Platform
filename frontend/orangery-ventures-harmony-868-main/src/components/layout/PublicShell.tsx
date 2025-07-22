import React from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Heart, Calendar, Users, MessageCircle } from 'lucide-react';

interface PublicShellProps {
  children: React.ReactNode;
  showSplitLayout?: boolean;
}

const PublicShell: React.FC<PublicShellProps> = ({ children, showSplitLayout = true }) => {
  if (showSplitLayout) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Brand/Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden hero-pattern">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
            <div className="absolute bottom-32 right-16 w-48 h-48 bg-white/10 rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-16 text-white">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                <Heart className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-serif font-bold mb-4">
                Community Messages
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Connecting hearts through special occasions
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 max-w-sm">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 opacity-80" />
                <span className="opacity-90">Never miss a birthday or anniversary</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 opacity-80" />
                <span className="opacity-90">Build stronger community bonds</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 opacity-80" />
                <span className="opacity-90">Personalized messages that matter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 lg:w-1/2 flex flex-col bg-background">
          {/* Header */}
          <header className="flex justify-between items-center p-6 border-b">
            <div className="lg:hidden">
              <h1 className="text-xl font-serif font-semibold text-foreground">
                Community Messages
              </h1>
            </div>
            <ThemeToggle />
          </header>

          {/* Main content */}
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="p-6 border-t bg-muted/30">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 Community Messages. Connecting communities through special occasions.</p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="relative border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              Community Messages
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Community Messages. Connecting communities through special occasions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicShell;
