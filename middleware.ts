import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const response = NextResponse.next()
  
  if (pathname.startsWith('/cn/') || pathname === '/cn') {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/cn', '')
    const rewriteResponse = NextResponse.rewrite(url)
    rewriteResponse.headers.set('x-locale', 'zh')
    rewriteResponse.headers.set('x-search-params', search)
    return rewriteResponse
  }
  
  response.headers.set('x-locale', 'en')
  response.headers.set('x-search-params', search)
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}