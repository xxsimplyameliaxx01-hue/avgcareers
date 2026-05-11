'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getJobById, jobs, Job } from '@/lib/jobs-data'
import { hasAppliedToJob, getApplicationByJobId, getStatusLabel, getStatusColor } from '@/lib/applications-store'
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, Building, CheckCircle } from 'lucide-react'
import { ApplicationDialog } from '@/components/application-dialog'

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const job = getJobById(resolvedParams.id)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (job) {
      const applied = hasAppliedToJob(job.id)
      setHasApplied(applied)
      if (applied) {
        const app = getApplicationByJobId(job.id)
        if (app) {
          setApplicationStatus(getStatusLabel(app.status))
        }
      }
    }
  }, [job])

  if (!job) {
    notFound()
  }

  const relatedJobs = jobs.filter(j => j.department === job.department && j.id !== job.id).slice(0, 2)

  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setApplicationStatus('Application Submitted')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all positions
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary">{job.department}</Badge>
                  <Badge variant="outline">{job.type}</Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {job.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Posted {job.posted}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Role</h2>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Responsibilities */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Apply for this position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasApplied ? (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        You have already applied for this position. Track your application status on the{' '}
                        <Link href="/applications" className="text-primary hover:underline">
                          My Applications
                        </Link>{' '}
                        page.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Ready to join our team? Submit your application and take the first step toward your new career.
                      </p>
                      <ApplicationDialog 
                        job={job} 
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        onSuccess={handleApplicationSuccess}
                      />
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    About avio group
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    avio group is a leading technology company focused on building innovative solutions that transform industries. With over 40 employees across 5 countries, we&apos;re committed to creating a diverse and inclusive workplace.
                  </p>
                </CardContent>
              </Card>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Positions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedJobs.map((relatedJob) => (
                      <Link
                        key={relatedJob.id}
                        href={`/jobs/${relatedJob.id}`}
                        className="block group"
                      >
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {relatedJob.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {relatedJob.location} · {relatedJob.type}
                        </p>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}