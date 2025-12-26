import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Link,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

const pharmacyStores = [
  {
    id: 'LAZZ PHERMA',
    name: 'LAZZ PHERMA',
    baseUrl: 'https://www.lazzpharma.com/',
    // Removed external logo URL to avoid failed network requests
  
  },
  {
    id: 'AROGGO',
    name: 'AROGGO',
    baseUrl: 'https://www.arogga.com/category/medicine/6322/medicine',
    // Removed external logo URL to avoid failed network requests
   
  },
  {
    id: 'OSHUDHPTRO',
    name: 'OSHUDHPTRO',
    baseUrl: 'https://osudpotro.com/',
    // Removed external logo URL to avoid failed network requests

  },
  {
    id: 'MEDEASY',
    name: 'MEDEASY',
    baseUrl: 'https://medeasy.health/',
    // Removed external logo URL to avoid failed network requests

  },
  {
    id: 'MEDEX',
    name: 'MEDEX',
    baseUrl: 'https://medex.com.bd/',
    // Removed external logo URL to avoid failed network requests
    
  }
];

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Open the selected pharmacy in a new tab
    const selectedPharmacy = pharmacyStores[activeTab];
    const searchUrl = `${selectedPharmacy.baseUrl}${encodeURIComponent(searchTerm)}`;
    window.open(searchUrl, '_blank');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <LocalPharmacyIcon sx={{ mr: 1 }} />
        Medicine Search
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!searchTerm.trim() || isSearching}
                  sx={{ ml: 1 }}
                >
                  {isSearching ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              ),
            }}
          />
        </form>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mt: 3 }}
        >
          {pharmacyStores.map((pharmacy, index) => (
            <Tab 
              key={pharmacy.id} 
              label={pharmacy.name} 
              iconPosition="start"
              sx={{ textTransform: 'none', minWidth: 'auto' }}
            />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Search on {pharmacyStores[activeTab].name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {pharmacyStores[activeTab].description}
        </Typography>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSearch}
            disabled={!searchTerm.trim()}
            startIcon={<SearchIcon />}
            sx={{ mt: 2 }}
          >
            Search on {pharmacyStores[activeTab].name}
          </Button>
          
          <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
            Clicking search will open {pharmacyStores[activeTab].name} in a new tab with your search results
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box>
        <Typography variant="h6" gutterBottom>
          Available Pharmacy Stores
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {pharmacyStores.map((pharmacy) => (
            <Grid item xs={12} sm={6} md={4} key={pharmacy.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalPharmacyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">{pharmacy.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {pharmacy.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    component="a"
                    href={pharmacy.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit {pharmacy.name}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MedicineSearch;
