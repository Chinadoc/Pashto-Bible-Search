import ClientHome from '../ClientHome';

export const dynamic = 'force-dynamic';

export default function ChaptersPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="search-shell">
        <ClientHome initialTab="bible" />
      </div>
    </div>
  );
}
