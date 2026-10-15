
import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, Award, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

type Assessment = {
  id: string;
  stepId: string;
  title: string;
  description: string | null;
  skillName: string;
  difficulty: string;
  durationMinutes: number;
  passingScore: number;
};

type Question = {
  question: string;
  options: string[];
};

type Exam = Assessment & {
  questions: Question[];
};

type Result = {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
  passed: boolean;
  feedback: {
    question: string;
    selectedAnswer: number;
    correctAnswer: number;
    explanation: string;
    isCorrect: boolean;
  }[];
};

export const Assessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const response: any = await api.get('/assessments');
        if (response.success) {
          setAssessments(response.assessments ?? []);
        } else {
          setError('Could not load assessments.');
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
        setError('Could not load assessments. Please check your login and API server.');
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, []);

  const startExam = async (id: string) => {
    setError('');
    setResult(null);
    setExam(null);

    try {
      const response: any = await api.get(`/assessments/${id}`);

      if (!response.success) {
        setError(response.error || 'Could not open assessment.');
        return;
      }

      setExam(response.assessment);
      setAnswers(Array(response.assessment.questions.length).fill(-1));
    } catch (err) {
      console.error('Failed to open assessment:', err);
      setError('Could not open assessment. Please try again.');
    }
  };

  const submitExam = async () => {
    if (!exam) return;

    if (answers.some((answer) => answer < 0)) {
      setError('Please answer every question before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response: any = await api.post(
        `/assessments/${exam.id}/submit`,
        { answers }
      );

      if (response.success) {
        setResult(response.result);
      } else {
        setError(response.error || 'Submission failed.');
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      setError('Could not submit your answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setExam(null);
    setResult(null);
    setAnswers([]);
    setError('');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading assessments...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-600" />
          Skill Assessments
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Test your knowledge and measure your progress.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
          {error}
        </div>
      )}

      {!exam && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-slate-100">
                    {assessment.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {assessment.skillName} · {assessment.difficulty}
                  </p>
                </div>
                <Award className="w-6 h-6 text-brand-600 shrink-0" />
              </div>

              {assessment.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {assessment.description}
                </p>
              )}

              <p className="text-xs text-slate-500">
                {assessment.durationMinutes} minutes · Pass mark: {assessment.passingScore}%
              </p>

              <button
                onClick={() => startExam(assessment.id)}
                className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-2.5"
              >
                Start Assessment
              </button>
            </div>
          ))}

          {assessments.length === 0 && (
            <div className="col-span-full p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
              No active assessments are available yet.
            </div>
          )}
        </div>
      )}

      {exam && !result && (
        <div className="space-y-5">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-semibold text-brand-600"
          >
            <ArrowLeft className="w-4 h-4" /> Back to assessments
          </button>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {exam.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Question {answers.filter((a) => a >= 0).length} of {exam.questions.length} answered
            </p>
          </div>

          {exam.questions.map((question, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {index + 1}. {question.question}
              </h3>

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                      answers[index] === optionIndex
                        ? 'border-brand-500 bg-brand-50 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === optionIndex}
                      onChange={() =>
                        setAnswers((previous) =>
                          previous.map((answer, i) =>
                            i === index ? optionIndex : answer
                          )
                        )
                      }
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={submitExam}
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold py-3"
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      )}

      {exam && result && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            {result.passed ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            )}

            <h2 className="text-2xl font-extrabold mt-3 text-slate-900 dark:text-slate-100">
              {result.passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
            </h2>

            <p className="text-4xl font-extrabold text-brand-600 mt-3">
              {result.score}%
            </p>

            <p className="text-sm text-slate-500 mt-2">
              {result.correctCount} of {result.totalQuestions} correct · Passing score: {result.passingScore}%
            </p>
          </div>

          {result.feedback.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {index + 1}. {item.question}
              </p>

              <p className={`text-sm mt-2 ${item.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                {item.isCorrect ? 'Correct answer' : 'Incorrect answer'}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Correct option: {exam.questions[index]?.options[item.correctAnswer]}
              </p>

              {item.explanation && (
                <p className="text-sm text-slate-500 mt-2">
                  Explanation: {item.explanation}
                </p>
              )}
            </div>
          ))}

          <button
            onClick={goBack}
            className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold py-3"
          >
            Back to Assessments
          </button>
        </div>
      )}
    </div>
  );
};