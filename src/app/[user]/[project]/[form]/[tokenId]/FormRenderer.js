"use client"
import React, { lazy, Suspense, useState, useEffect } from 'react';

const DynamicComponent = lazy(() => import('./DynamicComponent'));

function FormRenderer({ formObject }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalQuestions = formObject.questions.length;

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl">
      <h1 className="text-2xl font-medium text-center">{formObject.name}</h1>
      <p className="text-l font-medium mb-4 text-center">{formObject.description}</p>
      <div className="relative flex pb-5 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      {formObject.questions.map((question, index) => (
        index === currentQuestionIndex && question.questionType === 2 && (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            <DynamicComponent jsonData = {question} />
          </Suspense>
        )
      ))}
      {currentQuestionIndex < totalQuestions - 1 && (
        <button onClick={goToNextQuestion}>Next Question</button>
      )}
    </div>
  );
}

export default FormRenderer;