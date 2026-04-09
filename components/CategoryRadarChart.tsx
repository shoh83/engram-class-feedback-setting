"use client";

import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/constants";
import type { OutputLanguage, ReviewCategoryEntry } from "@/types/app";

interface CategoryRadarChartProps {
  categories: ReviewCategoryEntry[];
  language: OutputLanguage;
}

const CHART_SIZE = 320;
const CENTER = CHART_SIZE / 2;
const RADIUS = 104;
const LABEL_RADIUS = 138;
const RING_COUNT = 3;
const SCORE_MAX = 5;

const GRADE_TO_SCORE: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1
};

type LabelAnchor = "start" | "middle" | "end";

function getPoint(angle: number, distance: number) {
  return {
    x: CENTER + Math.cos(angle) * distance,
    y: CENTER + Math.sin(angle) * distance
  };
}

function toPoints(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
}

export function CategoryRadarChart({ categories, language }: CategoryRadarChartProps) {
  const orderedCategories = CATEGORY_ORDER.map((key) => categories.find((category) => category.key === key)).filter(
    (category): category is ReviewCategoryEntry => Boolean(category?.grade)
  );

  if (orderedCategories.length !== CATEGORY_ORDER.length) {
    return null;
  }

  const labels = CATEGORY_LABELS[language];
  const angles = CATEGORY_ORDER.map((_, index) => -Math.PI / 2 + (index * Math.PI * 2) / CATEGORY_ORDER.length);

  const rings = Array.from({ length: RING_COUNT }, (_, index) => {
    const ratio = (index + 1) / RING_COUNT;
    const points = angles.map((angle) => getPoint(angle, RADIUS * ratio));
    return toPoints(points);
  });

  const axisLines = angles.map((angle) => ({
    start: getPoint(angle, 0),
    end: getPoint(angle, RADIUS)
  }));

  const labelPoints = CATEGORY_ORDER.map((key, index) => {
    const point = getPoint(angles[index], LABEL_RADIUS);
    const isLeft = point.x < CENTER - 8;
    const isRight = point.x > CENTER + 8;

    return {
      key,
      label: labels[key],
      x: point.x,
      y: point.y,
      anchor: (isLeft ? "end" : isRight ? "start" : "middle") as LabelAnchor
    };
  });

  const dataPolygon = toPoints(
    CATEGORY_ORDER.map((key, index) => {
      const category = orderedCategories.find((item) => item.key === key)!;
      const score = GRADE_TO_SCORE[category.grade ?? ""] ?? 1;
      return getPoint(angles[index], (score / SCORE_MAX) * RADIUS);
    })
  );

  return (
    <div className="radar-chart-shell" aria-label={language === "korean" ? "영역별 평가 레이더 차트" : "Category evaluation radar chart"}>
      <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} className="radar-chart" role="img">
        {rings.map((points, index) => (
          <polygon key={index} points={points} className="radar-ring" />
        ))}
        {axisLines.map((line, index) => (
          <line
            key={index}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            className="radar-axis"
          />
        ))}
        <polygon points={dataPolygon} className="radar-area" />
        <polygon points={dataPolygon} className="radar-outline" />
        {CATEGORY_ORDER.map((key, index) => {
          const category = orderedCategories.find((item) => item.key === key)!;
          const score = GRADE_TO_SCORE[category.grade ?? ""] ?? 1;
          const point = getPoint(angles[index], (score / SCORE_MAX) * RADIUS);

          return <circle key={key} cx={point.x} cy={point.y} r="4" className="radar-point" />;
        })}
        {labelPoints.map((point) => (
          <text
            key={point.key}
            x={point.x}
            y={point.y}
            textAnchor={point.anchor}
            dominantBaseline="middle"
            className="radar-label"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
