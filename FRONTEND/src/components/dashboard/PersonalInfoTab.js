import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CardMembership as CardMembershipIcon,
  CalendarToday as CalendarTodayIcon,
  ContactPhone as ContactIcon,
  Badge as BadgeIcon,
  Description as DescriptionIcon,
  CardMembership as InsuranceIcon,
  Favorite as FavoriteIcon,
  Transgender as TransgenderIcon,
  Scale as ScaleIcon,
  Height as HeightIcon,
  Fingerprint as FingerprintIcon,
  LocalHospital as LocalHospitalIcon,
  Medication as MedicationIcon
} from '@mui/icons-material';

const PersonalInfoTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: '123 Main St, City, Country',
    bloodGroup: 'A+',
    gender: 'Male',
    weight: '70 kg',
    height: '175 cm',
    hasAllergies: true,
    allergies: ['Peanuts', 'Penicillin'],
    emergencyContactName: 'John Doe',
    emergencyContactPhone: '+1 (555) 123-4567',
    emergencyContactRelation: 'Father',
    nidNumber: '1990123456789',
    currentMedications: 'Lisinopril 10mg (daily), Albuterol (as needed)',
    medicalHistory: 'Hypertension (2020), Asthma (Childhood)',
    insuranceProvider: 'HealthCare Plus',
    insuranceNumber: 'HCP987654321',
    insuranceExpiry: '2025-12-31'
  });
  const [newAllergy, setNewAllergy] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAllergy = () => {
    if (newAllergy && !formData.allergies.includes(newAllergy)) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy]
      }));
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove)
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    console.log('Saving data:', formData);
    setIsEditing(false);
  };

  const InfoRow = ({ icon, label, value, name, type = 'text', multiline = false, rows = 1 }) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {React.cloneElement(icon, { color: 'primary', sx: { mr: 1 } })}
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
      </Box>
      {isEditing ? (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          name={name}
          value={value}
          onChange={handleInputChange}
          type={type}
          multiline={multiline}
          rows={rows}
          InputProps={{
            sx: { backgroundColor: 'background.paper' }
          }}
        />
      ) : (
        <Typography variant="body1">{value || 'Not provided'}</Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">Personal Information</Typography>
        {isEditing ? (
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            Edit Information
          </Button>
        )}
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          Personal Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <InfoRow 
              icon={<HomeIcon />} 
              label="Address" 
              name="address"
              value={formData.address}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoRow 
              icon={<FavoriteIcon />} 
              label="Blood Group" 
              name="bloodGroup"
              value={formData.bloodGroup}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoRow 
              icon={<TransgenderIcon />} 
              label="Gender" 
              name="gender"
              value={formData.gender}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoRow 
              icon={<ScaleIcon />} 
              label="Weight" 
              name="weight"
              value={formData.weight}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoRow 
              icon={<HeightIcon />} 
              label="Height" 
              name="height"
              value={formData.height}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoRow 
              icon={<FingerprintIcon />} 
              label="NID Number" 
              name="nidNumber"
              value={formData.nidNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon color={formData.hasAllergies ? 'error' : 'primary'} sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  {formData.hasAllergies ? 'Allergies' : 'No Known Allergies'}
                </Typography>
              </Box>
              {isEditing && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.hasAllergies}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hasAllergies: e.target.checked,
                          allergies: !e.target.checked ? [] : prev.allergies
                        }))}
                        color="primary"
                      />
                    }
                    label="I have allergies"
                    sx={{ mb: 1 }}
                  />
                </Box>
              )}
              {formData.hasAllergies ? (
                isEditing ? (
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        size="small"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        placeholder="Add an allergy"
                        sx={{ flexGrow: 1 }}
                      />
                      <Button 
                        variant="outlined" 
                        onClick={handleAddAllergy}
                        disabled={!newAllergy}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {formData.allergies.map((allergy) => (
                        <Chip
                          key={allergy}
                          label={allergy}
                          onDelete={() => handleRemoveAllergy(allergy)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.allergies.length > 0 ? (
                      formData.allergies.map((allergy) => (
                        <Chip key={allergy} label={allergy} />
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">No allergies recorded</Typography>
                    )}
                  </Box>
                )
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <ContactIcon color="primary" sx={{ mr: 1 }} />
          Emergency Contact
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoRow 
              icon={<PersonIcon />} 
              label="Emergency Contact Name" 
              name="emergencyContactName"
              value={formData.emergencyContactName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow 
              icon={<ContactIcon />} 
              label="Emergency Contact Phone" 
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              type="tel"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <BadgeIcon color="primary" sx={{ mr: 1 }} />
          Identification
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoRow 
              icon={<BadgeIcon />} 
              label="Government ID Number" 
              name="governmentId"
              value={formData.governmentId}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
          Medical Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InfoRow 
              icon={<DescriptionIcon />} 
              label="Medical History" 
              name="medicalHistory"
              value={formData.medicalHistory}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <InfoRow 
              icon={<MedicationIcon />} 
              label="Current Medications" 
              name="currentMedications"
              value={formData.currentMedications}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <InsuranceIcon color="primary" sx={{ mr: 1 }} />
          Insurance Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoRow 
              icon={<InsuranceIcon />} 
              label="Insurance Provider" 
              name="insuranceProvider"
              value={formData.insuranceProvider}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow 
              icon={<CardMembershipIcon />} 
              label="Insurance Number" 
              name="insuranceNumber"
              value={formData.insuranceNumber}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow 
              icon={<CalendarTodayIcon />} 
              label="Insurance Expiry Date" 
              name="insuranceExpiry"
              value={formData.insuranceExpiry}
              type="date"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PersonalInfoTab;
