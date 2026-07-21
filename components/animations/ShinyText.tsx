import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = ''
}) => {
  return (
    <span
      className={`inline-block relative text-slate-400 bg-clip-text font-semibold ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(15, 23, 42, 1) 40%, rgba(99, 102, 241, 1) 50%, rgba(15, 23, 42, 1) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
      }}
    >
      <style>{`
        @keyframes shine {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      {text}
    </span>
  );
};
