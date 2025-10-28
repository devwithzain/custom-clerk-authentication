"use client";
import Link from "next/link";
import Image from "next/image";
import Socials from "./socials";
import { useState } from "react";
import { formimg } from "@/public";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { TregisterFormProps } from "@/types";
import type { ClerkAPIError } from "@clerk/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, TregisterFormData } from "@/schemas";
import { AtSign, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";

export default function SignupForm({
	onVerificationStart,
}: TregisterFormProps) {
	const { isLoaded, signUp } = useSignUp();
	const [clerkError, setClerkError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<TregisterFormData>({
		resolver: zodResolver(registerFormSchema),
	});

	const onSubmit = async (data: TregisterFormData) => {
		if (!isLoaded) return;
		setClerkError("");

		try {
			await signUp.create({
				firstName: data.firstName,
				lastName: data.lastName,
				emailAddress: data.emailAddress,
				password: data.password,
			});

			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
			onVerificationStart(data.emailAddress);
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
			className="w-[60%] h-[80vh] bg-[#04031b] rounded-xl py-5 relative">
			<div className="w-full h-full flex justify-between items-center pl-5">
				<div className="w-1/2 h-full pointer-events-none">
					<Image
						src={formimg}
						alt="Signup form image"
						className="w-full h-full object-cover rounded-xl"
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-2">
							<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat">
								Create an Account
							</h1>
							<div className="flex items-center gap-2">
								<p className="text-sm text-[#ADABB8]">
									Already have an account?
								</p>
								<Link
									href="/sign-in"
									className="text-sm text-[#9887c9] underline hover:text-[#b09ce6]">
									Log In
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
							<div className="w-full flex items-center gap-2 justify-between">
								<div className="flex flex-col gap-2">
									<div
										className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 ${
											errors.firstName
												? "border-red-500 border"
												: "focus-within:border-[#3920BA]"
										}`}>
										<User className="text-[#6D6980] mr-3" />
										<input
											type="text"
											{...register("firstName")}
											placeholder="First Name"
											className="bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none w-full montserrat"
										/>
									</div>
									{errors.firstName && (
										<span className="text-red-500 text-sm montserrat">
											{errors.firstName.message}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-2">
									<div
										className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 ${
											errors.lastName
												? "border-red-500 border"
												: "focus-within:border-[#3920BA]"
										}`}>
										<User className="text-[#6D6980] mr-3" />
										<input
											type="text"
											{...register("lastName")}
											placeholder="Last Name"
											className="bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none w-full montserrat"
										/>
									</div>
									{errors.lastName && (
										<span className="text-red-500 text-sm montserrat">
											{errors.lastName.message}
										</span>
									)}
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<div
									className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 ${
										errors.emailAddress
											? "border-red-500 border"
											: "focus-within:border-[#3920BA]"
									}`}>
									<AtSign className="text-[#6D6980] mr-3" />
									<input
										type="emailAddress"
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
							<button
								type="submit"
								className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center tracking-tight cursor-pointer montserrat disabled:opacity-70"
								disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 className="animate-spin mx-auto" />
								) : (
									"Register"
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
