import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test the connection by checking auth
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      connected: true,
      hasSession: !!session,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
