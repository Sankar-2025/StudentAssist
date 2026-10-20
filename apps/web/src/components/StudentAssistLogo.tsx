import React from 'react';

interface StudentAssistLogoProps {
  className?: string;
  size?: number;
}

export const StudentAssistLogo: React.FC<StudentAssistLogoProps> = ({
  className = 'w-6 h-6',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="StudentAssist Logo"
    >
      {/* Graduation Mortarboard Cap */}
      <path
        d="M16 4L29 10L16 16L3 10L16 4Z"
        fill="currentColor"
      />

      {/* Academic Honors Golden Tassel */}
      <path
        d="M26 11V18.5C26 19.3 27.2 19.3 27.2 18.5V10.5L26 11Z"
        fill="#FBBF24"
      />
      <circle cx="26.6" cy="19.2" r="1.2" fill="#FBBF24" />

      {/* Supportive Shield Wings */}
      <path
        d="M6 13.5V19.5C6 24.5 10.2 27.8 16 29C21.8 27.8 26 24.5 26 19.5V13.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Career Assist Upward Rising Beacon Arrow */}
      <path
        d="M16 14L20.5 18.5H17.5V24.5H14.5V18.5H11.5L16 14Z"
        fill="#FBBF24"
      />
    </svg>
  );
};

export default StudentAssistLogo;
