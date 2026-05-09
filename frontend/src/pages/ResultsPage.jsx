import { useState, useEffect } from 'react';
import ResultsHeader from '../components/ResultsHeader';
import ResultsSidebar from '../components/ResultsSidebar';
import ExecutiveSummary from '../components/ExecutiveSummary';
import KeyTermsTable from '../components/KeyTermsTable';
import ObligationsTracker from '../components/ObligationsTracker';
import RiskFlags from '../components/RiskFlags';
import KeyDatesTimeline from '../components/KeyDatesTimeline';
import FinancialTerms from '../components/FinancialTerms';

const sectionIds = ['summary', 'terms', 'obligations', 'risks', 'dates', 'financial'];

export default function ResultsPage({ data, filename, onReset }) {
  const [activeSection, setActiveSection] = useState('summary');

  useEffect(() => {
    function handleScroll() {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ResultsHeader data={data} filename={filename} onReset={onReset} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        <ResultsSidebar activeSection={activeSection} />

        <div className="flex-1 min-w-0 space-y-6">
          <ExecutiveSummary
            summary={data.executive_summary}
            parties={data.parties}
            riskExplanation={data.risk_score_explanation}
          />
          <KeyTermsTable terms={data.key_terms} />
          <ObligationsTracker obligations={data.obligations} />
          <RiskFlags risks={data.risk_flags} />
          <KeyDatesTimeline dates={data.key_dates} />
          <FinancialTerms terms={data.financial_terms} />
        </div>
      </div>
    </>
  );
}
