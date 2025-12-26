import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea, 
  CardMedia, 
  Grid, 
  Container,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const HospitalList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sample hospital data - replace with your actual hospital data
  const hospitals = [
    {
      id: 1,
      name: 'Labaid Hospital',
      description: 'Labaid is one of the largest and most recognized private healthcare brands in Bangladesh. Known for its pioneering works in setting-up the first super-specialty Cardiac hospital in the country, Labaid is also widely acknowledged for bringing high quality diagnostic and specialized consultation facilities under a single roof through its now ubiquitous centers in all corners of Bangladesh',
      image: '/hospital1.jpg',
      doctorListUrl: 'https://labaid.com.bd/en/doctors',
      appointmentUrl: 'https://appointment.labaid.com.bd/',
      location: ' House- 01, Road-04, Dhanmondi, Dhaka 1205, Bangladesh.',

    },
    {
      id: 2,
      name: 'Popular hospital',
      description: 'The most prestigious concern of popular group, the popular Medical College started its journey in the year 2010 and by the grace of Almighty Allah it is now able to boast about a sound infrastructure and an enviable faculty. The dedicated workforce with their committed adherence to quality and uncompromising perfection has been the root of this success.',
      image: '/hospital2.jpg',
      doctorListUrl: 'https://www.popular-hospital.com/package',
      appointmentUrl: 'https://www.popular-hospital.com/contact-us',
      location: 'House: 08, Road: 02, Dhanmondi, Dhaka-1205, Bangladesh',
     
    },
    {
      id: 3,
      name: 'Square Hospitals',
      description: 'Clinical excellence must be the priority for any health care service provider. SQUARE Hospital ensures the best healthcare service comprise of professional (clinical) service excellence with outstanding personal service.',
      image: '/hospital3.jpg',
      doctorListUrl: 'https://www.squarehospital.com/doctors',
      appointmentUrl: 'https://www.squarehospital.com/doctors',
      location: '18/F, Bir Qazi Nuruzzaman Sarak,West Panthapath,Dhaka 1205,10616',
      
    },
    {
      id: 4,
      name: 'Evercare hospital',
      description: 'Evercare Hospital Bangladesh is renowned for its topnotch patient care, combining advanced medical technology with compassionate service. Our highly skilled, internationally trained medical professionals provide expert care across various specialties, ensuring patients receive advanced and comprehensive care under one roof and transforming healthcare in Bangladesh. At our hospital, we offer cutting-edge tertiary and quaternary services, including critical care, laparoscopic surgery, bone marrow transplants, and knee replacements. Our multidisciplinary teams work seamlessly to deliver precise and personalized care, ensuring that each patient receives the most effective solutions. Whether you’re in need of urgent critical care or advanced surgical procedures, our commitment to excellence means you'
      image: '/hospital4.jpg',
      doctorListUrl: 'https://www.evercarebd.com/en/dhaka/doctors/all',
      appointmentUrl: 'https://www.evercarebd.com/en/dhaka/appointment',
      location: 'Evercare Hospital Dhaka, Plot # 81, Block-E, Bashundhara R/A, Dhaka 1229, Bangladesh.',
      
    },
    {
      id: 5,
      name: 'BRB Hospital',
      description: 'BRB Hospitals Limited is an International Standard Corporate Hospital with the facilities of ‘Center of Excellence’. The Center of Excellences are Gastro Liver Center, Mother & Child Care Center, Brain & Spine Center, Nephrology & Urology Center, Bone & Joint Center, Dental Center and other Ultra-modern ancillary & specialized services supported by Internal Medicine, Hepato-Biliary-Pancreatic-Surgery, Medical Oncology, Cardiology, Respiratory Medicine, Endocrinology & Diabetology, General & Laparoscopic Surgery, Colorectal Surgery, Breast Surgery, Hematology/Transfusion Medicine, ENT Head & Neck Surgery, Burn and Plastic & Reconstructive Surgery, Physiotherapy & Rehabilitation, Dermatology, Physical Medicine and Laboratory Medicine',
      image: '/hospital5.jpg',
      doctorListUrl: 'https://brbhospital.com/doctors',
      appointmentUrl: 'https://brbhospital.com/book-appointment',
      location: ' 77 Panthapath, Dhaka 1215',
      
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Our Network of Hospitals
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Select a hospital to view doctors or book an appointment
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {hospitals.map((hospital) => (
          <Grid item xs={12} sm={6} md={4} key={hospital.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
              elevation={3}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%', // 16:9 aspect ratio
                  position: 'relative',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }}
                >
                  <LocalHospitalIcon sx={{ fontSize: 60 }} />
                </Box>
              </CardMedia>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {hospital.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {hospital.description}
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.primary">
                    Location: {hospital.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Specialties: {hospital.specialties.join(', ')}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexDirection: isMobile ? 'column' : 'row',
                    mt: 'auto',
                    pt: 2
                  }}
                >
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth={isMobile}
                    component="a"
                    href={hospital.doctorListUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Doctors
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth={isMobile}
                    component="a"
                    href={hospital.appointmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Appointment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Can't find your preferred hospital? Contact us for more options.
        </Typography>
      </Box>
    </Container>
  );
};

export default HospitalList;
