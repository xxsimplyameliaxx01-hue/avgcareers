'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getApplications, getStatusLabel, getStatusColor, Application } from '@/lib/applications-store'
import { FileText, ArrowRight, Calendar, Building, Briefcase } from 'lucide-react'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setApplications(getApplications())
    setIsLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const pendingCount = applications.filter(app => app.status === 'pending').length
  const reviewingCount = applications.filter(app => app.status === 'reviewing').length
  const interviewCount = applications.filter(app => app.status === 'interview').length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border bg-secondary/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My Applications
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Track the status of your job applications and stay updated on your career journey.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : applications.length > 0 ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">{reviewingCount}</div>
                      <p className="text-sm text-muted-foreground">Under Review</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-cyan-600">{interviewCount}</div>
                      <p className="text-sm text-muted-foreground">Interviews</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                  {applications.map((application) => (
                    <Card key={application.id} className="transition-all hover:shadow-md hover:border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(application.status)}>
                                {getStatusLabel(application.status)}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {application.jobTitle}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Building className="h-4 w-4" />
                                {application.department}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Applied {formatDate(application.appliedDate)}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/jobs/${application.jobId}`}>
                              View Position
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        
                        {/* Progress Timeline */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="flex items-center justify-between">
                            <TimelineStep 
                              label="Applied" 
                              active={true}
                              completed={['reviewing', 'interview', 'offer'].includes(application.status)} 
                            />
                            <TimelineConnector completed={['reviewing', 'interview', 'offer'].includes(application.status)} />
                            <TimelineStep 
                              label="Review" 
                              active={application.status === 'reviewing'}
                              completed={['interview', 'offer'].includes(application.status)} 
                            />
                            <TimelineConnector completed={['interview', 'offer'].includes(application.status)} />
                            <TimelineStep 
                              label="Interview" 
                              active={application.status === 'interview'}
                              completed={application.status === 'offer'} 
                            />
                            <TimelineConnector completed={application.status === 'offer'} />
                            <TimelineStep 
                              label="Offer" 
                              active={application.status === 'offer'}
                              completed={false} 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">No applications yet</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  You haven&apos;t applied to any positions yet. Browse our open roles and take the first step toward your new career.
                </p>
                <Button className="mt-8" asChild>
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Open Positions
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function TimelineStep({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`h-3 w-3 rounded-full transition-colors ${
          completed 
            ? 'bg-primary' 
            : active 
              ? 'bg-primary ring-4 ring-primary/20' 
              : 'bg-muted'
        }`} 
      />
      <span className={`mt-2 text-xs ${active || completed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  )
}

function TimelineConnector({ completed }: { completed: boolean }) {
  return (
    <div className={`flex-1 h-0.5 mx-2 transition-colors ${completed ? 'bg-primary' : 'bg-muted'}`} />
  )
}
