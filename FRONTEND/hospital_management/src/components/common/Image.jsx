import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { getEntityImage } from '../../utils/imageUtils';

/**
 * A responsive image component with loading state and fallback
 * @param {Object} props - Component props
 * @param {string} [props.src] - Image source URL
 * @param {string} [props.alt] - Alt text for the image
 * @param {string} [props.entityType] - Type of entity (hospital, doctor, etc.)
 * @param {string} [props.entityId] - Unique ID for consistent image selection
 * @param {number} [props.width] - Image width
 * @param {number} [props.height] - Image height
 * @param {string} [props.className] - Additional CSS class
 * @param {Object} [props.style] - Additional inline styles
 * @param {boolean} [props.contain] - Whether to use 'contain' instead of 'cover' for object-fit
 * @returns {JSX.Element} Image component
 */
const Image = ({
  src,
  alt = '',
  entityType,
  entityId,
  width = '100%',
  height = 'auto',
  className = '',
  style = {},
  contain = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use provided src or generate a placeholder based on entity type
  const imageSrc = src || (entityType ? getEntityImage(entityType, entityId) : '');

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Skeleton 
        variant="rectangular" 
        width={width} 
        height={height} 
        animation="wave"
        sx={{ 
          display: 'inline-block',
          ...style 
        }}
      />
    );
  }

  // Show fallback if there's an error
  if (hasError || !imageSrc) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          color: 'text.secondary',
          ...style,
        }}
        className={`image-placeholder ${className}`}
      >
        {alt || 'Image not available'}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageSrc}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      sx={{
        width,
        height,
        objectFit: contain ? 'contain' : 'cover',
        display: 'block',
        ...style,
      }}
      className={`responsive-image ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

export default Image;
