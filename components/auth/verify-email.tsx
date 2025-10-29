"use client";
import Image from "next/image";
import { formimg } from "@/public";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TverifyEmailProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailVerifySchema, TemailVerifyFormData } from "@/schemas";

export default function VerifyEmail({ email }: TverifyEmailProps) {
	const router = useRouter();
	const inputRefs = useRef<HTMLInputElement[]>([]);
	const { isLoaded, signUp, setActive } = useSignUp();
	const [clerkError, setClerkError] = useState("");
	const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<TemailVerifyFormData>({
		resolver: zodResolver(emailVerifySchema),
		defaultValues: { code: "" },
	});

	const handleChange = (idx: number, value: string) => {
		if (/^\d?$/.test(value)) {
			const newDigits = [...codeDigits];
			newDigits[idx] = value;
			setCodeDigits(newDigits);
			setValue("code", newDigits.join(""), { shouldValidate: true });

			if (value && idx < 5) inputRefs.current[idx + 1]?.focus();
		}
	};

	const handleKeyDown = (
		idx: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !codeDigits[idx] && idx > 0) {
			inputRefs.current[idx - 1]?.focus();
		}
	};

	const onSubmit = async (data: TemailVerifyFormData) => {
		if (!isLoaded) return;
		setClerkError("");

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code: data.code,
			});

			if (completeSignUp.status === "complete") {
				await setActive({ session: completeSignUp.createdSessionId });
				router.push("/admin/dashboard");
			} else {
				setClerkError("Verification incomplete. Please try again.");
			}
		} catch (err) {
			console.error("Verification error:", err);
			setClerkError("Invalid verification code.");
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
						alt="Verification form image"
						className="w-full h-full object-cover rounded-xl"
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-2">
							<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat">
								Verify Your Email
							</h1>
							<p className="text-[#ADABB8] text-sm montserrat">
								A 6-digit verification code has been sent to {email}.
							</p>
						</div>
						{clerkError && (
							<p className="text-red-500 text-sm text-center montserrat">
								{clerkError}
							</p>
						)}
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="w-full flex flex-col gap-8">
							<input
								type="hidden"
								{...register("code")}
							/>

							<div className="w-full flex gap-3">
								{codeDigits.map((digit, idx) => (
									<input
										key={idx}
										type="text"
										inputMode="numeric"
										maxLength={1}
										value={digit}
										onChange={(e) => handleChange(idx, e.target.value)}
										onKeyDown={(e) => handleKeyDown(idx, e)}
										ref={(ref) => {
											if (ref) {
												inputRefs.current[idx] = ref;
											}
										}}
										className="w-full h-16 text-center text-white text-2xl rounded-lg bg-[#23213a] border border-[#726c8e] placeholder:text-[#726c8e] montserrat outline-none focus:border-[#3920BA] focus:ring-1"
										placeholder="-"
										autoFocus={idx === 0}
									/>
								))}
							</div>
							{errors.code && (
								<span className="text-red-500 text-sm montserrat">
									{errors.code.message}
								</span>
							)}
							<button
								type="submit"
								className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat disabled:opacity-70"
								disabled={isSubmitting || codeDigits.some((d) => !d)}>
								{isSubmitting ? (
									<Loader2 className="animate-spin mx-auto" />
								) : (
									"Verify Code"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
