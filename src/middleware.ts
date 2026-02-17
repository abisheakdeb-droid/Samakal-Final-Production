export { default } from "@/lib/network/proxy";

export const config = {
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - uploads (locally uploaded files)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
