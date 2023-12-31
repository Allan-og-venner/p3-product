"use client"
// SliderComponent.tsx
import React, { useState, useEffect } from 'react';
// https://www.npmjs.com/package/rc-slider
// Import Slider component from 'rc-slider' library
import Slider from "rc-slider";
// Import styles for the Slider component
import './rc-slider.css';

interface SliderProps {
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

export default function SliderComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses } : SliderProps) {
  // State variable to track the slider value
  const [sliderValue, setSliderValue] = useState(userResponses[currentQuestionIndex] || Math.ceil(jsonData._range / 2));

  // useEffect to handle initial setup and update slider value
  useEffect(() => {
    // Set the initial user response value on component mount
    if ((Array.isArray(userResponses[currentQuestionIndex]) && 
        !userResponses[currentQuestionIndex] && 
        userResponses[currentQuestionIndex][0] !== -1) || 
        typeof userResponses[currentQuestionIndex] == 'undefined') {
      // This will set userResponses[currentQuestionIndex] only if it's not already set
      onUserInput([Math.ceil(jsonData._range / 2)]);
    }

    // Update the slider value when the current question changes
    setSliderValue(userResponses[currentQuestionIndex] || Math.ceil(jsonData._range / 2));
  }, [currentQuestionIndex, userResponses]);

  // Event handler for slider value change
  const handleSliderChange = (value: number | number[]) => {
    const sliderValue = Array.isArray(value) ? value[0] : value;
    setSliderValue(sliderValue);
    // Send the response to the parent component
    onUserInput([sliderValue]);
  };

  // Function to generate marks for the slider based on the range
  const generateMarks = (range: number) => {
    // Explicitly define the type of the marks object
    const marks: { [key: number]: string } = {};
    // Populate the marks object
    for (let i = 1; i <= range; i++) {
      marks[i] = i.toString();
    }
    return marks;
  };

  // Return the JSX structure for the component
  return (
    <form>
      <h3 className="text-center text-base font-bold mb-5">
        {jsonData._description}{jsonData._mandatory && <span style={{ color: 'red' }}>*</span>}
      </h3>
      <div className="w-full px-1 mb-10 mt-5">
        { // New Slider
        <Slider
          onChange={(value) => {
            handleSliderChange(value);
          }}
          value={sliderValue}
          min={1}
          max={(jsonData._range)}
          step={1} 
          dots
          //dotStyle={{display: 'none'}}
          marks={generateMarks(jsonData._range)}
          styles={{
            handle: {
              borderColor: "#0075ff",
              backgroundColor: "#0075ff",
              opacity: 1
            },
            track: {
              backgroundColor: "#0075ff"
            }
          }}
        />
        }
        {/* // Change For Jest
        <input
          onChange={(e) => {
            handleSliderChange(Number(e.target.value));
          }}
          className="w-full cursor-pointer rounded-full "
          type="range"
          role="slider"
          value={sliderValue}
          min={1}
          max={(jsonData.range)}
          step={1}
        />
        */ }
      </div>
      {/*
        <p className="mt-5">DEBUG: Selected value: {sliderValue}</p>
      */}
    </form>
  );
}