export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Flexible'
  salary: string
  posted: string
  description: string
  requirements: string[]
  responsibilities: string[]
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  department: string
  appliedDate: string
  status: 'pending' | 'reviewing' | 'interview' | 'offer' | 'rejected'
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Cabin Crew',
    department: 'Flight Operations',
    location: 'England',
    type: 'Flexible',
    salary: 'Competitive',
    posted: '1 week ago',
    description: 'Join our cabin crew team and deliver exceptional service to passengers while ensuring their safety and comfort throughout their journey. As a Cabin Crew member, you will be the face of avio group, creating memorable experiences for travellers.',
    requirements: [
      'Minimum age of 13 years',
      'Height between 5\'2" and 6\'2"',
      'Ability to swim at least 25 metres unaided',
      'Fluent in English with excellent communication skills to B2 CEFR Standards',
      'Valid passport with unrestricted travel rights',
      'Flexible availability including weekends and holidays',
      'Customer service experience preferred'
    ],
    responsibilities: [
      'Ensure passenger safety and comfort throughout flights',
      'Conduct pre-flight safety checks and demonstrations',
      'Serve food, beverages, and duty-free products',
      'Handle emergency situations calmly and professionally',
      'Provide first aid assistance when required',
      'Maintain cabin cleanliness and presentation standards'
    ]
  },
  {
    id: '2',
    title: 'First Officer',
    department: 'Flight Operations',
    location: 'England',
    type: 'Flexible',
    salary: 'Competitive',
    posted: '1 week ago',
    description: 'We are seeking qualified First Officers to join our flight deck team. As a First Officer, you will work alongside experienced Captains to ensure safe and efficient flight operations while building your aviation career with avio group.',
    requirements: [
      'Past experience preferred',
      'Current Class 1 Medical Certificate',
      'Right to live and work in the UK',
      'Strong CRM and communication skills',
      'Type rating preferred but not essential'
    ],
    responsibilities: [
      'Assist the Captain in all aspects of flight operations',
      'Conduct pre-flight planning and weather briefings',
      'Operate aircraft systems and navigation equipment',
      'Communicate with air traffic control',
      'Complete accurate flight documentation',
      'Maintain situational awareness throughout flights'
    ]
  },
  {
    id: '3',
    title: 'Ramp Agent',
    department: 'Ground Operations',
    location: 'England',
    type: 'Flexible',
    salary: 'Competitive',
    posted: '1 week ago',
    description: 'Join our ground handling team as a Ramp Agent. You will play a vital role in ensuring aircraft are serviced efficiently and safely between flights, contributing to on-time departures and the overall passenger experience.',
    requirements: [
      'Minimum age of 13 years',
      'Ability to pass airside security clearance',
      'Physically fit to lift heavy items (up to 32kg)',
      'Flexible availability for shift work',
      'Able to work outdoors in all weather conditions',
      'Previous ramp or warehouse experience preferred'
    ],
    responsibilities: [
      'Load and unload passenger baggage and cargo',
      'Marshal and guide aircraft on the apron',
      'Operate ground support equipment safely',
      'Assist with aircraft pushback and towing',
      'Perform de-icing operations when required',
      'Maintain compliance with health and safety regulations'
    ]
  },
  {
    id: '4',
    title: 'Terminal Agent',
    department: 'Passenger Services',
    location: 'England',
    type: 'Flexible',
    salary: 'Competitive',
    posted: '1 week ago',
    description: 'As a Terminal Agent, you will be the first point of contact for our passengers. You will provide exceptional customer service at check-in, boarding gates, and throughout the terminal to ensure a smooth and pleasant travel experience.',
    requirements: [
      'Minimum age of 13 years',
      'Excellent customer service and communication skills',
      'Ability to pass airside security clearance',
      'Proficient in computer systems and technology',
      'Fluent in English to B2 CEFR Standard; additional languages advantageous ',
      'Flexible availability including early mornings and late evenings',
      'Previous customer-facing experience preferred'
    ],
    responsibilities: [
      'Check in passengers and process baggage',
      'Assist passengers with special requirements',
      'Manage boarding gates and departure processes',
      'Handle flight disruptions and rebooking',
      'Provide information and resolve passenger queries',
      'Ensure compliance with airline and security procedures'
    ]
  }
]

export function getJobById(id: string): Job | undefined {
  return jobs.find(job => job.id === id)
}

export function getJobsByDepartment(department: string): Job[] {
  return jobs.filter(job => job.department === department)
}

export const departments = [...new Set(jobs.map(job => job.department))]
export const locations = [...new Set(jobs.map(job => job.location))]
export const types = [...new Set(jobs.map(job => job.type))]
