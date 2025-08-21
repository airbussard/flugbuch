import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')
    
    if (!username) {
      return NextResponse.json(
        { 
          available: false, 
          error: 'Username is required' 
        },
        { status: 400 }
      )
    }
    
    // Validate username format (3-30 chars, alphanumeric + underscore)
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json({
        available: false,
        error: 'Username must be 3-30 characters and contain only letters, numbers, and underscores'
      })
    }
    
    // Check reserved words
    const reservedWords = [
      'admin', 'system', 'anonymous', 'deleted', 'null', 'undefined',
      'user', 'users', 'profile', 'profiles', 'api', 'test', 'root',
      'moderator', 'mod', 'bot'
    ]
    
    if (reservedWords.includes(username.toLowerCase())) {
      return NextResponse.json({
        available: false,
        error: 'This username is reserved'
      })
    }
    
    const supabase = await createClient()
    
    // Check if username already exists (case-insensitive)
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('username')
      .ilike('username', username)
      .single()
    
    if (existingUser) {
      // Generate suggestions based on the requested username
      const suggestions = await generateUsernameSuggestions(username, supabase)
      
      return NextResponse.json({
        available: false,
        error: 'Username is already taken',
        suggestions
      })
    }
    
    return NextResponse.json({
      available: true,
      message: 'Username is available'
    })
    
  } catch (error) {
    console.error('Error checking username availability:', error)
    return NextResponse.json(
      { 
        available: false,
        error: 'Failed to check username availability' 
      },
      { status: 500 }
    )
  }
}

async function generateUsernameSuggestions(baseUsername: string, supabase: any): Promise<string[]> {
  const suggestions: string[] = []
  const maxSuggestions = 3
  
  // Try adding numbers
  for (let i = 1; i <= 99 && suggestions.length < maxSuggestions; i++) {
    const candidate = `${baseUsername}${i}`
    if (candidate.length <= 30) {
      const { data } = await supabase
        .from('user_profiles')
        .select('username')
        .ilike('username', candidate)
        .single()
      
      if (!data) {
        suggestions.push(candidate)
      }
    }
  }
  
  // Try adding underscore and numbers
  if (suggestions.length < maxSuggestions && baseUsername.length < 28) {
    for (let i = 1; i <= 99 && suggestions.length < maxSuggestions; i++) {
      const candidate = `${baseUsername}_${i}`
      if (candidate.length <= 30) {
        const { data } = await supabase
          .from('user_profiles')
          .select('username')
          .ilike('username', candidate)
          .single()
        
        if (!data) {
          suggestions.push(candidate)
        }
      }
    }
  }
  
  // Try adding common suffixes
  const suffixes = ['pilot', 'flyer', 'aviation']
  for (const suffix of suffixes) {
    if (suggestions.length >= maxSuggestions) break
    
    const candidate = `${baseUsername}_${suffix}`
    if (candidate.length <= 30) {
      const { data } = await supabase
        .from('user_profiles')
        .select('username')
        .ilike('username', candidate)
        .single()
      
      if (!data) {
        suggestions.push(candidate)
      }
    }
  }
  
  return suggestions.slice(0, maxSuggestions)
}