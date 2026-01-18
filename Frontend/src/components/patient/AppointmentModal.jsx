import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/AppointmentModal.css';

export default function AppointmentModal({ isOpen, onClose, onSuccess }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        patientName: '',
        contactNumber: '',
        address: '',
        symptoms: '',
        hospital: '',
        specialist: '',
        appointmentDate: '',
        appointmentTime: '',
        attenderName: '',
        attenderContact: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const hospitals = [
        'RJ Kar Hospital',
        'Apollo Hospital',
        'Fortis Hospital',
        'AIIMS',
        'Other'
    ];

    const specialists = [
        'General Physician',
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Orthopedic',
        'Pediatrician',
        'Gynecologist',
        'Psychiatrist',
        'ENT Specialist',
        'Ophthalmologist',
        'Dentist',
        'Other'
    ];

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.patientName.trim()) {
            newErrors.patientName = 'Patient name is required';
        }

        if (!formData.contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (!validatePhone(formData.contactNumber)) {
            newErrors.contactNumber = 'Enter valid 10-digit mobile number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.symptoms.trim()) {
            newErrors.symptoms = 'Symptoms description is required';
        }

        if (!formData.hospital) {
            newErrors.hospital = 'Please select a hospital';
        }

        if (!formData.specialist) {
            newErrors.specialist = 'Please select a specialist';
        }

        if (!formData.appointmentDate) {
            newErrors.appointmentDate = 'Appointment date is required';
        }

        if (!formData.appointmentTime) {
            newErrors.appointmentTime = 'Appointment time is required';
        }

        if (formData.attenderContact && !validatePhone(formData.attenderContact)) {
            newErrors.attenderContact = 'Enter valid 10-digit mobile number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        if (!user) {
            toast.error('You must be logged in to book an appointment');
            return;
        }

        setIsLoading(true);
        setSubmitStatus(null);

        try {
            const appointmentData = {
                auth_user_id: user.id,
                patient_name: formData.patientName,
                contact_number: formData.contactNumber,
                address: formData.address,
                symptoms: formData.symptoms,
                hospital: formData.hospital,
                specialist: formData.specialist,
                attender_name: formData.attenderName || null,
                attender_contact: formData.attenderContact || null,
                status: 'pending',
                appointment_date: formData.appointmentDate,
                appointment_time: formData.appointmentTime
            };

            const { data, error } = await supabase
                .from('appointments')
                .insert([appointmentData])
                .select();

            if (error) throw error;
            
            setSubmitStatus('success');
            toast.success('Appointment booked successfully!');
            
            setTimeout(() => {
                onClose();
                resetForm();
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (error) {
            console.error('Appointment booking error:', error);
            setSubmitStatus('error');
            toast.error(error.message || 'Failed to book appointment');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            patientName: '',
            contactNumber: '',
            address: '',
            symptoms: '',
            hospital: '',
            specialist: '',
            appointmentDate: '',
            appointmentTime: '',
            attenderName: '',
            attenderContact: ''
        });
        setErrors({});
        setSubmitStatus(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const isFormValid = formData.patientName.trim() && 
                        formData.contactNumber && 
                        validatePhone(formData.contactNumber) &&
                        formData.address.trim() && 
                        formData.symptoms.trim() && 
                        formData.hospital &&
                        formData.specialist &&
                        formData.appointmentDate &&
                        formData.appointmentTime;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose} aria-label="Close modal">
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-header">
                    <i className="fas fa-calendar-plus"></i>
                    <h2>Book Appointment</h2>
                    <p>Fill in the details to schedule your appointment</p>
                </div>

                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-section">
                        <h3 className="section-title">
                            <i className="fas fa-user-injured"></i>
                            Patient Details
                        </h3>

                        <div className="form-group">
                            <label htmlFor="patientName">
                                Patient Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="patientName"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                placeholder="Enter patient full name"
                                className={errors.patientName ? 'error' : ''}
                            />
                            {errors.patientName && <span className="error-message">{errors.patientName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="contactNumber">
                                Contact Number <span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                                maxLength="10"
                                className={errors.contactNumber ? 'error' : ''}
                            />
                            {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">
                                Address <span className="required">*</span>
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter patient address"
                                rows="3"
                                className={errors.address ? 'error' : ''}
                            />
                            {errors.address && <span className="error-message">{errors.address}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="symptoms">
                                Patient Condition / Symptoms <span className="required">*</span>
                            </label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                placeholder="Briefly describe the medical condition or symptoms"
                                rows="4"
                                className={errors.symptoms ? 'error' : ''}
                            />
                            {errors.symptoms && <span className="error-message">{errors.symptoms}</span>}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">
                            <i className="fas fa-hospital"></i>
                            Hospital Selection
                        </h3>

                        <div className="form-group">
                            <label htmlFor="hospital">
                                Select Hospital <span className="required">*</span>
                            </label>
                            <select
                                id="hospital"
                                name="hospital"
                                value={formData.hospital}
                                onChange={handleChange}
                                className={errors.hospital ? 'error' : ''}
                            >
                                <option value="">Select Hospital</option>
                                {hospitals.map(hospital => (
                                    <option key={hospital} value={hospital}>{hospital}</option>
                                ))}
                            </select>
                            {errors.hospital && <span className="error-message">{errors.hospital}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="specialist">
                                Select Specialist <span className="required">*</span>
                            </label>
                            <select
                                id="specialist"
                                name="specialist"
                                value={formData.specialist}
                                onChange={handleChange}
                                className={errors.specialist ? 'error' : ''}
                            >
                                <option value="">Select Specialist</option>
                                {specialists.map(specialist => (
                                    <option key={specialist} value={specialist}>{specialist}</option>
                                ))}
                            </select>
                            {errors.specialist && <span className="error-message">{errors.specialist}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="appointmentDate">
                                Appointment Date <span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                id="appointmentDate"
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className={errors.appointmentDate ? 'error' : ''}
                            />
                            {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="appointmentTime">
                                Appointment Time <span className="required">*</span>
                            </label>
                            <input
                                type="time"
                                id="appointmentTime"
                                name="appointmentTime"
                                value={formData.appointmentTime}
                                onChange={handleChange}
                                className={errors.appointmentTime ? 'error' : ''}
                            />
                            {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
                        </div>
                    </div>

                    <div className="form-section optional-section">
                        <h3 className="section-title">
                            <i className="fas fa-user-friends"></i>
                            Attender Details <span className="optional-badge">Optional</span>
                        </h3>

                        <div className="form-group">
                            <label htmlFor="attenderName">Attender Name</label>
                            <input
                                type="text"
                                id="attenderName"
                                name="attenderName"
                                value={formData.attenderName}
                                onChange={handleChange}
                                placeholder="Enter attender name (optional)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="attenderContact">Attender Contact Number</label>
                            <input
                                type="tel"
                                id="attenderContact"
                                name="attenderContact"
                                value={formData.attenderContact}
                                onChange={handleChange}
                                placeholder="Enter attender contact number (optional)"
                                maxLength="10"
                                className={errors.attenderContact ? 'error' : ''}
                            />
                            {errors.attenderContact && <span className="error-message">{errors.attenderContact}</span>}
                        </div>
                    </div>

                    {submitStatus === 'success' && (
                        <div className="status-message success">
                            <i className="fas fa-check-circle"></i>
                            Appointment booked successfully!
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="status-message error">
                            <i className="fas fa-exclamation-circle"></i>
                            Failed to book appointment. Please try again.
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Booking...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-calendar-check"></i>
                                Book Appointment
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
