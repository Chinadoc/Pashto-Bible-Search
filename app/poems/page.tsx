import ClientHome from '../ClientHome';

export const dynamic = 'force-dynamic';

export default function PoemsPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="search-shell">
        <ClientHome initialTab="poems" />
      </div>
    </div>
  );
}
