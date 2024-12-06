import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Function to get the path to .env.local
const getEnvPath = () => {
  return path.join(process.cwd(), '.env.local')
}

// Function to read current env file
async function readEnvFile() {
  try {
    const envPath = getEnvPath()
    const content = await fs.readFile(envPath, 'utf-8')
    return content
  } catch (error) {
    console.error('Error reading .env.local:', error)
    return ''
  }
}

// Function to update env file
async function updateEnvFile(content: string) {
  const envPath = getEnvPath()
  await fs.writeFile(envPath, content, 'utf-8')
}

export async function GET() {
  try {
    const envContent = await readEnvFile()
    const apiKeyMatch = envContent.match(/OPENAI_API_KEY=(.*)/)
    const apiKey = apiKeyMatch ? apiKeyMatch[1] : ''

    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error('Error getting API key:', error)
    return NextResponse.json(
      { error: 'Failed to get API key' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    let envContent = await readEnvFile()
    
    // Update or add OPENAI_API_KEY
    if (envContent.includes('OPENAI_API_KEY=')) {
      envContent = envContent.replace(
        /OPENAI_API_KEY=.*/,
        `OPENAI_API_KEY=${apiKey}`
      )
    } else {
      envContent += `\nOPENAI_API_KEY=${apiKey}`
    }

    await updateEnvFile(envContent)

    return NextResponse.json({ message: 'API key updated successfully' })
  } catch (error) {
    console.error('Error updating API key:', error)
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    )
  }
}
