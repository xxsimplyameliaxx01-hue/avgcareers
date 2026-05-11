'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Job } from '@/lib/jobs-data'
import { addApplication } from '@/lib/applications-store'
import { addSubmittedApplication } from '@/lib/admin-store'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ApplicationDialogProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ApplicationDialog({ job, open, onOpenChange, onSuccess }: ApplicationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Account Details
    robloxUsername: '',
    discordUsername: '',
    // Experience
    previousExperience: '',
    hoursPerWeek: '',
    // Personal Questions
    whyThisRole: '',
    whyAvioGroup: '',
    strengths: '',
    scenario: '',
    availability: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send to Discord webhook via API route
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: job.title,
          formData: {
            robloxUsername: formData.robloxUsername,
            discordUsername: formData.discordUsername,
            experience: formData.previousExperience,
            hoursPerWeek: formData.hoursPerWeek,
            whyRole: formData.whyThisRole,
            whyAvioGroup: formData.whyAvioGroup,
            whatMakesYouFit: formData.strengths,
            difficultSituation: formData.scenario,
            availability: formData.availability,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      // Save to user's applications (for their tracking)
      addApplication({
        jobId: job.id,
        jobTitle: job.title,
        department: job.department,
        status: 'pending',
      })

      // Save to admin store (for admin review)
      addSubmittedApplication({
        jobTitle: job.title,
        robloxUsername: formData.robloxUsername,
        discordUsername: formData.discordUsername,
        experience: formData.previousExperience,
        hoursPerWeek: formData.hoursPerWeek,
        whyRole: formData.whyThisRole,
        whyAvioGroup: formData.whyAvioGroup,
        whatMakesYouFit: formData.strengths,
        difficultSituation: formData.scenario,
        availability: formData.availability,
      })

      onOpenChange(false)
      onSuccess()
      
      toast.success('Application Submitted!', {
        description: `Your application for ${job.title} has been received. We'll be in touch soon.`,
      })
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }

    // Reset form
    setFormData({
      robloxUsername: '',
      discordUsername: '',
      previousExperience: '',
      hoursPerWeek: '',
      whyThisRole: '',
      whyAvioGroup: '',
      strengths: '',
      scenario: '',
      availability: '',
    })
    setStep(1)
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const isStep1Valid = formData.robloxUsername && formData.discordUsername
  const isStep2Valid = formData.previousExperience && formData.hoursPerWeek
  const isStep3Valid = formData.whyThisRole && formData.whyAvioGroup && formData.strengths && formData.availability

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Step {step} of 3 - {step === 1 ? 'Account Details' : step === 2 ? 'Experience' : 'About You'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Account Details */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="robloxUsername">Roblox Username *</Label>
                <Input
                  id="robloxUsername"
                  required
                  value={formData.robloxUsername}
                  onChange={(e) => setFormData({ ...formData, robloxUsername: e.target.value })}
                  placeholder="Your Roblox username"
                />
                <p className="text-xs text-muted-foreground">
                  Make sure this is your exact Roblox username so we can contact you.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discordUsername">Discord Username *</Label>
                <Input
                  id="discordUsername"
                  required
                  value={formData.discordUsername}
                  onChange={(e) => setFormData({ ...formData, discordUsername: e.target.value })}
                  placeholder="username or username#0000"
                />
                <p className="text-xs text-muted-foreground">
                  We&apos;ll reach out to you on Discord regarding your application.
                </p>
              </div>
            </>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="previousExperience">Previous Experience *</Label>
                <Textarea
                  id="previousExperience"
                  required
                  value={formData.previousExperience}
                  onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                  placeholder={`Tell us about any previous experience you have that's relevant to the ${job.title} role. This can include other Roblox groups, communities, or similar positions.`}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hoursPerWeek">How many hours per week can you commit? *</Label>
                <Select
                  value={formData.hoursPerWeek}
                  onValueChange={(value) => setFormData({ ...formData, hoursPerWeek: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 hours</SelectItem>
                    <SelectItem value="5-10">5-10 hours</SelectItem>
                    <SelectItem value="10-15">10-15 hours</SelectItem>
                    <SelectItem value="15-20">15-20 hours</SelectItem>
                    <SelectItem value="20+">20+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 3: Personal Questions */}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="whyThisRole">Why do you want this role? *</Label>
                <Textarea
                  id="whyThisRole"
                  required
                  value={formData.whyThisRole}
                  onChange={(e) => setFormData({ ...formData, whyThisRole: e.target.value })}
                  placeholder={`Tell us why you're interested in the ${job.title} position and what attracts you to this type of role.`}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whyAvioGroup">Why do you want to join avio group? *</Label>
                <Textarea
                  id="whyAvioGroup"
                  required
                  value={formData.whyAvioGroup}
                  onChange={(e) => setFormData({ ...formData, whyAvioGroup: e.target.value })}
                  placeholder="What appeals to you about avio group? What do you know about us and our community?"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strengths">What makes you the right fit for this role? *</Label>
                <Textarea
                  id="strengths"
                  required
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  placeholder="Describe your key strengths and qualities that make you suitable for this position. What skills or traits do you bring to the team?"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scenario">How would you handle a difficult passenger or situation?</Label>
                <Textarea
                  id="scenario"
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  placeholder="Describe how you would handle a challenging scenario, such as an unruly passenger or a stressful situation during operations."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">When are you available to start? *</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="this-week">This week</SelectItem>
                    <SelectItem value="next-week">Next week</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex justify-between gap-3 pt-4 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !isStep3Valid}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
