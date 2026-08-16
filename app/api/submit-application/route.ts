import { NextRequest, NextResponse } from 'next/server'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1503473709992902838/qXm8UtWVT89uSnZB-1dfcuGqfpIsIakiM78RkU-0KUfTqQqFxcwWJerLbdI9C3sb8QVj'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobTitle, formData } = body

    const embed = {
      title: `New Application: ${jobTitle}`,
      color: 0x0a2540,
      fields: [
        {
          name: 'Roblox Username',
          value: formData.robloxUsername || 'Not provided',
          inline: true
        },
        {
          name: 'Discord Username',
          value: formData.discordUsername || 'Not provided',
          inline: true
        },
        {
          name: 'Previous Experience',
          value: formData.experience || 'Not provided',
          inline: false
        },
        {
          name: 'Why are you the ideal candidate for the role?',
          value: formData.whyRole || 'Not provided',
          inline: false
        },
        {
          name: 'What qualities align with the role?',
          value: formData.whatMakesYouFit || 'Not provided',
          inline: false
        },
        {
          name: 'Why are you the ideal fit for avio group?',
          value: formData.whyAvioGroup || 'Not provided',
          inline: false
        },
        {
          name: 'How would you handle a difficult situation?',
          value: formData.difficultSituation || 'Not provided',
          inline: false
        },
        {
          name: 'Availability to Start',
          value: formData.availability || 'Not provided',
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'avio group Careers'
      }
    }

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    })

    if (!discordResponse.ok) {
      console.error('Discord webhook failed:', await discordResponse.text())
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
