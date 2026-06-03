'use client'

import { Application } from './jobs-data'

const STORAGE_KEY = 'avio-applications'

export function getApplications(): Application[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addApplication(application: Omit<Application, 'id' | 'appliedDate'>): Application {
  const applications = getApplications()
  const newApplication: Application = {
    ...application,
    id: crypto.randomUUID(),
    appliedDate: new Date().toISOString()
  }
  applications.push(newApplication)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  return newApplication
}

export function hasAppliedToJob(jobId: string): boolean {
  const applications = getApplications()
  return applications.some(app => app.jobId === jobId)
}

export function getApplicationByJobId(jobId: string): Application | undefined {
  const applications = getApplications()
  return applications.find(app => app.jobId === jobId)
}

export function getStatusLabel(status: Application['status']): string {
  const labels: Record<Application['status'], string> = {
    pending: 'Application Submitted',
    reviewing: 'Under Review',
    interview: 'Interview Scheduled',
    offer: 'Offer Extended',
    rejected: 'Not Selected'
  }
  return labels[status]
}

export function getStatusColor(status: Application['status']): string {
  const colors: Record<Application['status'], string> = {
    pending: 'bg-amber-100 text-amber-800',
    reviewing: 'bg-blue-100 text-blue-800',
    interview: 'bg-cyan-100 text-cyan-800',
    offer: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return colors[status]
}

export function updateApplicationStatusByJob(jobTitle: string, newStatus: Application['status']): boolean {
  const applications = getApplications()
  const index = applications.findIndex(app => app.jobTitle === jobTitle)
  if (index === -1) return false
  
  applications[index].status = newStatus
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  return true
}
