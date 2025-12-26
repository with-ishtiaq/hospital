import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const specialties = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Ophthalmology',
  'Psychiatry',
  'Urology'
];

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    experience: 12,
    rating: 4.8,
    reviews: 245,
    location: 'Downtown Medical Center',
    languages: ['English', 'Spanish'],
    image: '/path/to/doctor1.jpg'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    experience: 8,
    rating: 4.9,
    reviews: 189,
    location: 'City General Hospital',
    languages: ['English', 'Mandarin'],
    image: '/path/to/doctor2.jpg'
  },
  {
    id: 3,
    name: 'Dr. Emily Wilson',
    specialty: 'Pediatrics',
    experience: 15,
    rating: 4.7,
    reviews: 312,
    location: 'Children\'s Hospital',
    languages: ['English', 'French'],
    image: '/path/to/doctor3.jpg'
  },
  {
    id: 4,
    name: 'Dr. Robert Taylor',
    specialty: 'Orthopedics',
    experience: 18,
    rating: 4.9,
    reviews: 276,
    location: 'Sports Medicine Center',
    languages: ['English', 'Spanish'],
    image: '/path/to/doctor4.jpg'
  }
];

const FindDoctorsTab = () => {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleBookAppointment = (doctorId) => {
    // In a real app, this would navigate to a booking page
    console.log(`Booking appointment with doctor ${doctorId}`);
    // For now, show an alert
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      alert(`Booking appointment with ${doctor.name}. This would open a booking form in a real application.`);
    }
  };
  
  const handleViewProfile = (doctorId) => {
    // In a real app, this would navigate to the doctor's profile
    console.log(`Viewing profile of doctor ${doctorId}`);
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      alert(`Viewing profile of ${doctor.name}. This would open the doctor's profile page in a real application.`);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !specialty || doctor.specialty === specialty;
    const matchesLocation = !location || doctor.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <Box>
      {/* Search and Filters */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search doctors, specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="specialty-label">Specialty</InputLabel>
              <Select
                labelId="specialty-label"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                label="Specialty"
              >
                <MenuItem value="">
                  <em>All Specialties</em>
                </MenuItem>
                {specialties.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ height: '56px' }}
            >
              Filters
            </Button>
          </Grid>
        </Grid>

        {showFilters && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Advanced Filters</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Experience</InputLabel>
                  <Select value="" label="Experience">
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1-5">1-5 years</MenuItem>
                    <MenuItem value="5-10">5-10 years</MenuItem>
                    <MenuItem value="10+">10+ years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Rating</InputLabel>
                  <Select value="" label="Rating">
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="4+">4.0+</MenuItem>
                    <MenuItem value="4.5+">4.5+</MenuItem>
                    <MenuItem value="4.8+">4.8+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select value="" label="Language">
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="spanish">Spanish</MenuItem>
                    <MenuItem value="french">French</MenuItem>
                    <MenuItem value="mandarin">Mandarin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      {/* Results */}
      <Typography variant="h6" gutterBottom>
        {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
      </Typography>

      <Grid container spacing={3} columns={{ xs: 1, sm: 2, md: 3 }}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={1} key={doctor.id}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={2}>
                    <Box display="flex" justifyContent="center">
                      <Avatar 
                        src={doctor.image} 
                        alt={doctor.name}
                        sx={{ 
                          width: 120, 
                          height: 120,
                          border: '2px solid #e0e0e0'
                        }}
                      >
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" component="div">
                      {doctor.name}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                      <WorkIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialty}
                      </Typography>
                      <Box mx={1}>•</Box>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.experience} years experience
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.location}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <StarIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
                        {doctor.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({doctor.reviews} reviews)
                      </Typography>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {doctor.languages.map((lang) => (
                        <Chip 
                          key={lang}
                          icon={<LanguageIcon fontSize="small" />}
                          label={lang}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      sx={{ mb: 1, py: 1.5 }}
                      onClick={() => handleBookAppointment(doctor.id)}
                    >
                      Book Appointment
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      fullWidth
                      sx={{ py: 1.5 }}
                      onClick={() => handleViewProfile(doctor.id)}
                    >
                      View Profile
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FindDoctorsTab;
