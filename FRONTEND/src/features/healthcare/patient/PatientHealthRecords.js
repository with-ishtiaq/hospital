import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'patient_health_record_v2';

// Common allergies and medical conditions for the pickers
const ALLERGY_OPTIONS = [
  'Penicillin', 'Sulfa Drugs', 'Aspirin', 'Ibuprofen', 'Codeine',
  'Latex', 'Pollen', 'Dust Mites', 'Mold', 'Pet Dander',
  'Peanuts', 'Tree Nuts', 'Shellfish', 'Eggs', 'Milk',
  'Soy', 'Wheat', 'Fish', 'Sesame', 'Sulfites'
];

const MEDICAL_HISTORY_OPTIONS = [
  'Hypertension', 'Diabetes', 'Asthma', 'Heart Disease', 'High Cholesterol',
  'Stroke', 'Cancer', 'Arthritis', 'Osteoporosis', 'Thyroid Disorders',
  'Anemia', 'Epilepsy', 'Migraines', 'Depression', 'Anxiety',
  'Sleep Apnea', 'COPD', 'Kidney Disease', 'Liver Disease', 'Rheumatoid Arthritis'
];

const PatientHealthRecords = () => {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    dob: '',
    bloodGroup: '',
    allergies: [],
    history: []
  });
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Calculate BMI whenever weight or height changes
  useEffect(() => {
    const weight = Number(form.weight);
    const heightCm = Number(form.height);
    if (Number.isFinite(weight) && weight > 0 && Number.isFinite(heightCm) && heightCm > 0) {
      const heightInMeters = heightCm / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      if (Number.isFinite(bmiValue)) {
        setBmi(Number(bmiValue.toFixed(1)));
        return;
      }
    }
    setBmi(null);
  }, [form.weight, form.height]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onMultiSelectChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleItem = (name, item) => {
    setForm(prev => ({
      ...prev,
      [name]: prev[name].includes(item)
        ? prev[name].filter(i => i !== item)
        : [...prev[name], item]
    }));
  };

  const onSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setStatus('Saved');
    setTimeout(() => setStatus(''), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Health Record</h3>
          <p className="mt-1 text-sm text-gray-500">Maintain your basic medical information.</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-sm text-gray-700 mb-2" htmlFor="age">Age</label>
              <input id="age" name="age" value={form.age} onChange={onChange} type="number" className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="form-group">
              <label className="text-sm text-gray-700 mb-2" htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={form.gender} onChange={onChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="text-sm text-gray-700 mb-2" htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                value={form.weight}
                onChange={onChange}
                type="number"
                step="0.1"
                min="0"
                inputMode="decimal"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="form-group">
              <label className="text-sm text-gray-700 mb-2" htmlFor="height">Height (cm)</label>
              <input
                id="height"
                name="height"
                value={form.height}
                onChange={onChange}
                type="number"
                step="0.1"
                min="0"
                inputMode="decimal"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="form-group">
              <label className="text-sm text-gray-700 mb-2" htmlFor="bmi">BMI (auto-calculated)</label>
              <input
                id="bmi"
                name="bmi"
                value={bmi ?? ''}
                readOnly
                type="text"
                placeholder="Enter weight + height"
                className="block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md focus:outline-none sm:text-sm"
              />
            </div>
            <div className="form-group">
              <label className="text-sm text-gray-700 mb-2" htmlFor="dob">Date of Birth</label>
              <input id="dob" name="dob" value={form.dob} onChange={onChange} type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="form-group">
              <label className="text-sm text-gray-700 mb-2" htmlFor="bloodGroup">Blood Group</label>
              <select id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={onChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group sm:col-span-2">
              <label className="text-sm text-gray-700 mb-2">Allergies</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.allergies.map(allergy => (
                    <span key={allergy} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {allergy}
                      <button
                        type="button"
                        onClick={() => toggleItem('allergies', allergy)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !form.allergies.includes(e.target.value)) {
                      onMultiSelectChange('allergies', [...form.allergies, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">Add an allergy...</option>
                  {ALLERGY_OPTIONS
                    .filter(a => !form.allergies.includes(a))
                    .map(allergy => (
                      <option key={allergy} value={allergy}>{allergy}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-group sm:col-span-2">
              <label className="text-sm text-gray-700 mb-2">Medical History</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.history.map(item => (
                    <span key={item} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item}
                      <button
                        type="button"
                        onClick={() => toggleItem('history', item)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-200 hover:bg-green-300 text-green-600 hover:text-green-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !form.history.includes(e.target.value)) {
                      onMultiSelectChange('history', [...form.history, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">Add a medical condition...</option>
                  {MEDICAL_HISTORY_OPTIONS
                    .filter(h => !form.history.includes(h))
                    .map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Health Metrics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">BMI</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {bmi ? bmi : '--'}
                </div>
                {bmi && (
                  <div className="mt-1 text-sm text-gray-500">
                    {bmi < 18.5 ? 'Underweight' : 
                     bmi < 25 ? 'Normal weight' :
                     bmi < 30 ? 'Overweight' : 'Obesity'}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Weight</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {form.weight ? `${form.weight} kg` : '--'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Height</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {form.height ? `${form.height} cm` : '--'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              {status && <span className="text-sm text-green-600">{status}</span>}
            </div>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Health Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHealthRecords;
