'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobCard } from '@/components/job-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { jobs, departments, locations, types } from '@/lib/jobs-data'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState<string>('all')
  const [location, setLocation] = useState<string>('all')
  const [type, setType] = useState<string>('all')

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = search === '' || 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      const matchesDepartment = department === 'all' || job.department === department
      const matchesLocation = location === 'all' || job.location === location
      const matchesType = type === 'all' || job.type === type
      return matchesSearch && matchesDepartment && matchesLocation && matchesType
    })
  }, [search, department, location, type])

  const activeFiltersCount = [department, location, type].filter(f => f !== 'all').length

  const clearFilters = () => {
    setSearch('')
    setDepartment('all')
    setLocation('all')
    setType('all')
  }

  const FilterControls = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Department</label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Location</label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Job Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border bg-secondary/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Open Positions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Find your perfect role at avio group. We&apos;re always looking for talented people to join our team.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                        Clear all
                      </Button>
                    )}
                  </div>
                  <FilterControls />
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Search and Mobile Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search positions..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile Filters */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px]">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterControls />
                        {activeFiltersCount > 0 && (
                          <Button variant="outline" onClick={clearFilters} className="w-full mt-6">
                            Clear all filters
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="hidden sm:flex flex-wrap gap-2 mb-6">
                    {department !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {department}
                        <button onClick={() => setDepartment('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {location !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {location}
                        <button onClick={() => setLocation('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {type !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {type}
                        <button onClick={() => setType('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} found
                </p>

                {/* Job Listings */}
                <div className="space-y-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))
                  ) : (
                    <div className="text-center py-16 px-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">No positions found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filters to find what you&apos;re looking for.
                      </p>
                      <Button variant="outline" onClick={clearFilters} className="mt-6">
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
