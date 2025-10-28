"use client";
import { useState } from "react";
import SignupForm from "@/components/auth/sign-up-form";
import VerifyEmail from "@/components/auth/verify-email";

export default function Signup() {
	const [emailAddress, setEmailAddress] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);

	return (
		<div className="w-full h-screen flex items-center justify-center bg-gray-200">
			{!isVerifying ? (
				<SignupForm
					onVerificationStart={(email) => {
						setEmailAddress(email);
						setIsVerifying(true);
					}}
				/>
			) : (
				<VerifyEmail email={emailAddress} />
			)}
		</div>
	);
}
