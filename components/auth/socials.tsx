"use client";
import { useSignIn } from "@clerk/nextjs";
import { FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa";

export default function Socials() {
	const { signIn, isLoaded } = useSignIn();

	const handleSocialLogin = async (
		provider: "oauth_google" | "oauth_github" | "oauth_microsoft",
	) => {
		if (!isLoaded) return;

		try {
			await signIn.authenticateWithRedirect({
				strategy: provider,
				redirectUrl: "/sso-callback",
				redirectUrlComplete: "/dashboard",
			});
		} catch (err) {
			console.error("Social login error:", err);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center gap-4">
				<span className="w-full h-0.5 bg-[#6D6980]/30 rounded-lg" />
				<p className="text-[#6D6980] text-sm min-w-fit">Or continue with</p>
				<span className="w-full h-0.5 bg-[#6D6980]/30 rounded-lg" />
			</div>
			<div className="flex items-center justify-between gap-5">
				<button
					onClick={() => handleSocialLogin("oauth_google")}
					className="w-full flex items-center gap-2 justify-center bg-[#3c375269] text-[#6D6980] text-lg tracking-tight leading-tight rounded-lg p-4 hover:bg-[#4B4561] transition">
					<FaGoogle
						className="text-[#6D6980]"
						size={22}
					/>
					Google
				</button>

				<button
					onClick={() => handleSocialLogin("oauth_microsoft")}
					className="w-full flex items-center gap-2 justify-center bg-[#3c375269] text-[#6D6980] text-lg tracking-tight leading-tight rounded-lg p-4 hover:bg-[#4B4561] transition">
					<FaMicrosoft
						className="text-[#6D6980]"
						size={22}
					/>
					Microsoft
				</button>

				<button
					onClick={() => handleSocialLogin("oauth_github")}
					className="w-full flex items-center gap-2 justify-center bg-[#3c375269] text-[#6D6980] text-lg tracking-tight leading-tight rounded-lg p-4 hover:bg-[#4B4561] transition">
					<FaGithub
						className="text-[#6D6980]"
						size={22}
					/>
					GitHub
				</button>
			</div>
		</div>
	);
}
