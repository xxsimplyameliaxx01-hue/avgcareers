import Link from 'next/link'
import { Job } from '@/lib/jobs-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react'

interface JobCardProps {
  job: Job
  featured?: boolean
}

export function JobCard({ job, featured = false }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className={`group transition-all duration-200 hover:shadow-md hover:border-primary/20 ${featured ? 'border-primary/30 bg-primary/[0.02]' : ''}`}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  {job.department}
                </Badge>
                {featured && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {job.posted}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-medium text-foreground">{job.salary}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
