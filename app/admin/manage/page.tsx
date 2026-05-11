'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { 
  getCurrentUser, 
  isSuperAdmin,
  getAdmins,
  addAdmin,
  removeAdmin,
  SUPER_ADMIN
} from '@/lib/admin-store'
import { toast } from 'sonner'
import { ArrowLeft, UserPlus, Trash2, Shield, Crown } from 'lucide-react'

export default function ManageAdminsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUserState] = useState<string | null>(null)
  const [admins, setAdmins] = useState<string[]>([])
  const [newAdmin, setNewAdmin] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || !isSuperAdmin(user)) {
      router.push('/admin')
      return
    }
    setCurrentUserState(user)
    setAdmins(getAdmins())
    setIsCheckingAuth(false)
  }, [router])

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newAdmin.trim().toLowerCase()
    
    if (!trimmed) {
      toast.error('Please enter a Discord username')
      return
    }

    if (addAdmin(trimmed)) {
      setAdmins(getAdmins())
      setNewAdmin('')
      toast.success('Admin Added', {
        description: `${trimmed} can now access the admin panel.`,
      })
    } else {
      toast.error('User is already an admin')
    }
  }

  const handleRemoveAdmin = (username: string) => {
    if (username.toLowerCase() === SUPER_ADMIN.toLowerCase()) {
      toast.error('Cannot remove super admin')
      return
    }

    if (removeAdmin(username)) {
      setAdmins(getAdmins())
      toast.success('Admin Removed', {
        description: `${username} no longer has admin access.`,
      })
    }
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
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Admins</h1>
            <p className="mt-1 text-muted-foreground">
              Add or remove users who can review applications
            </p>
          </div>

          {/* Add Admin */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Admin
              </CardTitle>
              <CardDescription>
                Enter the Discord username of the person you want to grant admin access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="newAdmin" className="sr-only">Discord Username</Label>
                  <Input
                    id="newAdmin"
                    type="text"
                    placeholder="Discord username"
                    value={newAdmin}
                    onChange={(e) => setNewAdmin(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Admin
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Admin List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Current Admins
              </CardTitle>
              <CardDescription>
                {admins.length} user{admins.length !== 1 ? 's' : ''} with admin access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {admins.map((admin) => {
                  const isSuper = admin.toLowerCase() === SUPER_ADMIN.toLowerCase()
                  return (
                    <div
                      key={admin}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isSuper ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                          {isSuper ? (
                            <Crown className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Shield className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{admin}</p>
                          {isSuper && (
                            <Badge variant="secondary" className="mt-1 bg-amber-500/10 text-amber-600">
                              Super Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!isSuper && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                          onClick={() => handleRemoveAdmin(admin)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
