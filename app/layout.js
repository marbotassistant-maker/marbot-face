export const metadata = {
  title: 'MarBot2',
  description: 'AI Assistant Interface',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0f', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
