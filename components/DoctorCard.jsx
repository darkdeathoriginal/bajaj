
import Image from 'next/image';

export default function DoctorCard({ doctor }) {
    
    const formatExperience = (exp) => {
        const years = exp?.match(/\d+/)?.[0] || '0'; 
        return `${years} years experience`;
    };

    
    const formatFees = (fees) => {
         if (!fees || typeof fees !== 'string') return 'N/A Consultation Fee';
         const feeValue = fees.replace('₹','').trim();
         return `₹ ${feeValue} Consultation Fee`;
    };

    
    
    
    
    const getConsultationModes = (doc) => {
        let modes = [];
        if (doc.video_consult) modes.push('Video Consult');
        if (doc.in_clinic) modes.push('In Clinic');
        
        if (Array.isArray(doc.consultation_mode) && doc.consultation_mode.length > 0) {
            modes = doc.consultation_mode;
        }
        return modes;
    };

    const consultationModes = getConsultationModes(doctor);

    return (
      <div
        data-testid="doctor-card"
        className="bg-white  rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4 border border-gray-200 "
      >
        <div className="w-24 h-24 relative rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
          <Image
            
            src={!doctor.photo || doctor.photo === "null" ? "/default-profile.png" : doctor.photo}
            alt={doctor.name || 'Doctor profile'}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            
             onError={(e) => { e.target.onerror = null; e.target.src='/default-profile.png'; }}
          />
        </div>

        <div className="flex-grow text-center md:text-left">
          <h2 data-testid="doctor-name" className="text-xl font-bold text-gray-800  mb-1">
            {doctor.name || 'Doctor Name'}
          </h2>

          <div data-testid="doctor-specialty" className="mb-2 text-gray-600  text-sm">
             
             {Array.isArray(doctor.specialities) ? doctor.specialities.map(e => e?.name).filter(Boolean).join(', ') : 'Specialty not available'}
          </div>

          <div className="flex flex-col items-center md:items-start md:flex-row gap-2 md:gap-6 text-sm mt-3">
            <div data-testid="doctor-experience" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-gray-700 ">{formatExperience(doctor.experience)}</span>
            </div>

            <div data-testid="doctor-fee" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 ">{formatFees(doctor.fees)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            {consultationModes.includes('Video Consult') && (
              <span className="bg-blue-100 text-blue-800   text-xs font-medium px-2.5 py-0.5 rounded-full">
                Video Consult
              </span>
            )}

            {consultationModes.includes('In Clinic') && (
              <span className="bg-green-100 text-green-800   text-xs font-medium px-2.5 py-0.5 rounded-full">
                In Clinic
              </span>
            )}
             
             {consultationModes.length === 0 && (
                <span className="bg-gray-100 text-gray-800   text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Consultation Mode N/A
                </span>
             )}
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-2 items-center md:items-end justify-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200  md:pl-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full md:w-auto transition-colors whitespace-nowrap">
            Book Appointment
          </button>
        </div>
      </div>
    );
}

