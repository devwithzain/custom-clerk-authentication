"use client";
import Image from "next/image";
import { formimg } from "@/public";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Loader2 } from "lucide-react";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, TresetPasswordFormData } from "@/schemas";

export default function ResetPasswordForm() {
	const router = useRouter();
	const { isSignedIn } = useAuth();
	const [clerkError, setClerkError] = useState("");
	const { isLoaded, signIn, setActive } = useSignIn();
	const [secondFactor, setSecondFactor] = useState(false);
	const [step, setStep] = useState<"email" | "password">("email");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<TresetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
	});

	useEffect(() => {
		if (isSignedIn) router.push("/");
	}, [isSignedIn, router]);

	if (!isLoaded) return null;

	const handleSendCode = async (data: TresetPasswordFormData) => {
		setClerkError("");

		try {
			await signIn.create({
				strategy: "reset_password_email_code",
				identifier: data.emailAddress,
			});

			setStep("password");
			reset({ emailAddress: data.emailAddress });
		} catch (err: any) {
			console.error(err);
			setClerkError(
				err?.errors?.[0]?.longMessage ?? "Failed to send reset code.",
			);
		}
	};

	/** Step 2: Attempt reset with code + new password */
	const handleResetPassword = async (data: TresetPasswordFormData) => {
		setClerkError("");

		try {
			const result = await signIn.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code: data.code,
				password: data.password,
			});

			if (result.status === "needs_second_factor") {
				setSecondFactor(true);
				setClerkError("");
			} else if (result.status === "complete") {
				await setActive({
					session: result.createdSessionId,
					navigate: async ({ session }) => {
						if (session?.currentTask) {
							console.log(session.currentTask);
							return;
						}
						router.push("/sign-in");
					},
				});
			} else {
				console.log(result);
			}
		} catch (err: any) {
			console.error(err);
			setClerkError(
				err?.errors?.[0]?.longMessage ?? "Failed to reset password.",
			);
		}
	};

	const onSubmit = async (data: TresetPasswordFormData) => {
		if (step === "email") await handleSendCode(data);
		else if (step === "password") await handleResetPassword(data);
	};

	return (
		<motion.div
			initial={{ y: "115%" }}
			animate={{ y: "0%" }}
			transition={{ duration: 1, ease: "easeInOut" }}
			className="w-[60%] bg-[#04031b] rounded-xl py-5 h-[80vh] relative">
			<div className="w-full h-full flex justify-between items-center">
				<div className="w-1/2 h-full pointer-events-none pl-5">
					<Image
						src={formimg}
						alt="Reset form image"
						className="w-full h-full object-cover rounded-lg"
					/>
				</div>

				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-4">
							<h1 className="text-white subHeading font-bold">
								{step === "email" ? "Forgot Password" : "Reset Password"}
							</h1>
							<p className="text-sm text-[#ADABB8]">
								{step === "email"
									? "Enter your email to receive a verification code."
									: "Enter the verification code sent to your email and your new password."}
							</p>
						</div>

						{clerkError && (
							<p className="text-red-500 text-sm text-center montserrat">
								{clerkError}
							</p>
						)}

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-5">
							{step === "email" && (
								<div className="flex flex-col gap-2">
									<div className="w-full flex items-center bg-[#3c375269] rounded-lg p-4">
										<AtSign className="text-[#6D6980] mr-3" />
										<input
											type="email"
											{...register("emailAddress")}
											placeholder="Email"
											className="bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none w-full montserrat"
										/>
									</div>
									{errors.emailAddress && (
										<span className="text-red-500 text-sm montserrat">
											{errors.emailAddress.message}
										</span>
									)}
								</div>
							)}

							{step === "password" && (
								<>
									<div className="flex flex-col gap-2">
										<input
											type="text"
											{...register("code")}
											placeholder="Enter verification code"
											className="bg-[#3c375269] p-4 rounded-lg text-white placeholder:text-[#6D6980] outline-none focus:border-[#3920BA] focus:ring-1"
										/>
										{errors.code && (
											<span className="text-red-500 text-sm">
												{errors.code.message}
											</span>
										)}
									</div>

									<div className="flex flex-col gap-2">
										<input
											type="password"
											{...register("password")}
											placeholder="Enter new password"
											className="bg-[#3c375269] p-4 rounded-lg text-white placeholder:text-[#6D6980] outline-none focus:border-[#3920BA] focus:ring-1"
										/>
										{errors.password && (
											<span className="text-red-500 text-sm">
												{errors.password.message}
											</span>
										)}
									</div>
								</>
							)}

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer disabled:opacity-70">
								{isSubmitting ? (
									<Loader2 className="animate-spin mx-auto" />
								) : step === "email" ? (
									"Send Code"
								) : (
									"Reset Password"
								)}
							</button>
						</form>

						{secondFactor && (
							<p className="text-yellow-400 text-center">
								2FA is required, but this UI does not handle that.
							</p>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
