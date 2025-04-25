"use client"
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

export default function SearchBar({ value, onChange, suggestions, onSuggestionClick, onSearchSubmit }) { 
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null); 
  const [showSuggestions, setShowSuggestions] = useState(false); 


  
   useEffect(() => {
    function handleClickOutside(event) {
      
      if (
        inputRef.current && !inputRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   const handleInputChange = (e) => {
     onChange(e.target.value);
     
     setShowSuggestions(e.target.value.trim().length > 0 && suggestions.length > 0);
   };

   const handleSuggestionClickInternal = (suggestion) => {
     onSuggestionClick(suggestion);
     setShowSuggestions(false); 
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); 
          setShowSuggestions(false); 
          inputRef.current?.blur(); 
          if (onSearchSubmit) {
              onSearchSubmit(value); 
          }
      } else if (e.key === 'Escape') {
          setShowSuggestions(false); 
          inputRef.current?.blur(); 
      }
   };

   
    useEffect(() => {
        setShowSuggestions(value.trim().length > 0 && suggestions.length > 0);
    }, [suggestions, value]);


  return (
    <div className="relative w-full max-w-3xl mx-auto"> 
      <div className="relative"> 
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"> 
          <svg className="w-5 h-5 text-gray-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          ref={inputRef} 
          data-testid="autocomplete-input"
          type="search"
          
          className="w-full p-4 pl-12 pr-4 text-sm text-gray-900 bg-white  rounded-full border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 :ring-blue-400 focus:border-transparent   shadow-sm"
          placeholder="Search doctors, specialities, clinics..."
          value={value}
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown} 
          onFocus={() => setShowSuggestions(value.trim().length > 0 && suggestions.length > 0)} 
          autoComplete="off" 
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-20 mt-1 w-full bg-white  shadow-xl rounded-lg border border-gray-200  overflow-hidden divide-y divide-gray-100 " 
        >
          {suggestions.map((doctor) => (
            <li
              
              key={doctor.id}
              data-testid="suggestion-item"
              
              onClick={() => handleSuggestionClickInternal(doctor.name)}
              
              onMouseDown={(e) => e.preventDefault()}
              
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 :bg-gray-700 transition-colors duration-150 ease-in-out"
            >
              
              <div className="flex-shrink-0 mr-3 h-10 w-10 relative rounded-md overflow-hidden bg-gray-200 "> 
                <Image
                  
                  src={!doctor.photo || doctor.photo === "null" ? "/default-profile.png" : doctor.photo}
                  alt={doctor.name || 'Doctor'}
                  layout="fill"
                  objectFit="cover"
                  onError={(e) => { e.target.onerror = null; e.target.src='/default-profile.png'; }}
                />
              </div>

              
              <div className="flex-grow min-w-0"> 
                <p className="text-sm font-medium text-gray-900  truncate"> 
                  {doctor.name || 'Doctor Name'}
                </p>
                
                {doctor.specialities && doctor.specialities.length > 0 && (
                  <p className="text-xs text-gray-500  uppercase truncate"> 
                    {doctor.specialities.map(e => e?.name).filter(Boolean).join(', ') || 'Specialty not available'}
                  </p>
                )}
              </div>

              
              <div className="ml-auto pl-2 flex-shrink-0">
                
              </div>
            </li>
          ))}
           
           
        </ul>
      )}
    </div>
  );
}