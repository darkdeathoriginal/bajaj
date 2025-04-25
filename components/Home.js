
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Head from 'next/head';
import DoctorCard from '../components/DoctorCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';



const parseNumericValue = (str) => {
    if (!str) return 0;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

export default function HomeComponent() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    consultationType: '',
    specialties: [],
    sortBy: ''
  });

  const router = useRouter();
  const searchParams = useSearchParams(); 

  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null); 
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        let data = await response.json();

        
        
        if (Array.isArray(data)) {
             data = data.map(doc => ({
                ...doc,
                
                specialities: Array.isArray(doc.specialities)
                    ? doc.specialities.map(spec => typeof spec === 'string' ? { name: spec } : spec).filter(spec => spec?.name)
                    : (doc.speciality ? [{ name: doc.speciality }] : []), 
                
                
                video_consult: doc.video_consult ?? (doc.consultation_mode?.includes('Video Consult')),
                in_clinic: doc.in_clinic ?? (doc.consultation_mode?.includes('In Clinic') || doc.consultation_mode?.includes('In-clinic Consultation')), 
             }));
        } else {
            
            console.error("Fetched data is not an array:", data);
            data = []; 
            throw new Error("Fetched data format is incorrect.");
        }


        setDoctors(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Fetching error:", error);
        setError(error.message);
        setDoctors([]); 
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []); 

  
   useEffect(() => {
        const initialSearch = searchParams.get('search') || '';
        const initialConsultationType = searchParams.get('consultationType') || '';
        const initialSpecialties = searchParams.get('specialties')?.split(',') || [];
        const initialSortBy = searchParams.get('sortBy') || '';

        setSearchQuery(initialSearch);
        setFilters({
            consultationType: initialConsultationType,
            
            specialties: initialSpecialties.filter(Boolean),
            sortBy: initialSortBy
        });
   }, [searchParams]); 


   
   const updateURL = useCallback((currentFilters, currentSearch) => {
       const query = {};

       if (currentSearch) {
           query.search = currentSearch;
       }

       if (currentFilters.consultationType) {
           query.consultationType = currentFilters.consultationType;
       }

       if (currentFilters.specialties && currentFilters.specialties.length > 0) {
           query.specialties = currentFilters.specialties.join(',');
       }

       if (currentFilters.sortBy) {
           query.sortBy = currentFilters.sortBy;
       }

       const queryString = new URLSearchParams(query).toString();
       
       router.replace(`?${queryString}`, { scroll: false }); 
   }, [router]);

   
   useEffect(() => {
        updateURL(filters, searchQuery);
   }, [filters, searchQuery, updateURL]);


  
  useEffect(() => {
    if (!doctors.length) {
        setFilteredDoctors([]); 
        return;
    };

    let result = [...doctors];

    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(doctor =>
        doctor.name?.toLowerCase().includes(lowerCaseQuery) ||
        doctor.specialities?.some(s => s?.name?.toLowerCase().includes(lowerCaseQuery))
        
        
      );
    }

    
    if (filters.consultationType) {
        
        result = result.filter(doctor => !!doctor[filters.consultationType]);
    }

    
    if (filters.specialties && filters.specialties.length > 0) {
      result = result.filter(doctor =>
        filters.specialties.some(selectedSpecialty =>
          doctor.specialities?.map(s => s?.name).includes(selectedSpecialty)
        )
      );
    }

    
    if (filters.sortBy === 'fees') {
      result.sort((a, b) => parseNumericValue(a.fees) - parseNumericValue(b.fees));
    } else if (filters.sortBy === 'experience') {
      result.sort((a, b) => parseNumericValue(b.experience) - parseNumericValue(a.experience));
    }

    setFilteredDoctors(result);

  }, [doctors, filters, searchQuery]);


  
  useEffect(() => {
    if (searchQuery.trim() === '' || !doctors.length) {
      setSuggestions([]);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchingDoctors = doctors
      .filter(doctor =>
        doctor.name?.toLowerCase().includes(lowerCaseQuery) && doctor.name !== searchQuery
      )
      .slice(0, 5); 

    

    setSuggestions(matchingDoctors); 

  }, [searchQuery, doctors]);

  
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

   const handleSearchSubmit = (value) => {
      
      
      
      
      console.log("Search submitted:", value);
      setSearchQuery(value); 
      setSuggestions([]); 
   };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion); 
    setSuggestions([]); 
    
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  
  const uniqueSpecialties = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];
    const allSpecialties = doctors.flatMap(doctor => doctor.specialities?.map(s => s?.name) || []);
    
    return Array.from(new Set(allSpecialties.filter(Boolean))).sort();
  }, [doctors]);


  return (
      <div className="min-h-screen bg-gray-50  transition-colors duration-300">
        <Head>
          <title>Doctor Listing | Find Your Doctor</title>
          <meta name="description" content="Find and connect with top doctors based on specialty, experience, and consultation mode." />
          <link rel="icon" href="/favicon.ico" /> 
        </Head>

        <header className="bg-blue-600 shadow-md sticky top-0 z-10"> 
          <div className="container mx-auto px-4 py-3">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              onSearchSubmit={handleSearchSubmit} 
            />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8"> 
             
            <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0"> 
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                specialties={uniqueSpecialties}
              />
            </aside>

             
            <div className="w-full md:w-3/4 lg:w-4/5"> 
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                   <p className="ml-4 text-gray-600 ">Loading Doctors...</p>
                </div>
              ) : error ? (
                 <div className="bg-red-100  border border-red-400 text-red-700  px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                 </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="bg-yellow-100  border border-yellow-400 text-yellow-700  px-4 py-3 rounded relative" role="alert">
                   <strong className="font-bold">No Results:</strong>
                   <span className="block sm:inline ml-2">
                      No doctors found matching your current filters and search. Try adjusting your criteria.
                   </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredDoctors.map((doctor) => (
                    
                    <DoctorCard key={doctor.id || doctor.name} doctor={doctor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-white  border-t border-gray-200  py-6 mt-12"> 
          <div className="container mx-auto px-4 text-center text-sm text-gray-500 ">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </div>
        </footer>
      </div>
  );
}