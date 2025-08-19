import { LexiconEntry } from '@/types';

const LexiconModal = ({ entry, onBackdropClick }: { entry: LexiconEntry; onBackdropClick: () => void }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onBackdropClick}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{entry.f_primary}</h3>
        {entry.f_secondary && <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{entry.f_secondary}</p>}
        
        <div className="space-y-2 text-gray-800 dark:text-gray-200">
          {entry.e && <p><span className="font-semibold">English:</span> {entry.e}</p>}
          {entry.gender && <p><span className="font-semibold">Gender:</span> {entry.gender}</p>}
          {entry.pos_family && <p><span className="font-semibold">Part of Speech:</span> {entry.pos_family}</p>}
          {entry.p_norm && <p><span className="font-semibold">Plural:</span> {entry.p_norm}</p>}
        </div>

        <button 
          onClick={onBackdropClick} 
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LexiconModal;
