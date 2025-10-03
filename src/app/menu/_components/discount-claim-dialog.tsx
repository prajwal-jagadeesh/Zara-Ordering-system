'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/components/cart/cart-context';
import { useToast } from '@/hooks/use-toast';

interface DiscountClaimDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DiscountClaimDialog({ isOpen, setIsOpen }: DiscountClaimDialogProps) {
  const [proofUrl, setProofUrl] = useState('');
  const { tableNumber, submitDiscountProof } = useCart();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!proofUrl || !tableNumber) {
        toast({
            variant: "destructive",
            title: "Invalid URL",
            description: "Please enter a valid URL for your Instagram post.",
        });
        return;
    }
    
    // Basic URL validation
    try {
        new URL(proofUrl);
    } catch (_) {
        toast({
            variant: "destructive",
            title: "Invalid URL",
            description: "Please enter a valid URL (e.g., https://instagram.com/p/...).",
        });
        return;
    }

    submitDiscountProof(tableNumber, proofUrl);
    toast({
        title: "Discount Claimed!",
        description: "Your claim has been sent for verification. Please wait for staff to approve it.",
    });
    setIsOpen(false);
    setProofUrl('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim Social Media Discount</DialogTitle>
          <DialogDescription>
            Post a story or photo tagging @NikeesZara on Instagram, then paste the post URL below to claim your discount.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Post URL
            </Label>
            <Input
              id="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://instagram.com/p/..."
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Submit for Verification</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
