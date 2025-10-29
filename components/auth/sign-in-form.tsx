"use client";
import Link from "next/link";
import Image from "next/image";
import Socials from "./socials";
import { useState } from "react";
import { formimg } from "@/public";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { ClerkAPIError } from "@clerk/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, TloginFormData } from "@/schemas";
import { AtSign, Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [clerkError, setClerkError] = useState("");
	const router = useRouter();
	const { isLoaded, signIn, setActive } = useSignIn();

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TloginFormData>({
		resolver: zodResolver(loginFormSchema),
	});

	const onSubmit = async (data: TloginFormData) => {
		if (!isLoaded) return;
		setClerkError("");

		try {
			const result = await signIn.create({
				identifier: data.email,
				password: data.password,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				router.push("/admin/dashboard");
			} else {
				setClerkError("Sign in incomplete. Try again.");
			}
		} catch (err) {
			const error = err as ClerkAPIError;
			const message = error.message ?? "Failed to register.";
			setClerkError(message);
		}
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
						alt="Login form image"
						className="w-full h-full object-cover rounded-lg"
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-4">
							<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat">
								Log In
							</h1>
							<div className="flex items-center gap-2">
								<p className="text-sm text-[#ADABB8] font-normal montserrat">
									Don&apos;t have an account?
								</p>
								<Link
									href="/sign-up"
									className="text-sm text-[#9887c9] underline hover:text-[#b09ce6] montserrat">
									Register
								</Link>
							</div>
						</div>
						{clerkError && (
							<p className="text-red-500 text-sm text-center montserrat">
								{clerkError}
							</p>
						)}
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-5">
							<div className="flex flex-col gap-2">
								<div
									className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 ${
										errors.email
											? "border-red-500 border"
											: "focus-within:border-[#3920BA]"
									}`}>
									<AtSign className="text-[#6D6980] mr-3" />
									<input
										type="email"
										{...register("email")}
										placeholder="Email"
										className="bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none w-full montserrat"
									/>
								</div>
								{errors.email && (
									<span className="text-red-500 text-sm montserrat">
										{errors.email.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<div
									className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 ${
										errors.password
											? "border-red-500 border"
											: "focus-within:border-[#3920BA]"
									}`}>
									<Lock className="text-[#6D6980] mr-3" />
									<input
										type={showPassword ? "text" : "password"}
										{...register("password")}
										placeholder="Enter your password"
										className="bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none w-full montserrat"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((prev) => !prev)}
										className="ml-2">
										{showPassword ? (
											<EyeOff className="text-[#6D6980]" />
										) : (
											<Eye className="text-[#6D6980]" />
										)}
									</button>
								</div>
								{errors.password && (
									<span className="text-red-500 text-sm montserrat">
										{errors.password.message}
									</span>
								)}
							</div>
							<div className="w-full flex justify-end mt-2">
								<Link
									href="/reset-password"
									className="text-sm text-[#ADABB8] font-normal cursor-pointer">
									Forgot password?
								</Link>
							</div>
							<button
								type="submit"
								className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat disabled:opacity-70"
								disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 className="animate-spin mx-auto" />
								) : (
									"Log In"
								)}
							</button>
						</form>
						<Socials />
					</div>
				</div>
			</div>
		</motion.div>
	);
}
