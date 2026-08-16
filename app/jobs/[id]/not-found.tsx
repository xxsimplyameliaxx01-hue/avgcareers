import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function JobNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Position Not Found</h1>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            The job posting you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild>
              <Link href="/jobs">View All Positions</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
