// Utility functions for handling images in the application

// Base URL for placeholder images (can be replaced with your own image URLs)
const PLACEHOLDER_BASE_URL = 'https://source.unsplash.com/random/300x200/?'

// Image categories with search terms for placeholder images
const IMAGE_CATEGORIES = {
  HOSPITAL: 'hospital-building',
  DOCTOR: 'doctor-portrait',
  PATIENT: 'happy-person',
  MEDICINE: 'medicine-pills',
  EQUIPMENT: 'medical-equipment',
  PHARMACY: 'pharmacy-shelves',
  AMBULANCE: 'ambulance-vehicle',
  NURSE: 'nurse-portrait',
  RECEPTION: 'hospital-reception',
  LAB: 'medical-laboratory'
}

/**
 * Get a placeholder image URL based on category
 * @param {string} category - One of the IMAGE_CATEGORIES values
 * @param {number} width - Image width in pixels (default: 300)
 * @param {number} height - Image height in pixels (default: 200)
 * @param {string} id - Optional unique identifier to get consistent images
 * @returns {string} Image URL
 */
export const getPlaceholderImage = (category, width = 300, height = 200, id = '') => {
  const searchTerm = IMAGE_CATEGORIES[category] || 'medical';
  return `${PLACEHOLDER_BASE_URL}${searchTerm}${id ? `-${id}` : ''}&w=${width}&h=${height}&fit=crop`;
};

/**
 * Get a random image for a specific entity type
 * @param {string} entityType - Type of entity (hospital, doctor, patient, etc.)
 * @param {string} id - Unique identifier for consistent random selection
 * @returns {string} Image URL
 */
export const getEntityImage = (entityType, id = '') => {
  const categories = {
    hospital: IMAGE_CATEGORIES.HOSPITAL,
    doctor: IMAGE_CATEGORIES.DOCTOR,
    patient: IMAGE_CATEGORIES.PATIENT,
    medicine: IMAGE_CATEGORIES.MEDICINE,
    equipment: IMAGE_CATEGORIES.EQUIPMENT,
    pharmacy: IMAGE_CATEGORIES.PHARMACY,
    nurse: IMAGE_CATEGORIES.NURSE,
    default: 'medical'
  };

  const searchTerm = categories[entityType.toLowerCase()] || categories.default;
  return getPlaceholderImage(searchTerm, 400, 300, id);
};

export default {
  getPlaceholderImage,
  getEntityImage,
  IMAGE_CATEGORIES
};
