
import React from 'react';

import DoctorCard from './DoctorCard';



const DoctorList = ({ doctors }) => {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No doctors found matching your criteria.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {doctors.map((doctor) => (
        
        <DoctorCard key={doctor.id || Math.random()} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;