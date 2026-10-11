'use client'

import { Job, jobs } from '@/lib/jobs-data'

const STORAGE_KEY = 'avio-open-roles'

export function getOpenRoles(): Job[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveOpenRole(role: Job): void {
  const roles = getOpenRoles().filter((item) => item.id !== role.id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...roles, role]))
}

export function deleteOpenRole(id: string): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getOpenRoles().filter((role) => role.id !== id)))
}

export function getAllJobs(): Job[] {
  const customRoles = getOpenRoles()
  return [...jobs, ...customRoles]
}
