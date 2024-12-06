import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { metadata } from './metadata'
import { Box } from '@mui/material'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Box sx={{ flex: '1 0 auto' }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </Providers>
      </body>
    </html>
  )
}
