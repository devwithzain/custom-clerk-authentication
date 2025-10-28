"use client";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, LogOut } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function Account() {
	const { isLoaded, user } = useUser();
	const [email, setEmail] = useState("");
	const [lastName, setLastName] = useState("");
	const [sessions, setSessions] = useState([]);
	const [firstName, setFirstName] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [isPasswordSaving, setIsPasswordSaving] = useState(false);

	useEffect(() => {
		if (isLoaded && user) {
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
			setEmail(user.primaryEmailAddress?.emailAddress || "");
			user
				.getSessions()
				.then((s) => setSessions(s))
				.catch(console.error);
		}
	}, [isLoaded, user]);

	if (!isLoaded || !user) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<Loader2 className="animate-spin h-6 w-6 text-gray-400" />
			</div>
		);
	}

	// ---------- PROFILE UPDATE ----------
	const handleSave = async () => {
		setIsSaving(true);
		try {
			await user.update({
				firstName,
				lastName,
			});
			toast("✅ Profile updated successfully");
		} catch (err) {
			console.error(err);
			toast("❌ Failed to update profile");
		} finally {
			setIsSaving(false);
		}
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			await user.setProfileImage({ file });
			toast("✅ Profile image updated");
		} catch (error) {
			console.error("Error uploading image:", error);
			toast("❌ Failed to update image");
		}
	};

	// ---------- PASSWORD UPDATE ----------
	const handlePasswordUpdate = async () => {
		if (!user) return;
		if (!currentPassword || !newPassword || !confirmPassword) {
			toast("Please fill in all password fields.");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast("New passwords do not match.");
			return;
		}

		setIsPasswordSaving(true);
		try {
			// Clerk verifies old password before allowing update
			await user.updatePassword({
				currentPassword,
				newPassword,
			});
			toast("Password updated successfully ✅");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err: any) {
			console.error(err);
			toast(err?.errors?.[0]?.message || "Failed to update password ❌");
		} finally {
			setIsPasswordSaving(false);
		}
	};

	// ---------- DELETE ACCOUNT ----------
	const handleDeleteAccount = async () => {
		if (
			!confirm("⚠️ Are you sure you want to permanently delete your account?")
		)
			return;
		setIsDeleting(true);
		try {
			await user.delete();
			toast("Account deleted. Logging out...");
			window.location.href = "/";
		} catch (error) {
			console.error(error);
			toast("❌ Failed to delete account");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="px-5 pb-10">
			<h1 className="text-2xl font-semibold mb-8">Account Settings</h1>

			{/* ---------- PROFILE SECTION ---------- */}
			<section className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
				<Avatar className="h-24 w-24 rounded-full">
					<AvatarImage
						src={user.imageUrl}
						alt={user.username || "User"}
					/>
				</Avatar>
			</section>
			{/* ---------- PROFILE INFO FORM ---------- */}
			<section className="max-w-lg flex flex-col gap-5 py-5">
				<div className="grid gap-2">
					<Label htmlFor="firstName">First Name</Label>
					<Input
						id="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="lastName">Last Name</Label>
					<Input
						id="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="email">Email Address</Label>
					<Input
						id="email"
						value={email}
						disabled
					/>
				</div>
				<div className="grid gap-2">
					<Label
						htmlFor="photo"
						className="text-sm font-medium text-black">
						Profile Photo
					</Label>
					<div className="relative border rounded-md">
						<input
							type="file"
							id="photo"
							accept="image/*"
							onChange={handleImageChange}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
						/>
						<div className="flex items-center justify-between bg-[#FAFAFA] text-white pl-2 rounded-lg cursor-pointer border border-transparent hover:border-[#3920BA] transition">
							<span className="text-[#6D6980] text-sm">
								Choose a profile photo
							</span>
							<span className="bg-[#3920BA] text-white text-xs p-2.5 rounded-md">
								Browse
							</span>
						</div>
					</div>
				</div>
				<div>
					<Button
						onClick={handleSave}
						disabled={isSaving}>
						{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Changes
					</Button>
				</div>
			</section>

			{/* ---------- PASSWORD UPDATE SECTION ---------- */}
			<section className="border-t pt-8 max-w-lg">
				<h2 className="text-2xl font-semibold mb-8">Change Password</h2>

				<div className="grid gap-4">
					{/* Current Password */}
					<div className="grid gap-2">
						<Label htmlFor="currentPassword">Current Password</Label>
						<Input
							id="currentPassword"
							type="password"
							placeholder="Enter current password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
					</div>

					{/* New Password */}
					<div className="grid gap-2">
						<Label htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							type="password"
							placeholder="Enter new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>

					{/* Confirm Password */}
					<div className="grid gap-2">
						<Label htmlFor="confirmPassword">Confirm New Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder="Confirm new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>

					<Button
						onClick={handlePasswordUpdate}
						disabled={isPasswordSaving}>
						{isPasswordSaving && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Update Password
					</Button>
				</div>
			</section>

			{/* ---------- ACTIVE DEVICES SECTION ---------- */}
			<section className="border-t pt-8 max-w-2xl">
				<h2 className="text-2xl font-semibold mb-8">Active Devices</h2>
				{sessions.length === 0 && (
					<p className="text-sm text-gray-500">No active sessions</p>
				)}
				<div className="space-y-3">
					{sessions.map((session) => (
						<div
							key={session.id}
							className="flex justify-between items-center border p-3 rounded-md">
							<div>
								<p className="text-sm font-medium">
									{session.latestActivity?.browserName || "Unknown Device"}
								</p>
								<p className="text-xs text-gray-500">
									Last active{" "}
									{formatDistanceToNow(new Date(session.lastActiveAt), {
										addSuffix: true,
									})}
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => session.revoke()}>
								<LogOut className="h-4 w-4 mr-1" />
								Log Out
							</Button>
						</div>
					))}
				</div>
			</section>

			{/* ---------- DELETE ACCOUNT SECTION ---------- */}
			<section className="border-t pt-8 max-w-lg">
				<h2 className="text-2xl font-semibold mb-2 text-red-600">
					Delete Account
				</h2>
				<p className="text-sm text-gray-500 mb-4">
					Permanently delete your account and all data. This action cannot be
					undone.
				</p>
				<Button
					variant="destructive"
					onClick={handleDeleteAccount}
					disabled={isDeleting}>
					{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					<Trash2 className="mr-2 h-4 w-4" /> Delete My Account
				</Button>
			</section>
		</div>
	);
}
