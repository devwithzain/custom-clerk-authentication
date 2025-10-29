"use client";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, LogOut } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Account() {
	const { signOut, session } = useClerk();
	const { isLoaded, user } = useUser();
	const [email, setEmail] = useState("");
	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [sessions, setSessions] = useState<any[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isPasswordSaving, setIsPasswordSaving] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// Load user info
	useEffect(() => {
		if (isLoaded && user) {
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
			setEmail(user.primaryEmailAddress?.emailAddress || "");
			user.getSessions().then(setSessions).catch(console.error);
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
			await user.update({ firstName, lastName });
			toast.success("✅ Profile updated successfully");
		} catch (err) {
			console.error(err);
			toast.error("❌ Failed to update profile");
		} finally {
			setIsSaving(false);
		}
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const imagePreview = URL.createObjectURL(file);
		setPreviewUrl(imagePreview);

		try {
			await user.setProfileImage({ file });
			toast.success("✅ Profile image updated");
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("❌ Failed to update image");
		}
	};

	// ---------- PASSWORD UPDATE ----------
	const handlePasswordUpdate = async () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error("Please fill in all password fields.");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match.");
			return;
		}

		setIsPasswordSaving(true);
		try {
			await user.updatePassword({ currentPassword, newPassword });
			toast.success("Password updated successfully ✅");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err: any) {
			console.error(err);
			toast.error(err?.errors?.[0]?.message || "Failed to update password ❌");
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
			toast.success("Account deleted. Logging out...");
			window.location.href = "/";
		} catch (error) {
			console.error(error);
			toast.error("❌ Failed to delete account");
		} finally {
			setIsDeleting(false);
		}
	};

	// ---------- JSX ----------
	return (
		<div className="px-5 pb-10">
			<h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

			<Tabs
				defaultValue="profile"
				className="w-full max-w-3xl">
				<TabsList className="grid grid-cols-4 mb-6 w-full max-w-lg">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="password">Password</TabsTrigger>
					<TabsTrigger value="devices">Devices</TabsTrigger>
					<TabsTrigger value="danger">Danger Zone</TabsTrigger>
				</TabsList>

				{/* ---------- PROFILE TAB ---------- */}
				<TabsContent value="profile">
					<section className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
						<Avatar className="h-24 w-24 rounded-full border">
							<AvatarImage
								src={previewUrl || user.imageUrl}
								alt={user.username || "User"}
							/>
						</Avatar>
					</section>

					<section className="max-w-lg flex flex-col gap-5 py-2">
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
							<Label htmlFor="picture">Profile Picture</Label>
							<Input
								id="picture"
								type="file"
							/>
						</div>

						<Button
							onClick={handleSave}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Changes
						</Button>
					</section>
				</TabsContent>

				{/* ---------- PASSWORD TAB ---------- */}
				<TabsContent value="password">
					<section className="max-w-lg flex flex-col gap-5 py-2">
						<h2 className="text-2xl font-semibold mb-5">Change Password</h2>

						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="currentPassword">Current Password</Label>
								<Input
									id="currentPassword"
									type="password"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="newPassword">New Password</Label>
								<Input
									id="newPassword"
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
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
				</TabsContent>

				{/* ---------- DEVICES TAB ---------- */}
				<TabsContent value="devices">
					<section className="max-w-2xl pt-2">
						<h2 className="text-2xl font-semibold mb-5">Active Devices</h2>

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
										onClick={async () => await signOut(session.id)}>
										<LogOut className="h-4 w-4 mr-1" />
										Log Out
									</Button>
								</div>
							))}
						</div>
					</section>
				</TabsContent>

				{/* ---------- DANGER ZONE TAB ---------- */}
				<TabsContent value="danger">
					<section className="pt-2 max-w-lg">
						<h2 className="text-2xl font-semibold mb-2 text-red-600">
							Delete Account
						</h2>
						<p className="text-sm text-gray-500 mb-4">
							Permanently delete your account and all data. This action cannot
							be undone.
						</p>
						<Button
							variant="destructive"
							onClick={handleDeleteAccount}
							disabled={isDeleting}>
							{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							<Trash2 className="mr-2 h-4 w-4" /> Delete My Account
						</Button>
					</section>
				</TabsContent>
			</Tabs>
		</div>
	);
}
