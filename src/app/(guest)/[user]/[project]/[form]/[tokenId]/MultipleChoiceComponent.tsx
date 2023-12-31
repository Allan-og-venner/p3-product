"use client"
// MultipleChoiceComponent.tsx
import React, { useState, useEffect } from 'react';

interface MultipleChoiceProps {
  jsonData: {
    _description: string;
    _mandatory: boolean;
    _userDisplay: boolean;
    _questionType: number;
    _saveRole: boolean;
    _options: any[string];
    _type: number;
    _range: number;
  };
  onUserInput: any;
  currentQuestionIndex: number;
  userResponses: any[];
}

export default function MultipleChoiceComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses } : MultipleChoiceProps) {
  // Determine the initial options based on user responses
  const initialOptions = userResponses && userResponses[currentQuestionIndex] ? userResponses[currentQuestionIndex] : [];
  // State variable to track the selected options
  const [selectedOptions, setSelectedOptions] = useState(initialOptions);

  // useEffect to handle initial setup and update selected options
  useEffect(() => {
    // Send the response to the parent component when selectedOptions change
    if ((Array.isArray(userResponses[currentQuestionIndex]) && 
        !userResponses[currentQuestionIndex] && 
        userResponses[currentQuestionIndex][0] !== -1) || 
        typeof userResponses[currentQuestionIndex] == 'undefined') {
      // This will set userResponses[currentQuestionIndex] only if it's not already set
      onUserInput([]);
    }

    // Send the selected options to the parent component
    onUserInput(selectedOptions);
  }, [selectedOptions]); // Only re-run the effect when selectedOptions change

  // Event handler for option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (jsonData._type === 0) {
      // Radio buttons: Select the clicked option
      setSelectedOptions([optionIndex]);
    } else {
      // Checkboxes: Toggle the selected state of the clicked option
      if (selectedOptions.includes(optionIndex)) {
        // Remove the option if it's already selected
        setSelectedOptions(selectedOptions.filter((index: number) => index !== optionIndex));
      } else {
        // Add the option if it's not selected
        setSelectedOptions([...selectedOptions, optionIndex]);
      }
    }
  };

  // Return the JSX structure for the component
  return (
    <form>
        <h3 className="text-center text-base font-bold mb-5">
          {jsonData._description}{jsonData._mandatory && <span style={{ color: 'red' }}>*</span>}
        </h3>
        {jsonData._options.map((option: string, optionIndex: number) => (
        <div className="mb-[1rem] block min-h-[1.5rem] pl-[1.5rem]" key={optionIndex}>
          {jsonData._type === 0 ? ( 
            // Display radio buttons if type is 0
            <input
              type="radio"
              id={`option-${optionIndex}`}
              onChange={() => handleOptionSelect(optionIndex)}
              checked={selectedOptions.includes(optionIndex)}
              value={option}
              className="!relative float-left -ml-[1.5rem] mr-[0.75rem] mt-0.5 !h-5 !w-5 !opacity-100 hover:cursor-pointer"
            />
          ) : (
            // Display checkboxes if type is 1
            <input
              type="checkbox"
              id={`option-${optionIndex}`}
              onChange={() => handleOptionSelect(optionIndex)}
              checked={selectedOptions.includes(optionIndex)}
              value={option}
              className="relative float-left -ml-[1.5rem] mr-[0.75rem] mt-0.5 h-5 w-5 hover:cursor-pointer"
            />
          )}
          <label 
            htmlFor={`option-${optionIndex}`} 
            className="mt-px inline-block hover:cursor-pointer">
              {option}
          </label>
        </div>
        ))}
        {/*
          <p>DEBUG: Selected options: {selectedOptions.join(', ')}</p>
        */}
    </form>
  );
}