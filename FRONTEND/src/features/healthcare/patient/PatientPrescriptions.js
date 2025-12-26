import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'patient_prescriptions_uploads';

const PatientPrescriptions = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFiles(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const onSelectFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const mapped = selected.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploaded: false
    }));
    setFiles((prev) => [...mapped, ...prev]);
    setStatus('Ready to upload');
    if (inputRef.current) inputRef.current.value = '';
  };

  const onUpload = async () => {
    if (!files.length) return;
    setStatus('Uploading...');
    setTimeout(() => {
      setFiles((prev) => prev.map((f) => ({ ...f, uploaded: true })));
      setStatus('Uploaded successfully');
      setTimeout(() => setStatus(''), 1500);
    }, 800);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const isImage = (type) => type?.startsWith('image/');
  const isPdf = (type) => type === 'application/pdf';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Prescriptions</h3>
          <p className="mt-1 text-sm text-gray-500">Upload prescriptions (images or PDFs). They are saved locally for now.</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">Select files</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={onSelectFiles}
                className="block w-full text-sm text-gray-700"
              />
              <button
                onClick={onUpload}
                disabled={!files.length}
                className="mt-3 px-4 py-2 rounded-md text-white bg-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                Upload
              </button>
              {status && <div className="mt-2 text-sm text-gray-500">{status}</div>}
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">Uploaded files</p>
              {files.length === 0 && (
                <p className="text-sm text-gray-500">No files added yet.</p>
              )}
              <ul className="space-y-2">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between border border-gray-200 rounded-md p-2">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        {isImage(f.type) ? (
                          <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-sm text-gray-700">{isPdf(f.type) ? 'PDF' : 'FILE'}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                        <p className="text-xs text-gray-500">{(f.size/1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-semibold ${f.uploaded ? 'text-green-600' : 'text-gray-400'}`}>{f.uploaded ? 'Uploaded' : 'Pending'}</span>
                      <button onClick={() => removeFile(f.id)} className="text-sm text-red-600 hover:text-red-600">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
