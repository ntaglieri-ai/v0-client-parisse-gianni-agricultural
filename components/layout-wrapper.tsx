'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface LayoutWrapperProps {
  children: ReactNode
  header: ReactNode
  footer: ReactNode
}

export function LayoutWrapper({ children, header, footer }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    // Admin pages have their own layout, don't show header/footer
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  )
}
