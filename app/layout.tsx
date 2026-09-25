import type { Metadata } from 'next';
import { Schibsted_Grotesk, Martian_Mono } from 'next/font/google';

import LightRays from '@/components/LightRays';
import './globals.css';
import Navbar from '@/components/Navbar';

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const martianMono = Martian_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dev event',
  description: 'The hub for every dev event you mustnt miss',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${schibstedGrotesk.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col' min-h-screen>
        <Navbar />
        <div className='absolute insert-0 top-0'>
          <LightRays
            raysOrigin='top-center-offset'
            raysColor='#5dfeca'
            raysSpeed={1}
            lightSpread={1.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className='custom-rays'
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <main> {children}</main>
      </body>
    </html>
  );
}
