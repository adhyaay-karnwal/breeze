import { useAuthProviders } from "@/hooks/integrations/use-auth-providers";
import { signIn, useSession } from "@/lib/auth/client";
import { setLastAuthMethod } from "@/lib/auth/last-auth-method";
import { sanitizeRedirect } from "@/lib/auth/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useSignIn() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session, isPending } = useSession();
	const { data: authProviders } = useAuthProviders();
	const [googleLoading, setGoogleLoading] = useState(false);
	const [githubLoading, setGithubLoading] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const redirectUrl = sanitizeRedirect(searchParams.get("redirect"));
	const prefilledEmail = searchParams.get("email") || "";
	const [email, setEmail] = useState(prefilledEmail);

	const hasGoogleOAuth = authProviders?.providers.google ?? false;
	const hasGitHubOAuth = authProviders?.providers.github ?? false;

	useEffect(() => {
		if (session && !isPending) {
			router.push(redirectUrl);
		}
	}, [session, isPending, router, redirectUrl]);

	const handleGoogleSignIn = async () => {
		setGoogleLoading(true);
		setLastAuthMethod("google");
		try {
			await signIn.social({
				provider: "google",
				callbackURL: redirectUrl,
			});
		} catch {
			toast.error("Google sign in failed. Please try again.");
			setGoogleLoading(false);
		}
	};

	const handleGitHubSignIn = async () => {
		setGithubLoading(true);
		setLastAuthMethod("github");
		try {
			await signIn.social({
				provider: "github",
				callbackURL: redirectUrl,
			});
		} catch {
			toast.error("GitHub sign in failed. Please try again.");
			setGithubLoading(false);
		}
	};

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormLoading(true);
		setLastAuthMethod("email");
		try {
			const result = await signIn.email({ email, password });
			if (result.error) {
				toast.error(result.error.message || "Invalid email or password");
				setFormLoading(false);
			} else {
				router.push(redirectUrl);
			}
		} catch (err) {
			toast.error("Sign in failed. Please try again.");
			setFormLoading(false);
		}
	};

	return {
		session,
		isPending,
		email,
		setEmail,
		password,
		setPassword,
		showPassword,
		setShowPassword,
		googleLoading,
		githubLoading,
		formLoading,
		hasGoogleOAuth,
		hasGitHubOAuth,
		redirectUrl,
		handleGoogleSignIn,
		handleGitHubSignIn,
		handleEmailSignIn,
	};
}
