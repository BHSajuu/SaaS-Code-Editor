import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "react-hot-toast";
import { shadesOfPurple } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeNexta",
  description: "An advanced saas code editor",
  icons: {
    icon: "logo.png", 
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: shadesOfPurple,
        variables: { colorPrimary: '#FFB200', colorTextOnPrimaryBackground:'black', colorInputBackground:"#B7C9F2" , colorInputText:"#071952" ,borderRadius:"0.675rem" },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
        >
         <ConvexClientProvider> {children} </ConvexClientProvider>
            <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#C0C9EE",
              color: "#090040",
            },
          }}
        />
        </body>
      </html>
    </ClerkProvider>

  );
}
