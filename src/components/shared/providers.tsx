import { Toaster } from "@/components/ui/sonner";
import { PaddleProvider } from "@/components/providers/paddle-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors closeButton />
      <PaddleProvider />
    </>
  );
}
