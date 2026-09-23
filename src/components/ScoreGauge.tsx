import React from 'react';
import { ScoreBracket } from '../types/clinical';

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  brackets: ScoreBracket[];
  currentBracket: ScoreBracket;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  maxScore,
  brackets,
  currentBracket,
}) => {
  // Semi-circle gauge geometry
  const radius = 80;
  const strokeWidth = 14;
  const cx = 110;
  const cy = 95;
  const circumference = Math.PI * radius; // Half-circle circumference

  // Normalized score percentage (0 to 1)
  const clampedScore = Math.max(0, Math.min(score, maxScore));
  const ratio = maxScore > 0 ? clampedScore / maxScore : 0;
  const rotationAngle = -180 + ratio * 180; // from -180 (left) to 0 (right)

  // Color mapping by level
  const getColorForLevel = (level: ScoreBracket['level']) => {
    switch (level) {
      case 'minimal':
        return '#0d9488'; // Teal-600
      case 'mild':
        return '#0284c7'; // Sky-600
      case 'moderate':
        return '#d97706'; // Amber-600
      case 'severe':
        return '#e11d48'; // Rose-600
      default:
        return '#64748b';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl">
      <div className="relative w-[220px] h-[125px] overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 220 120"
          className="w-full h-full"
          role="img"
          aria-label={`Klinische score gauge toont ${score} van de ${maxScore} punten, binnen de categorie: ${currentBracket.title}`}
        >
          {/* Background Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Calibrated Bracket Segments */}
          {brackets.map((bracket, i) => {
            const startRatio = bracket.minScore / maxScore;
            const endRatio = bracket.maxScore / maxScore;
            const segLength = (endRatio - startRatio) * circumference;
            const strokeDashoffset = circumference - endRatio * circumference;

            return (
              <path
                key={i}
                d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                fill="none"
                stroke={getColorForLevel(bracket.level)}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segLength} ${circumference}`}
                strokeDashoffset={-startRatio * circumference}
                strokeOpacity={bracket.level === currentBracket.level ? 1 : 0.35}
              />
            );
          })}

          {/* Needle / Pointer */}
          <g transform={`translate(${cx}, ${cy}) rotate(${rotationAngle + 90})`}>
            <polygon
              points="-4,0 4,0 0,-70"
              fill="#0f172a"
              className="drop-shadow-xs"
            />
            <circle cx="0" cy="0" r="7" fill="#0f172a" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Numeric overlay anchored at bottom center */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {score}
            </span>
            <span className="text-xs font-mono text-slate-500 uppercase">
              / {maxScore}
            </span>
          </div>
        </div>
      </div>

      {/* Bracket Level Indicator */}
      <div className="mt-2 text-center">
        <span
          className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
          style={{
            backgroundColor: `${getColorForLevel(currentBracket.level)}15`,
            color: getColorForLevel(currentBracket.level),
          }}
        >
          {currentBracket.title.split('(')[0].trim()}
        </span>
        <p className="text-[11px] font-mono text-slate-500 mt-1">
          Klinisch bereik: {currentBracket.minScore}–{currentBracket.maxScore} ptn
        </p>
      </div>
    </div>
  );
};
