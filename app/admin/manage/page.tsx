'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { 
  getCurrentUser, 
  isSuperAdmin,
  getAdmins,
  addAdmin,
  removeAdmin,
  SUPER_ADMIN
} from '@/lib/admin-store'
import { toast } from 'sonner'
import { jobs, Job } from '@/lib/jobs-data'
import { getAllJobs, getOpenRoles, saveOpenRole, deleteOpenRole } from '@/lib/open-roles-store'
import { ApplicationQuestion, ApplicationTemplate, defaultApplicationQuestions, getApplicationQuestions, saveApplicationQuestions, createApplicationTemplate, getApplicationTemplates, saveApplicationTemplate, deleteApplicationTemplate } from '@/lib/application-forms-store'
import { ArrowLeft, UserPlus, Trash2, Shield, Crown, Plus, Save, Pencil } from 'lucide-react'

export default function ManageAdminsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUserState] = useState<string | null>(null)
  const [admins, setAdmins] = useState<string[]>([])
  const [newAdmin, setNewAdmin] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState(getAllJobs()[0]?.id ?? '')
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [templates, setTemplates] = useState<ApplicationTemplate[]>([])
  const [newApplicationTitle, setNewApplicationTitle] = useState('')
  const [openRoles, setOpenRoles] = useState<Job[]>([])
  const [newRole, setNewRole] = useState({ title: '', department: '', location: 'England', type: 'Flexible' as Job['type'], salary: 'Competitive', description: '', requirements: '', responsibilities: '' })
  const [editingRole, setEditingRole] = useState<Job | null>(null)

  useEffect(() => {
    setTemplates(getApplicationTemplates())
    setOpenRoles(getOpenRoles())
  }, [])

  const handleSaveRole = (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingRole || !editingRole.title.trim() || !editingRole.department.trim() || !editingRole.description.trim()) {
      toast.error('Complete the role title, department, and description')
      return
    }
    saveOpenRole({ ...editingRole, title: editingRole.title.trim(), department: editingRole.department.trim(), description: editingRole.description.trim(), requirements: editingRole.requirements.map((item) => item.trim()).filter(Boolean), responsibilities: editingRole.responsibilities.map((item) => item.trim()).filter(Boolean) })
    setOpenRoles(getOpenRoles())
    setSelectedJobId(editingRole.id)
    toast.success('Role updated')
  }

  const handleCreateRole = (event: React.FormEvent) => {
    event.preventDefault()
    const title = newRole.title.trim()
    if (!title || !newRole.department.trim() || !newRole.description.trim()) {
      toast.error('Complete the role title, department, and description')
      return
    }
    const role: Job = {
      id: `custom-role-${Date.now()}`,
      title,
      department: newRole.department.trim(),
      location: newRole.location.trim() || 'England',
      type: newRole.type,
      salary: newRole.salary.trim() || 'Competitive',
      posted: 'Just now',
      description: newRole.description.trim(),
      requirements: newRole.requirements.split('\\n').map((item) => item.trim()).filter(Boolean),
      responsibilities: newRole.responsibilities.split('\\n').map((item) => item.trim()).filter(Boolean),
    }
    saveOpenRole(role)
    setOpenRoles(getOpenRoles())
    setNewRole({ title: '', department: '', location: 'England', type: 'Flexible', salary: 'Competitive', description: '', requirements: '', responsibilities: '' })
    toast.success('Open role created', { description: `${title} is now visible on the Open Positions page.` })
  }

  useEffect(() => {
    if (!selectedJobId) return
    const template = templates.find((item) => item.id === selectedJobId)
    setQuestions(template?.questions ?? getApplicationQuestions(selectedJobId))
    setEditingRole(getAllJobs().find((role) => role.id === selectedJobId) ?? null)
  }, [selectedJobId, templates])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || !isSuperAdmin(user)) {
      router.push('/admin')
      return
    }
    setCurrentUserState(user)
    setAdmins(getAdmins())
    setIsCheckingAuth(false)
  }, [router])

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newAdmin.trim().toLowerCase()
    
    if (!trimmed) {
      toast.error('Please enter a Discord username')
      return
    }

    if (addAdmin(trimmed)) {
      setAdmins(getAdmins())
      setNewAdmin('')
      toast.success('Admin Added', {
        description: `${trimmed} can now access the admin panel.`,
      })
    } else {
      toast.error('User is already an admin')
    }
  }

  const handleRemoveAdmin = (username: string) => {
    if (username.toLowerCase() === SUPER_ADMIN.toLowerCase()) {
      toast.error('Cannot remove super admin')
      return
    }

    if (removeAdmin(username)) {
      setAdmins(getAdmins())
      toast.success('Admin Removed', {
        description: `${username} no longer has admin access.`,
      })
    }
  }

  const updateQuestion = (id: string, label: string) => {
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, label } : question))
  }

  const addQuestion = () => {
    const label = newQuestion.trim()
    if (!label) return
    setQuestions((current) => [...current, { id: `custom-${Date.now()}`, label, placeholder: 'Type your answer here.', required: true }])
    setNewQuestion('')
  }

  const removeQuestion = (id: string) => setQuestions((current) => current.filter((question) => question.id !== id))

  const saveQuestions = () => {
    saveApplicationQuestions(selectedJobId, questions)
    toast.success('Application questions saved')
  }

  const resetQuestions = () => {
    setQuestions(defaultApplicationQuestions)
    saveApplicationQuestions(selectedJobId, defaultApplicationQuestions)
    toast.success('Default questions restored')
  }

  const createApplication = () => {
    const title = newApplicationTitle.trim()
    if (!title) {
      toast.error('Enter an application name')
      return
    }
    const template = createApplicationTemplate(title)
    setTemplates(getApplicationTemplates())
    setSelectedJobId(template.id)
    setQuestions(template.questions)
    setNewApplicationTitle('')
    toast.success('Application created')
  }

  const saveQuestionsForSelection = () => {
    const template = templates.find((item) => item.id === selectedJobId)
    if (template) {
      saveApplicationTemplate({ ...template, questions })
      setTemplates(getApplicationTemplates())
    } else {
      saveApplicationQuestions(selectedJobId, questions)
    }
    toast.success('Application questions saved')
  }

  const removeCreatedApplication = () => {
    if (!templates.some((item) => item.id === selectedJobId)) return
    deleteApplicationTemplate(selectedJobId)
    const next = getApplicationTemplates()
    setTemplates(next)
    setSelectedJobId(getAllJobs()[0]?.id ?? '')
    toast.success('Application deleted')
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Admins</h1>
            <p className="mt-1 text-muted-foreground">
              Add or remove users who can review applications
            </p>
          </div>

          {/* Add Admin */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Admin
              </CardTitle>
              <CardDescription>
                Enter the Discord username of the person you want to grant admin access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="newAdmin" className="sr-only">Discord Username</Label>
                  <Input
                    id="newAdmin"
                    type="text"
                    placeholder="Discord username"
                    value={newAdmin}
                    onChange={(e) => setNewAdmin(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Admin
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Application Questions
              </CardTitle>
              <CardDescription>
                Create an application for a role by editing its default questions. Changes appear on the public Apply form.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="application-role">Application role</Label>
                <select
                  id="application-role"
                  value={selectedJobId}
                  onChange={(event) => setSelectedJobId(event.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <optgroup label="Open roles">
                    {getAllJobs().map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
                  </optgroup>
                  {templates.length > 0 && (
                    <optgroup label="Created applications">
                      {templates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}
                    </optgroup>
                  )}
                </select>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={newApplicationTitle}
                    onChange={(event) => setNewApplicationTitle(event.target.value)}
                    placeholder="New application name"
                    aria-label="New application name"
                  />
                  <Button type="button" variant="outline" onClick={createApplication}>
                    <Plus className="mr-2 h-4 w-4" /> Create application
                  </Button>
                  {templates.some((template) => template.id === selectedJobId) && (
                    <Button type="button" variant="ghost" onClick={removeCreatedApplication}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <span className="pt-2 text-sm text-muted-foreground">{index + 1}</span>
                    <Input
                      value={question.label}
                      onChange={(event) => updateQuestion(question.id, event.target.value)}
                      aria-label={`Question ${index + 1}`}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(question.id)} aria-label={`Delete question ${index + 1}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={newQuestion}
                  onChange={(event) => setNewQuestion(event.target.value)}
                  placeholder="Add a new application question"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                      event.preventDefault()
                      addQuestion()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" /> Add question
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={saveQuestionsForSelection}>
                  <Save className="mr-2 h-4 w-4" /> Save application
                </Button>
                <Button type="button" variant="ghost" onClick={resetQuestions}>Restore defaults</Button>
              </div>
            </CardContent>
          </Card>

          {editingRole && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Edit Open Role</CardTitle>
                <CardDescription>Update any role details. Changes are used everywhere the role appears.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveRole} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2"><Label htmlFor="edit-role-title">Role title</Label><Input id="edit-role-title" value={editingRole.title} onChange={(e) => setEditingRole({ ...editingRole, title: e.target.value })} /></div>
                    <div className="flex flex-col gap-2"><Label htmlFor="edit-role-department">Department</Label><Input id="edit-role-department" value={editingRole.department} onChange={(e) => setEditingRole({ ...editingRole, department: e.target.value })} /></div>
                    <div className="flex flex-col gap-2"><Label htmlFor="edit-role-location">Location</Label><Input id="edit-role-location" value={editingRole.location} onChange={(e) => setEditingRole({ ...editingRole, location: e.target.value })} /></div>
                    <div className="flex flex-col gap-2"><Label htmlFor="edit-role-salary">Salary</Label><Input id="edit-role-salary" value={editingRole.salary} onChange={(e) => setEditingRole({ ...editingRole, salary: e.target.value })} /></div>
                  </div>
                  <div className="flex flex-col gap-2"><Label htmlFor="edit-role-description">Description</Label><textarea id="edit-role-description" value={editingRole.description} onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })} className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2"><Label htmlFor="edit-role-requirements">Requirements</Label><textarea id="edit-role-requirements" value={editingRole.requirements.join('\n')} onChange={(e) => setEditingRole({ ...editingRole, requirements: e.target.value.split('\n') })} className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                    <div className="flex flex-col gap-2"><Label htmlFor="edit-role-responsibilities">Responsibilities</Label><textarea id="edit-role-responsibilities" value={editingRole.responsibilities.join('\n')} onChange={(e) => setEditingRole({ ...editingRole, responsibilities: e.target.value.split('\n') })} className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  </div>
                  <Button type="submit" className="self-start"><Save className="mr-2 h-4 w-4" /> Save role changes</Button>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create an Open Role</CardTitle>
              <CardDescription>Publish a new role to the public Open Positions page.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRole} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2"><Label htmlFor="role-title">Role title</Label><Input id="role-title" value={newRole.title} onChange={(e) => setNewRole({ ...newRole, title: e.target.value })} placeholder="e.g. Flight Dispatcher" /></div>
                  <div className="flex flex-col gap-2"><Label htmlFor="role-department">Department</Label><Input id="role-department" value={newRole.department} onChange={(e) => setNewRole({ ...newRole, department: e.target.value })} placeholder="e.g. Flight Operations" /></div>
                  <div className="flex flex-col gap-2"><Label htmlFor="role-location">Location</Label><Input id="role-location" value={newRole.location} onChange={(e) => setNewRole({ ...newRole, location: e.target.value })} /></div>
                  <div className="flex flex-col gap-2"><Label htmlFor="role-salary">Salary</Label><Input id="role-salary" value={newRole.salary} onChange={(e) => setNewRole({ ...newRole, salary: e.target.value })} /></div>
                </div>
                <div className="flex flex-col gap-2"><Label htmlFor="role-description">Description</Label><textarea id="role-description" value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Describe the role" /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2"><Label htmlFor="role-requirements">Requirements</Label><textarea id="role-requirements" value={newRole.requirements} onChange={(e) => setNewRole({ ...newRole, requirements: e.target.value })} className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="One requirement per line" /></div>
                  <div className="flex flex-col gap-2"><Label htmlFor="role-responsibilities">Responsibilities</Label><textarea id="role-responsibilities" value={newRole.responsibilities} onChange={(e) => setNewRole({ ...newRole, responsibilities: e.target.value })} className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="One responsibility per line" /></div>
                </div>
                <Button type="submit" className="self-start"><Plus className="mr-2 h-4 w-4" /> Create open role</Button>
              </form>
              {openRoles.length > 0 && <div className="mt-6 flex flex-col gap-3"><h3 className="font-medium">Created open roles</h3>{openRoles.map((role) => <div key={role.id} className="flex items-center justify-between rounded-lg border p-3"><span>{role.title}</span><Button type="button" variant="ghost" size="sm" onClick={() => { deleteOpenRole(role.id); setOpenRoles(getOpenRoles()); toast.success('Role deleted') }}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button></div>)}</div>}
            </CardContent>
          </Card>

          {/* Admin List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Current Admins
              </CardTitle>
              <CardDescription>
                {admins.length} user{admins.length !== 1 ? 's' : ''} with admin access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {admins.map((admin) => {
                  const isSuper = admin.toLowerCase() === SUPER_ADMIN.toLowerCase()
                  return (
                    <div
                      key={admin}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isSuper ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                          {isSuper ? (
                            <Crown className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Shield className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{admin}</p>
                          {isSuper && (
                            <Badge variant="secondary" className="mt-1 bg-amber-500/10 text-amber-600">
                              Super Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!isSuper && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                          onClick={() => handleRemoveAdmin(admin)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
