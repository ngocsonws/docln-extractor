import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-lg font-semibold">Docln Extractor</h1>
      <Badge variant="outline">v1.0</Badge>
    </header>
  );
}
