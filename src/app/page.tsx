'use client';

import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function Home() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API is not supported in this browser.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 text-center bg-background">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4 font-headline">
          QR Code Scanner
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Scan the QR code on your table to open the menu.
        </p>

        <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center mb-8 border">
          {hasCameraPermission === null && (
            <p className="text-muted-foreground">Initializing Camera...</p>
          )}
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        </div>
        
        {hasCameraPermission === false && (
            <Alert variant="destructive" className="mb-8">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser settings to use this feature. You can still view the menu manually.
              </AlertDescription>
            </Alert>
        )}

        <Button asChild size="lg" className="h-14 rounded-full px-10 text-lg w-full">
          <Link href="/menu">
            <QrCode className="mr-3 h-6 w-6" />
            View Menu
          </Link>
        </Button>
        <p className="pt-4 text-sm text-muted-foreground">Click button to simulate scan</p>
      </div>
    </div>
  );
}
