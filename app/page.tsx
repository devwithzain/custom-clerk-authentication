import Link from "next/link";

export default function Home() {
	return (
		<div className="w-full h-screen flex items-center justify-center bg-gray-300">
			<div className="flex items-center gap-2">
				<Link
					className="text-white bg-black px-4 py-2 rounded-md font-serif font-medium text-lg"
					href="/sign-up">
					Sign Up
				</Link>
				<Link
					className="text-white bg-black px-4 py-2 rounded-md font-serif font-medium text-lg"
					href="/sign-in">
					Sign In
				</Link>
			</div>
		</div>
	);
}
