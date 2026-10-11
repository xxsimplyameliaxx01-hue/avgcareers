'use client'

import { Job, jobs } from '@/lib/jobs-data'

const STORAGE_KEY = 'avio-open-roles'
const OVERRIDES_KEY = 'avio-role-overrides'

function readRoles(key: string): Job[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getOpenRoles(): Job[] {
  return readRoles(STORAGE_KEY)
}

function getRoleOverrides(): Job[] {
  return readRoles(OVERRIDES_KEY)
}

export function saveOpenRole(role: Job): void {
  const isBuiltIn = jobs.some((item) => item.id === role.id)
  const key = isBuiltIn ? OVERRIDES_KEY : STORAGE_KEY
  const roles = (isBuiltIn ? getRoleOverrides() : getOpenRoles()).filter((item) => item.id !== role.id)
  window.localStorage.setItem(key, JSON.stringify([...roles, role]))
}

export function deleteOpenRole(id: string): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getOpenRoles().filter((role) => role.id !== id)))
}

export function getAllJobs(): Job[] {
  const overrides = new Map(getRoleOverrides().map((role) => [role.id, role]))
  const publishedJobs = jobs.map((role) => overrides.get(role.id) ?? role)
  const customRoles = getOpenRoles()
  return [...publishedJobs, ...customRoles]
}
