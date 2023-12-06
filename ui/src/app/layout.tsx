'use client'

import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import axios from 'axios'
import { get_config } from '@/config/config'

const inter = Inter({ subsets: ['latin'] })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata: Metadata = { 
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function RootLayout({ children }: RootLayoutProps) {

  axios.defaults.baseURL = `${get_config().api_endpoint}${get_config().api_endpoint_stage ? `/${get_config().api_endpoint_stage}`: ""}`;

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.className
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">
                <QueryClientProvider client={queryClient}>
                  {children}
                  <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
              </div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}