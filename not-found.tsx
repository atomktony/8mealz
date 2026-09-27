import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="h-display text-3xl text-brand-deep">Page not found</h1>
      <Link href="/" className="btn-red mt-6">Back to home</Link>
    </div>
  );
}
