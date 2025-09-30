import { Button } from '@/components/ui/button';
import { QrCode, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-3 text-primary">
          <Leaf className="h-12 w-12" />
          <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Zara
          </h1>
        </div>
        <p className="max-w-md text-lg text-muted-foreground">
          Experience fresh, vibrant, and authentic flavors. Your culinary journey starts here.
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="h-14 rounded-full px-10 text-lg">
            <Link href="/menu">
              <QrCode className="mr-3 h-6 w-6" />
              Scan QR & View Menu
            </Link>
          </Button>
        </div>
        <p className="pt-8 text-sm text-muted-foreground">Click the button above to simulate scanning a QR code at your table.</p>
      </div>
    </div>
  );
}
