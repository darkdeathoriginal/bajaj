
import { useState } from 'react';

export default function FilterPanel({ filters, onFilterChange, specialties = [] }) { 
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);

  const handleConsultationChange = (value) => {
    onFilterChange({
      ...filters,
      
      consultationType: value === filters.consultationType ? '' : value
    });
  };

  const handleSpecialtyChange = (value) => {
    let newSpecialties;
    const currentSpecialties = filters.specialties || []; 

    if (currentSpecialties.includes(value)) {
      newSpecialties = currentSpecialties.filter(s => s !== value);
    } else {
      newSpecialties = [...currentSpecialties, value];
    }

    onFilterChange({
      ...filters,
      specialties: newSpecialties
    });
  };

  const handleSortChange = (value) => {
    onFilterChange({
      ...filters,
      
      sortBy: value === filters.sortBy ? '' : value
    });
  };

  
  const formatSpecialtyId = (specialty) => {
    return String(specialty).replace(/[\s/]/g, '-').toLowerCase();
  };

  return (
    <div className="bg-white  rounded-lg shadow-md p-4 border border-gray-200  sticky top-4"> 
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 ">Filters</h2>

      </div>


      
       <div className="mb-6 border-b border-gray-200  pb-4">
        <div
          data-testid="filter-header-sort"
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => setIsSortOpen(!isSortOpen)}
        >
          <h3 className="font-medium text-gray-700 ">Sort By</h3>
          <svg
            className={`w-5 h-5 transform transition-transform text-gray-500  ${isSortOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {isSortOpen && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                data-testid="sort-fees"
                type="radio"
                id="sort-fees"
                name="sortOption" 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 :ring-blue-600  focus:ring-2  "
                checked={filters.sortBy === 'fees'}
                onChange={() => handleSortChange('fees')}
              />
              <label htmlFor="sort-fees" className="ml-2 text-sm font-medium text-gray-700  cursor-pointer">
                Price - Low to High
              </label>
            </div>
            <div className="flex items-center">
              <input
                data-testid="sort-experience"
                type="radio"
                id="sort-experience"
                name="sortOption" 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 :ring-blue-600  focus:ring-2  "
                checked={filters.sortBy === 'experience'}
                onChange={() => handleSortChange('experience')}
              />
              <label htmlFor="sort-experience" className="ml-2 text-sm font-medium text-gray-700  cursor-pointer">
                Experience - High to Low
              </label>
            </div>
          </div>
        )}
      </div>

      
      <div className="mb-6 border-b border-gray-200  pb-4">
        <div
          data-testid="filter-header-speciality"
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
        >
          <h3 className="font-medium text-gray-700 ">Specialities</h3>
          <svg
            className={`w-5 h-5 transform transition-transform text-gray-500  ${isSpecialtyOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {isSpecialtyOpen && (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2"> 
            
            {specialties && specialties.length > 0 ? (
                 specialties
                    .filter(Boolean) 
                    .sort() 
                    .map((specialty, index) => (
                      <div key={`${specialty}-${index}`} className="flex items-center">
                        <input
                          data-testid={`filter-specialty-${formatSpecialtyId(specialty)}`}
                          type="checkbox"
                          id={`specialty-${formatSpecialtyId(specialty)}`} 
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 :ring-blue-600  focus:ring-2  "
                          checked={(filters.specialties || []).includes(specialty)}
                          onChange={() => handleSpecialtyChange(specialty)}
                        />
                        <label htmlFor={`specialty-${formatSpecialtyId(specialty)}`} className="ml-2 text-sm font-medium text-gray-700  cursor-pointer">
                          {specialty}
                        </label>
                      </div>
                    ))
            ) : (
                <p className="text-sm text-gray-500 ">No specialties available.</p>
            )}
          </div>
        )}
      </div>

      
      <div className="mb-6">
        <div
          data-testid="filter-header-moc"
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => setIsConsultationOpen(!isConsultationOpen)}
        >
          <h3 className="font-medium text-gray-700 ">Mode of Consultation</h3>
          <svg
            className={`w-5 h-5 transform transition-transform text-gray-500  ${isConsultationOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {isConsultationOpen && (
          <div className="space-y-2">
            
            <div className="flex items-center">
              <input
                data-testid="filter-video-consult"
                type="radio"
                id="video-consult"
                name="consultationMode" 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 :ring-blue-600  focus:ring-2  "
                
                
                checked={filters.consultationType === 'video_consult'}
                onChange={() => handleConsultationChange('video_consult')}
              />
              <label htmlFor="video-consult" className="ml-2 text-sm font-medium text-gray-700  cursor-pointer">
                Video Consultation
              </label>
            </div>
            <div className="flex items-center">
              <input
                data-testid="filter-in-clinic"
                type="radio"
                id="in-clinic"
                name="consultationMode" 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 :ring-blue-600  focus:ring-2  "
                 
                 checked={filters.consultationType === 'in_clinic'}
                 onChange={() => handleConsultationChange('in_clinic')}
              />
              <label htmlFor="in-clinic" className="ml-2 text-sm font-medium text-gray-700  cursor-pointer">
                In-Clinic Consultation
              </label>
            </div>

          </div>
        )}
      </div>


    </div>
  );
}