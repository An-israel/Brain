import { NextResponse, type NextRequest } from 'next/server'

// Auth temporarily disabled — app is accessible directly
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
