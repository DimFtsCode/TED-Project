import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

const RegisterBio = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [education, setEducation] = useState('');
    const [job, setJob] = useState('');
    const [educationList, setEducationList] = useState([]);
    const [jobList, setJobList] = useState([]);
    const [error, setError] = useState('');

    const handleEducationChange = (e) => {
        setEducation(e.target.value);
    };

    const handleJobChange = (e) => {
        setJob(e.target.value);
    };

    const handleAddEducation = () => {
        if (education.trim() && !educationList.includes(education.trim())) {
            setEducationList([...educationList, education.trim()]);
            setEducation('');
        }
    };

    const handleAddJob = () => {
        if (job.trim() && !jobList.includes(job.trim())) {
            setJobList([...jobList, job.trim()]);
            setJob('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formattedBioList = [
            ...educationList.map((item, index) => `Education ${index + 1}: ${item}`),
            ...jobList.map((item, index) => `Job ${index + 1}: ${item}`)
        ];
        
        console.log("User ID:", user.userId);
        console.log("Biography List:", formattedBioList);

        try {
            const response = await axios.post('https://localhost:7176/api/users/register-bio', 
                { userId: user.userId, bio: formattedBioList }, 
                { withCredentials: true });
            alert(response.data);
            navigate("/user");
        } catch (error) {
            console.error(error);
            setError(error.response.data);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Write your <strong>Biography</strong> here.</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="education" className="form-label">Add Education</label>
                    <textarea className="form-control" id="education" name="education" value={education} onChange={handleEducationChange} placeholder="Add your education details here..." />
                    <button type="button" className="btn btn-secondary mt-2" onClick={handleAddEducation}>Add to Education</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="job" className="form-label">Add Jobs</label>
                    <textarea className="form-control" id="job" name="job" value={job} onChange={handleJobChange} placeholder="Add your job details here..." />
                    <button type="button" className="btn btn-secondary mt-2" onClick={handleAddJob}>Add to Jobs</button>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>
            <div className="mt-4">
                <h4>Biography List</h4>
                <ul className="list-group">
                    {educationList.map((item, index) => (
                        <li key={index} className="list-group-item">
                            <strong>Education {index + 1}:</strong> {item}
                        </li>
                    ))}
                    {jobList.map((item, index) => (
                        <li key={index} className="list-group-item">
                            <strong>Job {index + 1}:</strong> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RegisterBio;
