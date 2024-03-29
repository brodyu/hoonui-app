import { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from "@clerk/nextjs";
import '../styles/index.css';


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
      {/* Vercel Analytics */}
      <Analytics />
    </ClerkProvider>
  );
}
