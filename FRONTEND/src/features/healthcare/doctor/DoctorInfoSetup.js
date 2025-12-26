import React, { useState } from 'react';
import { MapPin, BookOpen, Award } from 'lucide-react';

const specializations = [
  'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology',
  'Ophthalmology', 'Gynecology', 'Urology', 'Psychiatry', 'Dentistry',
  'General Medicine', 'General Surgery', 'ENT', 'Radiology', 'Anesthesiology'
];

const DoctorInfoSetup = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    specialization: '',
    licenseNumber: '',
    experience: '',
    bio: '',
    consultationFee: '',
    languages: ['English']
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;
    let updatedLanguages = [...formData.languages];
    
    if (checked) {
      updatedLanguages.push(value);
    } else {
      updatedLanguages = updatedLanguages.filter(lang => lang !== value);
    }
    
    setFormData(prevState => ({
      ...prevState,
      languages: updatedLanguages
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.specialization) newErrors.specialization = 'Required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'Required';
    if (!formData.experience) newErrors.experience = 'Required';
    else if (isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = 'Invalid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && onComplete) onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Doctor Information
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please provide your professional details
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.specialization ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                required
              >
                <option value="">Select specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your license number"
                required
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 border ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Years of experience"
                required
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee ($)
              </label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter consultation fee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell us about your professional background and expertise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-4">
                {['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Arabic'].map((language) => (
                  <label key={language} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={language}
                      checked={formData.languages.includes(language)}
                      onChange={handleLanguageChange}
                      className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700">{language}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoSetup;
