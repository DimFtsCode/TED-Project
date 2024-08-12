import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from 'date-fns/locale';

const RegisterBio = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [enums, setEnums] = useState({ Degree: [], EducationLevel: [], JobIndustry: [], JobLevel: [], JobPosition: [], SkillCategory: [] });
    const [education, setEducation] = useState({
        degree: enums.Degree[0] || '',
        level: enums.EducationLevel[0] || '',
        institution: '',
        startDate: null,  // Τώρα αποθηκεύεται ως Date object
        endDate: null,    // Τώρα αποθηκεύεται ως Date object
        isPublic: false
    });
    const [job, setJob] = useState({
        position: enums.JobPosition[0] || '',
        industry: enums.JobIndustry[0] || '',
        level: enums.JobLevel[0] || '',
        company: '',
        startDate: null,  // Τώρα αποθηκεύεται ως Date object
        endDate: null,    // Τώρα αποθηκεύεται ως Date object
        isPublic: false
    });
    const [skill, setSkill] = useState({
        skillName: enums.SkillCategory[0] || '', 
        proficiency: '', 
        isPublic: false
    });
    const [educationList, setEducationList] = useState([]);
    const [jobList, setJobList] = useState([]);
    const [skillList, setSkillList] = useState([]);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const response = await axios.get('https://localhost:7176/api/enum/all-enums');
                setEnums(response.data);
            } catch (error) {
                console.error('Error fetching enums:', error);
            }
        };

        fetchEnums();
    }, []);

    const handleEducationChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEducation({ ...education, [name]: type === 'checkbox' ? checked : value });
    };

    const handleEducationDateChange = (date, name) => {
        setEducation({ ...education, [name]: date });
    };

    const handleJobChange = (e) => {
        const { name, value, type, checked } = e.target;
        setJob({ ...job, [name]: type === 'checkbox' ? checked : value });
    };

    const handleJobDateChange = (date, name) => {
        setJob({ ...job, [name]: date });
    };

    const handleSkillChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSkill({ ...skill, [name]: type === 'checkbox' ? checked : value });
    };

    const handleAddEducation = () => {
        if (education.startDate > education.endDate) {
            setError('The start date must be before the end date.');
            return;
        }
        if (education.degree && education.level && education.institution.trim() && education.startDate && education.endDate) {
            setEducationList([...educationList, education]);
            setEducation({ degree: '', level: '', institution: '', startDate: null, endDate: null, isPublic: false });
            setError('');  // Clear error
        }
    };

    const handleAddJob = () => {
        if (job.startDate > job.endDate) {
            setError('The start date must be before the end date.');
            return;
        }
        if (job.position && job.industry && job.level && job.company.trim() && job.startDate && job.endDate) {
            setJobList([...jobList, job]);
            setJob({ position: '', industry: '', level: '', company: '', startDate: null, endDate: null, isPublic: false });
            setError('');  // Clear error
        }
    };

    const handleAddSkill = () => {
        if (skill.skillName && skill.proficiency.trim()) {
            setSkillList([...skillList, skill]);
            setSkill({ skillName: '', proficiency: '', isPublic: false });
        }
    };

    const handleEditEducation = (index) => {
        const item = educationList[index];
        setEducation(item);
        setEducationList(educationList.filter((_, i) => i !== index));
    };

    const handleDeleteEducation = (index) => {
        setEducationList(educationList.filter((_, i) => i !== index));
    };

    const handleEditJob = (index) => {
        const item = jobList[index];
        setJob(item);
        setJobList(jobList.filter((_, i) => i !== index));
    };

    const handleDeleteJob = (index) => {
        setJobList(jobList.filter((_, i) => i !== index));
    };

    const handleEditSkill = (index) => {
        const item = skillList[index];
        setSkill(item);
        setSkillList(skillList.filter((_, i) => i !== index));
    };

    const handleDeleteSkill = (index) => {
        setSkillList(skillList.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Μορφοποίηση των ημερομηνιών
        const formattedEducation = educationList.map(ed => ({
            ...ed,
            startDate: ed.startDate ? ed.startDate.toISOString().split('T')[0] : null,
            endDate: ed.endDate ? ed.endDate.toISOString().split('T')[0] : null,
        }));
    
        const formattedJobs = jobList.map(job => ({
            ...job,
            startDate: job.startDate ? job.startDate.toISOString().split('T')[0] : null,
            endDate: job.endDate ? job.endDate.toISOString().split('T')[0] : null,
        }));
    
        const bioData = {
            userId: user.userId,
            educations: formattedEducation,
            jobs: formattedJobs,
            skills: skillList
        };
    
        console.log("Bio Data:", bioData);
    
        try {
            const response = await axios.post('https://localhost:7176/api/userbio/register-bio', bioData, {
                withCredentials: true
            });
            setUserName(response.data.firstName);  // Set the user's name for the modal
            setShowSuccessModal(true);    // Show the success modal
        } catch (error) {
            console.error(error);
            // Χειρισμός σφάλματος, έλεγχος εάν είναι αντικείμενο ή string
            setError(typeof error.response.data === 'string' ? error.response.data : 'An error occurred during registration. Please try again.');
        }
    };
    

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate("/user");
    };

    return (
        <div className="container mt-5">
            <h2>Write your <strong>Biography</strong> here.</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                {/* Education Section */}
                <fieldset className="border p-3 mb-4">
                    <legend className="w-auto px-2">Education</legend>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="degree" className="form-label">Degree</label>
                            <select 
                                className="form-select" 
                                id="degree" 
                                name="degree" 
                                value={education.degree} 
                                onChange={handleEducationChange}
                            >
                                <option value="" disabled hidden>Select Degree</option>
                                {Object.values(enums.Degree).map(degree => (
                                    <option key={degree} value={degree}>
                                        {degree}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="level" className="form-label">Education Level</label>
                            <select 
                                className="form-select" 
                                id="level" 
                                name="level" 
                                value={education.level} 
                                onChange={handleEducationChange}
                            >
                                <option value="" disabled hidden>Select Education Level</option>
                                {Object.values(enums.EducationLevel).map(level => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="institution" className="form-label">Institution</label>
                        <input 
                            type="text" 
                            className="form-control w-50"  
                            id="institution" 
                            name="institution" 
                            value={education.institution} 
                            onChange={handleEducationChange}  
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="startDate" className="form-label">Start Date</label>
                            <DatePicker 
                                selected={education.startDate} 
                                onChange={(date) => handleEducationDateChange(date, 'startDate')} 
                                dateFormat="MM/dd/yyyy"
                                className="form-control" 
                                placeholderText="Select Start Date"
                                locale={enUS}
                                showYearDropdown        // Προσθέτει dropdown για επιλογή έτους
                                showMonthDropdown       // Προσθέτει dropdown για επιλογή μήνα
                                dropdownMode="select"
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="endDate" className="form-label">End Date</label>
                            <DatePicker 
                                selected={education.endDate} 
                                onChange={(date) => handleEducationDateChange(date, 'endDate')} 
                                dateFormat="MM/dd/yyyy"
                                className="form-control" 
                                placeholderText="Select End Date"
                                locale={enUS}
                                showYearDropdown        // Προσθέτει dropdown για επιλογή έτους
                                showMonthDropdown       // Προσθέτει dropdown για επιλογή μήνα
                                dropdownMode="select"
                                
                            />
                        </div>
                    </div>

                    <div className="form-check mb-3">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="educationIsPublic" 
                            name="isPublic" 
                            checked={education.isPublic} 
                            onChange={handleEducationChange} 
                        />
                        <label className="form-check-label" htmlFor="educationIsPublic">Public</label>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={handleAddEducation}>Add to Education</button>
                </fieldset>


                {/* Job Section */}
                <fieldset className="border p-3 mb-4">
                    <legend className="w-auto px-2">Job</legend>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="industry" className="form-label">Industry</label>
                            <select 
                                className="form-select" 
                                id="industry" 
                                name="industry" 
                                value={job.industry} 
                                onChange={handleJobChange}
                            >
                                <option value="" disabled hidden>Select Industry</option>
                                {Object.values(enums.JobIndustry).map(industry => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="company" className="form-label">Company</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="company" 
                                name="company" 
                                value={job.company} 
                                onChange={handleJobChange} 
                                placeholder="Company" 
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="position" className="form-label">Position</label>
                            <select 
                                className="form-select" 
                                id="position" 
                                name="position" 
                                value={job.position} 
                                onChange={handleJobChange}
                            >
                                <option value="" disabled hidden>Select Position</option>
                                {Object.values(enums.JobPosition).map(position => (
                                    <option key={position} value={position}>
                                        {position}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="level" className="form-label">Job Level</label>
                            <select 
                                className="form-select" 
                                id="level" 
                                name="level" 
                                value={job.level} 
                                onChange={handleJobChange}
                            >
                                <option value="" disabled hidden>Select Job Level</option>
                                {Object.values(enums.JobLevel).map(level => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="jobStartDate" className="form-label">Start Date</label>
                            <DatePicker 
                                selected={job.startDate} 
                                onChange={(date) => handleJobDateChange(date, 'startDate')} 
                                dateFormat="MM/dd/yyyy"
                                className="form-control" 
                                placeholderText="Select Start Date"
                                locale={enUS}
                                showYearDropdown        // Προσθέτει dropdown για επιλογή έτους
                                showMonthDropdown       // Προσθέτει dropdown για επιλογή μήνα
                                dropdownMode="select"
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="jobEndDate" className="form-label">End Date</label>
                            <DatePicker 
                                selected={job.endDate} 
                                onChange={(date) => handleJobDateChange(date, 'endDate')} 
                                dateFormat="MM/dd/yyyy"
                                className="form-control" 
                                placeholderText="Select End Date"
                                locale={enUS}
                                showYearDropdown        // Προσθέτει dropdown για επιλογή έτους
                                showMonthDropdown       // Προσθέτει dropdown για επιλογή μήνα
                                dropdownMode="select"
                            />
                        </div>
                    </div>

                    <div className="form-check mb-3">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="jobIsPublic" 
                            name="isPublic" 
                            checked={job.isPublic} 
                            onChange={handleJobChange} 
                        />
                        <label className="form-check-label" htmlFor="jobIsPublic">Public</label>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={handleAddJob}>Add to Jobs</button>
                </fieldset>

                {/* Skill Section */}
                <fieldset className="border p-3 mb-4">
                    <legend className="w-auto px-2">Skill</legend>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="skillName" className="form-label">Skill Name</label>
                            <select 
                                className="form-select" 
                                id="skillName" 
                                name="skillName" 
                                value={skill.skillName} 
                                onChange={handleSkillChange}
                            >
                                <option value="" disabled hidden>Select Skill Category</option>
                                {Object.values(enums.SkillCategory).map(skillName => (
                                    <option key={skillName} value={skillName}>
                                        {skillName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="proficiency" className="form-label">Proficiency</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="proficiency" 
                                name="proficiency" 
                                value={skill.proficiency} 
                                onChange={handleSkillChange} 
                                placeholder="Proficiency" 
                            />
                        </div>
                    </div>

                    <div className="form-check mb-3">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="skillIsPublic" 
                            name="isPublic" 
                            checked={skill.isPublic} 
                            onChange={handleSkillChange} 
                        />
                        <label className="form-check-label" htmlFor="skillIsPublic">Public</label>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>Add to Skills</button>
                </fieldset>


                {/* Submit Section */}
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>

            <div className="mt-4">
                <h4>Biography List</h4>
                <ul className="list-group">
                    {educationList.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Education {index + 1}:</strong> {item.degree}, {item.institution}, {item.startDate.toDateString()} - {item.endDate.toDateString()} {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}</span>
                            <span>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditEducation(index)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEducation(index)}>Delete</button>
                            </span>
                        </li>
                    ))}
                    {jobList.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Job {index + 1}:</strong> {item.position}, {item.company}, {item.startDate.toDateString()} - {item.endDate.toDateString()} {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}</span>
                            <span>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditJob(index)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteJob(index)}>Delete</button>
                            </span>
                        </li>
                    ))}
                    {skillList.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Skill {index + 1}:</strong> {item.skillName}, {item.proficiency} {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}</span>
                            <span>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditSkill(index)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSkill(index)}>Delete</button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'green' }}>Biography Created</Modal.Title>
                </Modal.Header>
                <Modal.Body>{userName}, your biography has been created successfully.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseSuccessModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

};

export default RegisterBio;
