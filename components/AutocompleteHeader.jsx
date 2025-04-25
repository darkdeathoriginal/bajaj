
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';


const AutocompleteHeader = ({ allDoctors = [], onSearchChange, initialSearchTerm = '' }) => {
  
  const [inputValue, setInputValue] = useState(initialSearchTerm || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => { setInputValue(initialSearchTerm || ''); }, [initialSearchTerm]);

  const handleInputChange = useCallback((event) => { 
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = allDoctors
        .filter((doctor) =>
          
          doctor?.name?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onSearchChange('');
    }
  }, [allDoctors, onSearchChange]);

  const handleSuggestionClick = useCallback((doctorName) => { 
    setInputValue(doctorName);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearchChange(doctorName);
    inputRef.current?.focus();
  }, [onSearchChange]);

  const handleKeyDown = useCallback((event) => { 
    if (event.key === 'Enter') {
        event.preventDefault();
        setShowSuggestions(false);
        onSearchChange(inputValue);
        inputRef.current?.blur();
    } else if (event.key === 'Escape') {
        setShowSuggestions(false);
        inputRef.current?.blur();
    }
  }, [inputValue, onSearchChange]);

  useEffect(() => {
    const handleClickOutside = (event) => { 
      if (
        inputRef.current && !inputRef.current.contains(event.target) && 
        suggestionsRef.current && !suggestionsRef.current.contains(event.target) 
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400  pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          data-testid="autocomplete-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search doctors by name..."
          
          className="w-full pl-12 pr-4 py-3 border border-gray-300  rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 :ring-blue-400 focus:border-transparent bg-white  text-gray-900  transition-all duration-200 ease-in-out shadow-sm"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          
          className="absolute z-20 w-full mt-2 bg-white  border border-gray-200  rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {suggestions.map((doctor) => (
            <li
              key={doctor.id}
              data-testid="suggestion-item"
              onClick={() => handleSuggestionClick(doctor.name)}
               
              className="px-4 py-3 cursor-pointer hover:bg-blue-50 :bg-gray-600 text-gray-800  transition-colors duration-150 ease-in-out text-sm"
            >
              {doctor.name} - <span className="text-xs text-gray-500 ">{Array.isArray(doctor.speciality) ? doctor.speciality.join(', ') : (doctor.speciality || '')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AutocompleteHeader;