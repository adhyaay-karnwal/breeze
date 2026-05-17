export function matchSessionWsPath(pathname: string): { sessionId: string } | null {
	const match = pathname.match(/^\/breeze\/([^/]+)\/?$/);
	if (!match) return null;
	return { sessionId: match[1] };
}
