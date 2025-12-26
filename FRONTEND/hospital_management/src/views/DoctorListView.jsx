import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    TextField, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Typography, 
    InputAdornment,
    Card, 
    CardContent, 
    CardMedia, 
    CircularProgress, 
    Button,
    Paper,
    Chip,
    useTheme,
    useMediaQuery,
    Select,
    Grid
} from '@mui/material';
import { 
    LocalHospital, 
    Search, 
    Clear, 
    Star, 
    Refresh as RefreshIcon, 
    Home, 
    NavigateNext, 
    MedicalServices, 
    Work, 
    Phone, 
    Email, 
    LocationOn 
} from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHospital } from '../contexts/HospitalContext';
import { People as PeopleIcon } from '@mui/icons-material';
import Image from '../components/common/Image';
import axios from 'axios';

const DoctorList = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { hospitals, selectedHospital, selectHospital } = useHospital();
    
    // Get hospitalId from URL if present
    const params = new URLSearchParams(location.search);
    const hospitalIdFromUrl = params.get('hospital');
    
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [stats, setStats] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0
    });

    // Set hospital from URL if provided
    useEffect(() => {
        const setHospitalFromUrl = async () => {
            if (hospitalIdFromUrl && hospitalIdFromUrl !== selectedHospital?._id) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/hospitals/${hospitalIdFromUrl}`);
                    if (response.data.success) {
                        selectHospital(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching hospital:', error);
                }
            }
        };
        setHospitalFromUrl();
    }, [hospitalIdFromUrl, selectHospital]);

    // Fetch doctors with pagination and filters
    const fetchDoctors = useCallback(async () => {
        const targetHospitalId = hospitalIdFromUrl || selectedHospital?._id;
        if (!targetHospitalId) return;
        
        try {
            setLoading(true);
            const { page, limit } = pagination;
            const params = new URLSearchParams({
                page,
                limit,
                hospital: targetHospitalId,
                ...(selectedDepartment && { department: selectedDepartment }),
                ...(searchTerm && { search: searchTerm })
            });

            const response = await axios.get(`http://localhost:5000/api/doctors?${params}`);
            
            if (response.data.success) {
                setDoctors(response.data.data.doctors);
                setFilteredDoctors(response.data.data.doctors);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.data.total
                }));
                setError(null);
            } else {
                throw new Error(response.data.message || 'Failed to fetch doctors');
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setError(error.response?.data?.message || error.message || 'Failed to load doctors');
        } finally {
            setLoading(false);
        }
    }, [selectedHospital, hospitalIdFromUrl, pagination.page, pagination.limit, selectedDepartment, searchTerm]);

    // Fetch statistics for the selected hospital
    const fetchStats = useCallback(async () => {
        const targetHospitalId = hospitalIdFromUrl || selectedHospital?._id;
        if (!targetHospitalId) return;
        
        try {
            const response = await axios.get(`http://localhost:5000/api/doctors/stats?hospital=${targetHospitalId}`);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, [selectedHospital]);

    // Refetch data when filters or hospital changes
    useEffect(() => {
        fetchDoctors();
        fetchStats();
    }, [fetchDoctors, fetchStats]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDoctors();
        }, 500);
        
        return () => clearTimeout(timer);
    }, [searchTerm, fetchDoctors]);

    // Handle department filter change
    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get image URL with fallback
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-doctor.png';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000/uploads/doctors/${imagePath}`;
    };

    // Get unique departments for filter
    const getDepartments = () => {
        if (!stats?.departments) return [];
        return stats.departments.map(dept => dept._id);
    };

    // Loading state
    if (loading && doctors.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Box textAlign="center">
                    <CircularProgress />
                    <Typography variant="body1" mt={2}>
                        Loading doctors...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box textAlign="center" p={4}>
                <Typography color="error" variant="h6" gutterBottom>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={fetchDoctors}
                    startIcon={<RefreshIcon />}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    // Show hospital selection if no specific hospital is selected
    if (!selectedHospital) {
        return (
            <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 } }}>
                <Typography variant="h4" sx={{ mb: 4 }}>Available Hospitals</Typography>
                <Grid container spacing={3}>
                    {hospitals.map((hospital) => (
                        <Grid item xs={12} sm={6} md={4} key={hospital._id}>
                            <Card 
                                elevation={2} 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: 4,
                                        transform: 'translateY(-4px)',
                                        transition: 'all 0.3s ease-in-out'
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={hospital.imageUrl || '/default-hospital.jpg'}
                                    alt={hospital.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {hospital.name}
                                    </Typography>
                                    {hospital.specialties && hospital.specialties.length > 0 && (
                                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {hospital.specialties.slice(0, 3).map((specialty, index) => (
                                                <Chip 
                                                    key={index} 
                                                    label={specialty} 
                                                    size="small" 
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {hospital.address}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button 
                                        variant="contained" 
                                        size="small" 
                                        href={hospital.doctorsUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        disabled={!hospital.doctorsUrl}
                                        startIcon={<PeopleIcon />}
                                    >
                                        View Doctors
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    const breadcrumbs = [
        {
            label: 'Home',
            icon: <Home />,
            onClick: () => navigate('/'),
            isActive: false
        },
        {
            label: selectedHospital.name,
            icon: <LocalHospital />,
            onClick: () => navigate(`/hospitals/${selectedHospital._id}`),
            isActive: false
        },
        {
            label: 'Doctors',
            icon: null,
            onClick: null,
            isActive: true
        }
    ];

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 } }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={index}>
                            <Button
                                startIcon={breadcrumb.icon}
                                onClick={breadcrumb.onClick}
                                disabled={breadcrumb.isActive}
                                sx={{
                                    textTransform: 'none',
                                    color: breadcrumb.isActive ? 'text.primary' : 'primary.main',
                                    fontWeight: breadcrumb.isActive ? 'bold' : 'normal',
                                    minWidth: 'auto',
                                    p: 0,
                                    '&:hover': { backgroundColor: 'transparent' }
                                }}
                            >
                                {breadcrumb.label}
                            </Button>
                            {index < breadcrumbs.length - 1 && (
                                <NavigateNext color="action" sx={{ mx: 0.5 }} />
                            )}
                        </React.Fragment>
                    ))}
                </Box>
                
                {selectedHospital && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocalHospital color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h5" component="h1">
                            {selectedHospital.name} - Doctors
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 'auto' }}
                            onClick={() => navigate(`/book-appointment?hospital=${selectedHospital._id}`)}
                        >
                            Book Appointment
                        </Button>
                    </Box>
                )}
                <Typography variant="subtitle1" color="textSecondary">
                    {selectedHospital.name} - {stats?.totalDoctors || '0'} Doctors Available
                </Typography>
            </Box>

            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="primary">
                                {stats.totalDoctors}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total Doctors
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="primary">
                                {stats.departments?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Departments
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Star color="warning" />
                                <Typography variant="h5" sx={{ ml: 1 }}>
                                    {stats.averageRating?.toFixed(1) || 'N/A'}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                Average Rating
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Search and Filter Section */}
            <Box 
                component="form" 
                sx={{ 
                    mb: 4, 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                }}
                noValidate 
                autoComplete="off"
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search doctors by name, specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            searchTerm ? (
                                <InputAdornment position="end">
                                    <Clear 
                                        onClick={() => setSearchTerm('')} 
                                        sx={{ cursor: 'pointer' }}
                                    />
                                </InputAdornment>
                            ) : null
                        ),
                        sx: { borderRadius: 2 }
                    }}
                />
                
                <FormControl 
                    variant="outlined" 
                    sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}
                >
                    <InputLabel id="department-filter-label">Department</InputLabel>
                    <Select
                        labelId="department-filter-label"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        label="Department"
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="">
                            <em>All Departments</em>
                        </MenuItem>
                        {getDepartments().map((dept) => (
                            <MenuItem key={dept} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Results Count */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="textSecondary">
                    Showing {filteredDoctors.length} of {pagination.total} doctors
                </Typography>
                <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                        setSearchTerm('');
                        setSelectedDepartment('');
                    }}
                    startIcon={<Clear />}
                >
                    Clear Filters
                </Button>
            </Box>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        No doctors found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Try adjusting your search or filters
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredDoctors.map((doctor, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={doctor._id}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[6]
                                    },
                                    overflow: 'hidden'
                                }}
                                elevation={3}
                            >
                                <Box sx={{ 
                                    position: 'relative',
                                    height: 220,
                                    overflow: 'hidden'
                                }}>
                                    <Image 
                                        entityType="doctor"
                                        entityId={doctor._id || index}
                                        alt={doctor.doctorName || 'Doctor'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        backdropFilter: 'blur(4px)'
                                    }}>
                                        <Star sx={{ color: '#FFD700', mr: 0.5, fontSize: 16 }} />
                                        <Typography variant="body2" fontWeight="500">
                                            {doctor.rating?.toFixed(1) || 'N/R'}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <CardContent sx={{ 
                                    flexGrow: 1,
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 'calc(100% - 220px)'
                                }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography 
                                            variant="h6" 
                                            component="h3" 
                                            sx={{ 
                                                fontWeight: 600,
                                                mb: 0.5,
                                                color: 'text.primary',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {doctor.doctorName}
                                        </Typography>
                                        
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                color: 'primary.main',
                                                fontWeight: 500,
                                                mb: 1.5
                                            }}
                                        >
                                            {doctor.specialization || 'General Practitioner'}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Work 
                                                fontSize="small" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    mr: 1,
                                                    fontSize: '1rem'
                                                }} 
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {doctor.experience || '0'}+ years experience
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <LocalHospital 
                                                fontSize="small" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    mr: 1,
                                                    fontSize: '1rem'
                                                }} 
                                            />
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {doctor.hospitalName || 'Hospital not specified'}
                                            </Typography>
                                        </Box>
                                        
                                        {doctor.availability && (
                                            <Chip 
                                                label={doctor.availability}
                                                size="small"
                                                color={doctor.availability === 'Available Today' ? 'success' : 'default'}
                                                variant="outlined"
                                                sx={{ 
                                                    mb: 2,
                                                    '& .MuiChip-label': { 
                                                        px: 1,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 500
                                                    }
                                                }}
                                            />
                                        )}
                                    </Box>
                                    
                                    <Box sx={{ mt: 'auto' }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Button 
                                                    fullWidth 
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => navigate(`/doctors/${doctor._id}`)}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        py: 1,
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    View Profile
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button 
                                                    fullWidth 
                                                    variant="contained" 
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => navigate(`/book-appointment?doctor=${doctor._id}`)}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        py: 1,
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                        boxShadow: 'none',
                                                        '&:hover': {
                                                            boxShadow: theme.shadows[2]
                                                        }
                                                    }}
                                                >
                                                    Book Now
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        
                                        <Box sx={{ 
                                            mt: 1.5, 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            '& > *': {
                                                flex: 1,
                                                textAlign: 'center',
                                                '&:not(:last-child)': {
                                                    borderRight: '1px solid',
                                                    borderColor: 'divider'
                                                }
                                            }
                                        }}>
                                            <Tooltip title="Call Doctor" arrow>
                                                <IconButton 
                                                    size="small"
                                                    color="primary"
                                                    component="a"
                                                    href={`tel:${doctor.phone || ''}`}
                                                    disabled={!doctor.phone}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        '&:hover': {
                                                            color: 'primary.main',
                                                            backgroundColor: 'action.hover'
                                                        }
                                                    }}
                                                >
                                                    <Phone fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Message" arrow>
                                                <IconButton 
                                                    size="small"
                                                    color="primary"
                                                    component="a"
                                                    href={`mailto:${doctor.email || ''}`}
                                                    disabled={!doctor.email}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        '&:hover': {
                                                            color: 'primary.main',
                                                            backgroundColor: 'action.hover'
                                                        }
                                                    }}
                                                >
                                                    <Email fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View Location" arrow>
                                                <IconButton 
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        // Handle view location
                                                        if (doctor.hospitalLocation) {
                                                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.hospitalLocation)}`, '_blank');
                                                        }
                                                    }}
                                                    disabled={!doctor.hospitalLocation}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        '&:hover': {
                                                            color: 'primary.main',
                                                            backgroundColor: 'action.hover'
                                                        }
                                                    }}
                                                >
                                                    <LocationOn fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        color="primary"
                                        component="a"
                                        href={`/book-appointment?doctor=${doctor._id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle book appointment navigation
                                            console.log('Book appointment with', doctor._id);
                                        }}
                                    >
                                        Book Appointment
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            
            {/* Pagination */}
            {pagination.total > pagination.limit && (
                <Box display="flex" justifyContent="center" mt={4} mb={6}>
                    <Box display="flex" gap={1}>
                        {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={pagination.page === page ? "contained" : "outlined"}
                                onClick={() => handlePageChange(page)}
                                sx={{ minWidth: 36, height: 36 }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default DoctorList;
