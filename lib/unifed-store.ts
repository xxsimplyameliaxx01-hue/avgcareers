'use client'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SUPER_ADMIN = 'cxntiss1mo'

const ADMINS_KEY = 'avio-admins'
const CURRENT_USER_KEY = 'avio-current-user'
const APPLICATIONS_KEY = 'avio-applications' // single source of truth

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ApplicationStatus = 'pending' | 'under_review' | 'accepted' | 'denied'

export interface Application {
  // Identity
  id: string
  jobId: string
  jobTitle: string
  department: string

  // Applicant details (filled on submit)
  robloxUsername: string
  discordUsername: string
  experience: string
  hoursPerWeek: string
  availability: string
  whyRole: string
  whyAvioGroup: string
  whatMakesYouFit: string
  difficultSituation: string

  // Timestamps
  submittedAt: string

  // Status (managed by admin)
  status: ApplicationStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNote?: string
}

// ---------------------------------------------------------------------------
// Application CRUD
// ---------------------------------------------------------------------------

export function getApplications(): Application[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(APPLICATIONS_KEY)
  return stored ? (JSON.parse(stored) as Application[]) : []
}

function saveApplications(applications: Application[]): void {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications))
}

export function addApplication(
  data: Omit<Application, 'id' | 'submittedAt' | 'status'>
): Application {
  const applications = getApplications()
  const newApp: Application = {
    ...data,
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  }
  applications.push(newApp)
  saveApplications(applications)
  return newApp
}

export function removeApplication(id: string): void {
  saveApplications(getApplications().filter(a => a.id !== id))
}

export function removeApplicationByJobId(jobId: string): void {
  saveApplications(getApplications().filter(a => a.jobId !== jobId))
}

export function getApplicationByJobId(jobId: string): Application | undefined {
  return getApplications().find(a => a.jobId === jobId)
}

export function hasAppliedToJob(jobId: string): boolean {
  return getApplications().some(a => a.jobId === jobId)
}

/** Admin: update status and record reviewer */
export function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  reviewedBy: string,
  reviewNote?: string
): Application | null {
  const applications = getApplications()
  const index = applications.findIndex(a => a.id === applicationId)
  if (index === -1) return null

  applications[index] = {
    ...applications[index],
    status,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    reviewNote,
  }
  saveApplications(applications)
  return applications[index]
}

// ---------------------------------------------------------------------------
// Status display helpers (used on the applicant side)
// ---------------------------------------------------------------------------

export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    pending: 'Application Submitted',
    under_review: 'Under Review',
    accepted: 'Offer Extended',
    denied: 'Not Selected',
  }
  return labels[status]
}

export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    pending: 'bg-amber-100 text-amber-800',
    under_review: 'bg-blue-100 text-blue-800',
    accepted: 'bg-emerald-100 text-emerald-800',
    denied: 'bg-red-100 text-red-800',
  }
  return colors[status]
}

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------

export function getAdmins(): string[] {
  if (typeof window === 'undefined') return [SUPER_ADMIN]
  const stored = localStorage.getItem(ADMINS_KEY)
  if (!stored) return [SUPER_ADMIN]
  const admins = JSON.parse(stored) as string[]
  if (!admins.includes(SUPER_ADMIN)) admins.push(SUPER_ADMIN)
  return admins
}

export function addAdmin(username: string): boolean {
  const admins = getAdmins()
  const normalized = username.toLowerCase().trim()
  if (admins.map(a => a.toLowerCase()).includes(normalized)) return false
  admins.push(normalized)
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins))
  return true
}

export function removeAdmin(username: string): boolean {
  if (username.toLowerCase() === SUPER_ADMIN.toLowerCase()) return false
  const filtered = getAdmins().filter(
    a => a.toLowerCase() !== username.toLowerCase()
  )
  localStorage.setItem(ADMINS_KEY, JSON.stringify(filtered))
  return true
}

export function isAdmin(username: string): boolean {
  return getAdmins()
    .map(a => a.toLowerCase())
    .includes(username.toLowerCase().trim())
}

export function isSuperAdmin(username: string): boolean {
  return username.toLowerCase().trim() === SUPER_ADMIN.toLowerCase()
}

export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_USER_KEY)
}

export function setCurrentUser(username: string): void {
  localStorage.setItem(CURRENT_USER_KEY, username.toLowerCase().trim())
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}