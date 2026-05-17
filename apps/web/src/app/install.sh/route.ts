import { NextResponse } from "next/server";

// Redirect to the public CLI repo's install script
const INSTALL_URL = "https://raw.githubusercontent.com/adhyaay-karnwal/cli/main/install.sh";

export async function GET() {
	return NextResponse.redirect(INSTALL_URL, 302);
}
