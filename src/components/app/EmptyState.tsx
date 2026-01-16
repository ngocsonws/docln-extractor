import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-sm text-muted-foreground mb-4">
        {message || 'Open a novel page on docln.net to use this extension.'}
      </p>
      <Button variant="outline" size="sm" asChild>
        <a href="https://docln.net" target="_blank" rel="noopener noreferrer">
          Go to docln.net
        </a>
      </Button>
    </div>
  );
}
