export function rewriteDevtoolsMcpPath(path: string): string {
	return `/_breeze/mcp${path || "/"}`;
}
