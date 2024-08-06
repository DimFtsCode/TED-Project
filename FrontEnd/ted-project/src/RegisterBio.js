import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Modal, Button } from 'react-bootstrap';

const RegisterBio = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [education, setEducation] = useState({ degree: '', institution: '', startDate: '', endDate: '', isPublic: false });
    const [job, setJob] = useState({ position: '', company: '', startDate: '', endDate: '', isPublic: false });
    const [skill, setSkill] = useState({ skillName: '', proficiency: '', isPublic: false });
    const [educationList, setEducationList] = useState([]);
    const [jobList, setJobList] = useState([]);
    const [skillList, setSkillList] = useState([]);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [userName, setUserName] = useState('');

    const handleEducationChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEducation({ ...education, [name]: type === 'checkbox' ? checked : value });
    };

    const handleJobChange = (e) => {
        const { name, value, type, checked } = e.target;
        setJob({ ...job, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSkillChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSkill({ ...skill, [name]: type === 'checkbox' ? checked : value });
    };

    const handleAddEducation = () => {
        if (new Date(education.startDate) > new Date(education.endDate)) {
            setError('The start date must be before the end date.');
            return;
        }
        if (education.degree.trim() && education.institution.trim() && education.startDate && education.endDate) {
            setEducationList([...educationList, education]);
            setEducation({ degree: '', institution: '', startDate: '', endDate: '' });
            setError('');  // Clear error
        }
    };

    const handleAddJob = () => {
        if (new Date(job.startDate) > new Date(job.endDate)) {
            setError('The start date must be before the end date.');
            return;
        }
        if (job.position.trim() && job.company.trim() && job.startDate && job.endDate) {
            setJobList([...jobList, job]);
            setJob({ position: '', company: '', startDate: '', endDate: '' });
            setError('');  // Clear error
        }
    };

    const handleAddSkill = () => {
        if (skill.skillName.trim() && skill.proficiency.trim()) {
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
    
        const bioData = {
            userId: user.userId,
            educations: educationList,
            jobs: jobList,
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
            setError(error.response.data);
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
                <div className="mb-3">
                    <label htmlFor="degree" className="form-label">Degree</label>
                    <input type="text" className="form-control" id="degree" name="degree" value={education.degree} onChange={handleEducationChange} placeholder="Degree" />
                    <label htmlFor="institution" className="form-label">Institution</label>
                    <input type="text" className="form-control" id="institution" name="institution" value={education.institution} onChange={handleEducationChange} placeholder="Institution" />
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input type="date" className="form-control" id="startDate" name="startDate" value={education.startDate} onChange={handleEducationChange} />
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input type="date" className="form-control" id="endDate" name="endDate" value={education.endDate} onChange={handleEducationChange} />
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="educationIsPublic" name="isPublic" checked={education.isPublic} onChange={handleEducationChange} />
                        <label className="form-check-label" htmlFor="educationIsPublic">Public</label>
                    </div>
                    <button type="button" className="btn btn-secondary mt-2" onClick={handleAddEducation}>Add to Education</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="position" className="form-label">Position</label>
                    <input type="text" className="form-control" id="position" name="position" value={job.position} onChange={handleJobChange} placeholder="Position" />
                    <label htmlFor="company" className="form-label">Company</label>
                    <input type="text" className="form-control" id="company" name="company" value={job.company} onChange={handleJobChange} placeholder="Company" />
                    <label htmlFor="jobStartDate" className="form-label">Start Date</label>
                    <input type="date" className="form-control" id="jobStartDate" name="startDate" value={job.startDate} onChange={handleJobChange} />
                    <label htmlFor="jobEndDate" className="form-label">End Date</label>
                    <input type="date" className="form-control" id="jobEndDate" name="endDate" value={job.endDate} onChange={handleJobChange} />
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="jobIsPublic" name="isPublic" checked={job.isPublic} onChange={handleJobChange} />
                        <label className="form-check-label" htmlFor="jobIsPublic">Public</label>
                    </div>
                    <button type="button" className="btn btn-secondary mt-2" onClick={handleAddJob}>Add to Jobs</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="skillName" className="form-label">Skill Name</label>
                    <input type="text" className="form-control" id="skillName" name="skillName" value={skill.skillName} onChange={handleSkillChange} placeholder="Skill Name" />
                    <label htmlFor="proficiency" className="form-label">Proficiency</label>
                    <input type="text" className="form-control" id="proficiency" name="proficiency" value={skill.proficiency} onChange={handleSkillChange} placeholder="Proficiency" />
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="skillIsPublic" name="isPublic" checked={skill.isPublic} onChange={handleSkillChange} />
                        <label className="form-check-label" htmlFor="skillIsPublic">Public</label>
                    </div>
                    <button type="button" className="btn btn-secondary mt-2" onClick={handleAddSkill}>Add to Skills</button>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>
            <div className="mt-4">
                <h4>Biography List</h4>
                <ul className="list-group">
                    {educationList.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Education {index + 1}:</strong> {item.degree}, {item.institution}, {item.startDate} - {item.endDate} {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}</span>
                            <span>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditEducation(index)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEducation(index)}>Delete</button>
                            </span>
                        </li>
                    ))}
                    {jobList.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Job {index + 1}:</strong> {item.position}, {item.company}, {item.startDate} - {item.endDate} {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}</span>
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
