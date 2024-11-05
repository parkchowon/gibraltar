'use client'
import { useNotifications } from '@/hooks/useNotifiactions'
import React, { PropsWithChildren } from 'react'

function RootLayout({ children }: PropsWithChildren) {
    useNotifications()
  return (
    <>
    {children}
    </>
  )
}

export default RootLayout