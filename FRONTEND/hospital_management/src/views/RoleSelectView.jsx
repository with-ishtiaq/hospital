import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelect.css';

const RoleSelectView = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/login/${role}`);
    };

    return (
        <div className="role-select-container">
            {/* Video Background */}
            <video 
                className="video-background-role"
                autoPlay 
                muted 
                loop 
                playsInline
            >
                <source src="/ScreenRecording_07-18-2025 3-12-19 pm_1.mp4" type="video/mp4" />
                {/* Fallback image if video fails to load */}
                <img src="/download.jpg" alt="Background" />
            </video>

            {/* Dark Overlay for better text readability */}
            <div className="video-overlay-role"></div>

            <div className="logoROLE">
                <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-imageROLE" />
                <span className="logo-textROLE">MediLink</span>
            </div>

            <div className="role-flex-container">
                <div className="role-box" onClick={() => handleRoleSelect('doctor')}>
                    <img
                        src="/IMG_6945-removebg-preview.png"
                        alt="Doctor Logo"
                        className="box-logo-DoctorLogo"
                    />
                    <span><p>Doctor</p></span>
                    <button className="login-button-role">Login</button>
                </div>
                <div className="role-box" onClick={() => handleRoleSelect('patient')}>
                    <img
                        src="/IMG_6946-removebg-preview.png"
                        alt="Patient Logo"
                        className="box-logo-PatientLogo"
                    />
                    <span><p>Patient</p></span>
                    <button className="login-button-role">Login</button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectView;
