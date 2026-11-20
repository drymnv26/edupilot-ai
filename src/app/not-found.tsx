import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-ivory">
      <div className="space-y-4 text-center">
        <p className="font-display text-7xl text-blush">404</p>
        <h1 className="font-display text-3xl">Sayfa bulunamad&#305;</h1>
        <p className="text-mist">
          Arad&#305;&#287;&#305;n&#305;z sayfa ta&#351;&#305;nm&#305;&#351; ya da hi&ccedil; olmayabilir.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep"
        >
          Ana sayfaya d&ouml;n
        </Link>
      </div>
    </main>
  );
}