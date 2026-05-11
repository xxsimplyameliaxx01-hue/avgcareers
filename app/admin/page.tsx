'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { isAdmin, setCurrentUser, getCurrentUser } from '@/lib/admin-store'
import { toast } from 'sonner'
import { Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if already logged in
    const currentUser = getCurrentUser()
    if (currentUser && isAdmin(currentUser)) {
      router.push('/admin/dashboard')
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const trimmedUsername = username.trim().toLowerCase()

    if (!trimmedUsername) {
      toast.error('Please enter your credentials')
      setIsLoading(false)
      return
    }

    if (!isAdmin(trimmedUsername)) {
      toast.error('Access Denied', {
        description: 'You are not authorized to access the admin panel.',
      })
      setIsLoading(false)
      return
    }

    setCurrentUser(trimmedUsername)
    toast.success('Welcome back!', {
      description: 'Redirecting to dashboard...',
    })
    
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 500)
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your Discord username to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Discord Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your Discord username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
