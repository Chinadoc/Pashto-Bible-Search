import ClientHome from '../ClientHome';

export const dynamic = 'force-dynamic';

export default function LexiconPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <ClientHome />
      </div>
    </div>
  );
}

