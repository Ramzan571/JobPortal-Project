import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../services/jobService';

function JobsList() {
  // jobs mein saari jobs store hongi
  const [jobs, setJobs] = useState([]);
  // loading dikhao jab tak data nahi aata
  const [loading, setLoading] = useState(true);

  // Component load hote hi jobs lao
  useEffect(() => {
    getAllJobs()
      .then(res => {
        setJobs(res.data);  // jobs store karo
        setLoading(false);  // loading band karo
      })
      .catch(err => {
        console.error('Jobs nahi aai:', err);
        setLoading(false);
      });
  }, []); // [] matlab sirf ek baar chale

  if (loading) return <p>Jobs load ho rahi hain...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Jobs</h2>

      {jobs.length === 0 && <p>Koi job nahi hai abhi.</p>}

      {jobs.map(job => (
        <div key={job.id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px'
        }}>
          <h3>{job.title}</h3>
          <p>📍 Location: {job.location}</p>
          <p>💰 Salary: Rs. {job.salary}</p>
          <p>{job.description}</p>
        </div>
      ))}
    </div>
  );
}

export default JobsList;