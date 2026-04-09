"use client";

import { CATEGORY_ORDER, UI_LABELS } from "@/lib/constants";
import type { OutputLanguage, ReviewCategoryEntry } from "@/types/app";

import { CategoryRadarChart } from "@/components/CategoryRadarChart";

interface ReviewSummaryProps {
  categories: ReviewCategoryEntry[];
  language: OutputLanguage;
}

export function ReviewSummary({ categories, language }: ReviewSummaryProps) {
  const ui = UI_LABELS[language];
  const orderedCategories = CATEGORY_ORDER.map((key) => categories.find((category) => category.key === key)).filter(
    (category): category is ReviewCategoryEntry => Boolean(category)
  );

  if (orderedCategories.length === 0) {
    return null;
  }

  return (
    <div className="review-summary">
      <div className="review-summary-header">
        <h4>{ui.categoryOverview}</h4>
      </div>
      <div className="review-summary-body">
        <CategoryRadarChart categories={orderedCategories} language={language} />
      </div>
    </div>
  );
}
