import ClientHome from '../ClientHome';

export const dynamic = 'force-dynamic';

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="search-shell">
        <ClientHome initialTab="videos" />
      </div>
    </div>
  );
}
