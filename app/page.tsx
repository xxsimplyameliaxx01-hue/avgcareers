import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobCard } from '@/components/job-card'
import { Button } from '@/components/ui/button'
import { jobs } from '@/lib/jobs-data'
import { ArrowRight, Users, Plane, Heart, TrendingUp } from 'lucide-react'

const values = [
  {
    icon: Users,
    title: 'Team Spirit',
    description: 'We work together across flight operations, ground services, and passenger services to deliver excellence.'
  },
  {
    icon: Plane,
    title: 'Aviation Excellence',
    description: 'Be part of an industry that connects people and places, making a real difference in how the world travels.'
  },
  {
    icon: Heart,
    title: 'Flexible Working',
    description: 'We offer flexible hours and shift patterns to help you maintain a healthy work-life balance.'
  },
  {
    icon: TrendingUp,
    title: 'Career Progression',
    description: 'From cabin crew to captain, ramp agent to operations manager - we invest in your growth and development.'
  }
]

const stats = [
  { value: '500+', label: 'Team Members' },
  { value: '50+', label: 'Destinations' },
  { value: '2M+', label: 'Passengers Annually' },
  { value: '98%', label: 'Employee Satisfaction' }
]

export default function HomePage() {
  const featuredJobs = jobs.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary py-24 sm:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
                Build Your Career at avio group
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/80 text-pretty">
                Join our aviation team and help connect people with the places they love. From the flight deck to the terminal, we&apos;re looking for passionate people to take off with us.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/jobs">
                    Explore Open Positions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                  <Link href="/applications">
                    Track Your Applications
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Join avio group?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We offer more than just a job. We offer a place where you can grow, make an impact, and be part of something bigger.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="bg-secondary/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Featured Positions
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Explore some of our most exciting open roles.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/jobs">
                  View All Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 space-y-4">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} featured />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to Take the Next Step?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Your dream role might be just a click away. Browse our open positions and find where you belong.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/jobs">
                    Browse All Positions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
