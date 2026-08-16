import { NextRequest, NextResponse } from 'next/server'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1503473709992902838/qXm8UtWVT89uSnZB-1dfcuGqfpIsIakiM78RkU-0KUfTqQqFxcwWJerLbdI9C3sb8QVj'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      applicantDiscord, 
      applicantRoblox,
      jobTitle, 
      decision, 
      reviewedBy,
      reviewNote 
    } = body

    const isAccepted = decision === 'accepted'
    const color = isAccepted ? 0x22c55e : 0xef4444 // Green for accepted, red for denied

    const embed = {
      title: isAccepted ? '✅ Application Accepted' : '❌ Application Denied',
      color: color,
      fields: [
        {
          name: 'Position',
          value: jobTitle,
          inline: true,
        },
        {
          name: 'Applicant',
          value: `Discord: ${applicantDiscord}\nRoblox: ${applicantRoblox}`,
          inline: true,
        },
        {
          name: 'Reviewed By',
          value: reviewedBy,
          inline: true,
        },
        ...(reviewNote ? [{
          name: 'Note',
          value: reviewNote,
          inline: false,
        }] : []),
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'avio group Careers',
      },
    }

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send Discord notification')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending decision notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
