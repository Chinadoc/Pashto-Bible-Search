import ClientHome from '../ClientHome';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <div className="app-shell text-gray-100">
      <div className="card-surface mx-auto w-full max-w-6xl px-4 sm:px-8 py-6 sm:py-8">
        <ClientHome />
      </div>
    </div>
  );
}
