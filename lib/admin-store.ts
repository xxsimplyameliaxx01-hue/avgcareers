'use client'

// Super admin who can manage other admins
export const SUPER_ADMIN = 'cxntiss1mo'

// Keys for localStorage
const ADMINS_KEY = 'avio-admins'
const CURRENT_USER_KEY = 'avio-current-user'
const SUBMITTED_APPLICATIONS_KEY = 'avio-submitted-applications'

export type ApplicationStatus = 'pending' | 'under_review' | 'accepted' | 'denied'

export interface SubmittedApplication {
  id: string
  jobTitle: string
  robloxUsername: string
  discordUsername: string
  experience: string
  hoursPerWeek: string
  whyRole: string
  whyAvioGroup: string
  whatMakesYouFit: string
  difficultSituation: string
  availability: string
  submittedAt: string
  status: ApplicationStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNote?: string
}

// Get list of admins
export function getAdmins(): string[] {
  if (typeof window === 'undefined') return [SUPER_ADMIN]
  const stored = localStorage.getItem(ADMINS_KEY)
  if (!stored) return [SUPER_ADMIN]
  const admins = JSON.parse(stored) as string[]
  // Always include super admin
  if (!admins.includes(SUPER_ADMIN)) {
    admins.push(SUPER_ADMIN)
  }
  return admins
}

// Add an admin
export function addAdmin(username: string): boolean {
  const admins = getAdmins()
  const normalizedUsername = username.toLowerCase().trim()
  if (admins.map(a => a.toLowerCase()).includes(normalizedUsername)) {
    return false
  }
  admins.push(normalizedUsername)
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins))
  return true
}

// Remove an admin
export function removeAdmin(username: string): boolean {
  if (username.toLowerCase() === SUPER_ADMIN.toLowerCase()) {
    return false // Cannot remove super admin
  }
  const admins = getAdmins()
  const filtered = admins.filter(a => a.toLowerCase() !== username.toLowerCase())
  localStorage.setItem(ADMINS_KEY, JSON.stringify(filtered))
  return true
}

// Check if user is an admin
export function isAdmin(username: string): boolean {
  const admins = getAdmins()
  return admins.map(a => a.toLowerCase()).includes(username.toLowerCase().trim())
}

// Check if user is super admin
export function isSuperAdmin(username: string): boolean {
  return username.toLowerCase().trim() === SUPER_ADMIN.toLowerCase()
}

// Get current logged in user
export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_USER_KEY)
}

// Set current user (login)
export function setCurrentUser(username: string): void {
  localStorage.setItem(CURRENT_USER_KEY, username.toLowerCase().trim())
}

// Clear current user (logout)
export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Get all submitted applications
export function getSubmittedApplications(): SubmittedApplication[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(SUBMITTED_APPLICATIONS_KEY)
  if (!stored) return []
  return JSON.parse(stored) as SubmittedApplication[]
}

// Add a submitted application
export function addSubmittedApplication(application: Omit<SubmittedApplication, 'id' | 'submittedAt' | 'status'>): SubmittedApplication {
  const applications = getSubmittedApplications()
  const newApp: SubmittedApplication = {
    ...application,
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  }
  applications.push(newApp)
  localStorage.setItem(SUBMITTED_APPLICATIONS_KEY, JSON.stringify(applications))
  return newApp
}

// Update application status
export function updateApplicationStatus(
  applicationId: string, 
  status: ApplicationStatus, 
  reviewedBy: string,
  reviewNote?: string
): SubmittedApplication | null {
  const applications = getSubmittedApplications()
  const index = applications.findIndex(a => a.id === applicationId)
  if (index === -1) return null
  
  applications[index] = {
    ...applications[index],
    status,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    reviewNote,
  }
  localStorage.setItem(SUBMITTED_APPLICATIONS_KEY, JSON.stringify(applications))
  return applications[index]
}
