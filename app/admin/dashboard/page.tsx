'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  getCurrentUser,
  clearCurrentUser,
  isAdmin,
  isSuperAdmin,
  getApplications,
  updateApplicationStatus,
  type Application,
  type ApplicationStatus,
} from '@/lib/unified-store'
import { toast } from 'sonner'
import { LogOut, Users, Clock, CheckCircle, XCircle, Eye, UserCog } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUserState] = useState<string | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [reviewNote, setReviewNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || !isAdmin(user)) {
      router.push('/admin')
      return
    }
    setCurrentUserState(user)
    setApplications(getApplications())
    setIsCheckingAuth(false)
  }, [router])

  const handleLogout = () => {
    clearCurrentUser()
    toast.success('Logged out successfully')
    router.push('/admin')
  }

  const handleDecision = async (decision: 'accepted' | 'denied') => {
    if (!selectedApp || !currentUser) return
    setIsSubmitting(true)

    try {
      const updated = updateApplicationStatus(
        selectedApp.id,
        decision,
        currentUser,
        reviewNote || undefined
      )

      if (!updated) throw new Error('Failed to update application')

      // Send Discord notification
      await fetch('/api/notify-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantDiscord: selectedApp.discordUsername,
          applicantRoblox: selectedApp.robloxUsername,
          jobTitle: selectedApp.jobTitle,
          decision,
          reviewedBy: currentUser,
          reviewNote: reviewNote || undefined,
        }),
      })

      setApplications(getApplications())
      setIsReviewDialogOpen(false)
      setSelectedApp(null)
      setReviewNote('')

      toast.success(decision === 'accepted' ? 'Application Accepted' : 'Application Denied', {
        description: 'Decision has been recorded and applicant notified.',
      })
    } catch (error) {
      console.error('Error processing decision:', error)
      toast.error('Failed to process decision')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true
    return app.status === filterStatus
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    denied: applications.filter(a => a.status === 'denied').length,
  }

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">Pending</Badge>
      case 'under_review':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">Under Review</Badge>
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600">Accepted</Badge>
      case 'denied':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-600">Denied</Badge>
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
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Logged in as <span className="font-medium text-foreground">{currentUser}</span>
              </p>
            </div>
            <div className="flex gap-3">
              {currentUser && isSuperAdmin(currentUser) && (
                <Button variant="outline" asChild>
                  <Link href="/admin/manage">
                    <UserCog className="mr-2 h-4 w-4" />
                    Manage Admins
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Applications</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" /> Pending
                </CardDescription>
                <CardTitle className="text-3xl text-amber-600">{stats.pending}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> Accepted
                </CardDescription>
                <CardTitle className="text-3xl text-green-600">{stats.accepted}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" /> Denied
                </CardDescription>
                <CardTitle className="text-3xl text-red-600">{stats.denied}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Filter */}
          <div className="mb-6 flex items-center gap-4">
            <Label htmlFor="filter">Filter by status:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Applications
              </CardTitle>
              <CardDescription>Review and manage job applications</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredApplications.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No applications found</div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map(app => (
                    <div
                      key={app.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{app.robloxUsername}</span>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">Discord: {app.discordUsername}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied for: <span className="text-foreground">{app.jobTitle}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.submittedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedApp(app); setIsViewDialogOpen(true) }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        {app.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => { setSelectedApp(app); setReviewNote(''); setIsReviewDialogOpen(true) }}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedApp?.jobTitle} — {selectedApp?.robloxUsername}
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Roblox Username</Label>
                  <p className="font-medium">{selectedApp.robloxUsername}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Discord Username</Label>
                  <p className="font-medium">{selectedApp.discordUsername}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hours per Week</Label>
                  <p className="font-medium">{selectedApp.hoursPerWeek}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Availability</Label>
                  <p className="font-medium">{selectedApp.availability}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Previous Experience</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                  {selectedApp.experience || 'Not provided'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Why This Role?</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{selectedApp.whyRole}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Why avio group?</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{selectedApp.whyAvioGroup}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">What Makes You a Good Fit?</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{selectedApp.whatMakesYouFit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Difficult Situation Example</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{selectedApp.difficultSituation}</p>
              </div>
              {selectedApp.reviewedBy && (
                <div className="rounded-md border p-4">
                  <Label className="text-muted-foreground">Review Decision</Label>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatusBadge(selectedApp.status)}
                    <span className="text-sm text-muted-foreground">
                      by {selectedApp.reviewedBy} on{' '}
                      {new Date(selectedApp.reviewedAt!).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  {selectedApp.reviewNote && (
                    <p className="mt-2 text-sm">{selectedApp.reviewNote}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Make a decision on this application for {selectedApp?.jobTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm">
                <span className="text-muted-foreground">Applicant:</span>{' '}
                <span className="font-medium">{selectedApp?.robloxUsername}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Discord:</span>{' '}
                <span className="font-medium">{selectedApp?.discordUsername}</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewNote">Note (optional)</Label>
              <Textarea
                id="reviewNote"
                placeholder="Add a note about your decision..."
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="destructive"
              onClick={() => handleDecision('denied')}
              disabled={isSubmitting}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Deny
            </Button>
            <Button
              onClick={() => handleDecision('accepted')}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}