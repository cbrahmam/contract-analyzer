import { useState, useEffect, useMemo } from 'react';
import ResultsHeader from '../components/ResultsHeader';
import ResultsSidebar from '../components/ResultsSidebar';
import ExecutiveSummary from '../components/ExecutiveSummary';
import KeyTermsTable from '../components/KeyTermsTable';
import ObligationsTracker from '../components/ObligationsTracker';
import RiskFlags from '../components/RiskFlags';
import KeyDatesTimeline from '../components/KeyDatesTimeline';
import FinancialTerms from '../components/FinancialTerms';
import ClauseChecklist from '../components/ClauseChecklist';
import ContractChat from '../components/ContractChat';
import FilterSortControls, { applyFiltersAndSort } from '../components/FilterSortControls';
import GlossaryPanel from '../components/GlossaryPanel';
import ComplianceChecker from '../components/ComplianceChecker';
import NotesPanel from '../components/NotesPanel';
import SearchBar from '../components/SearchBar';
import { exportAllCsv } from '../utils/exportCsv';
import exportPdf from '../utils/exportPdf';

const sectionIds = ['summary', 'terms', 'obligations', 'risks', 'dates', 'financial'];

function matchesQuery(text, query) {
  return text.toLowerCase().includes(query.toLowerCase());
}

export default function ResultsPage({ data, filename, onReset }) {
  const [activeSection, setActiveSection] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ severity: 'all', priority: 'all', sort: 'default' });

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

  const filtered = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery;
    return {
      ...data,
      key_terms: data.key_terms.filter(t => matchesQuery(t.term, q) || matchesQuery(t.summary, q)),
      obligations: data.obligations.filter(o => matchesQuery(o.description, q) || matchesQuery(o.party, q)),
      risk_flags: data.risk_flags.filter(r => matchesQuery(r.risk, q) || matchesQuery(r.description, q) || matchesQuery(r.recommendation, q)),
      key_dates: data.key_dates.filter(d => matchesQuery(d.date, q) || matchesQuery(d.description, q)),
      financial_terms: data.financial_terms.filter(f => matchesQuery(f.item, q) || matchesQuery(f.amount, q) || matchesQuery(f.conditions, q)),
    };
  }, [data, searchQuery]);

  const finalData = useMemo(() => applyFiltersAndSort(filtered, filters), [filtered, filters]);

  const totalResults = searchQuery
    ? filtered.key_terms.length + filtered.obligations.length + filtered.risk_flags.length + filtered.key_dates.length + filtered.financial_terms.length
    : null;

  return (
    <>
      <ResultsHeader data={data} filename={filename} onReset={onReset} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        <ResultsSidebar activeSection={activeSection} />

        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <button
              onClick={() => exportPdf(data, filename)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              PDF Report
            </button>
            <button
              onClick={() => exportAllCsv(data, filename)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm font-medium transition-colors border border-navy-700 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v.75" />
              </svg>
              CSV Export
            </button>
          </div>

          <FilterSortControls filters={filters} onFilterChange={setFilters} />

          {searchQuery && (
            <p className="text-sm text-slate-500">
              {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}

          <ExecutiveSummary
            summary={finalData.executive_summary}
            parties={finalData.parties}
            riskExplanation={finalData.risk_score_explanation}
          />
          <KeyTermsTable terms={finalData.key_terms} />
          <ObligationsTracker obligations={finalData.obligations} />
          <RiskFlags risks={finalData.risk_flags} />
          <KeyDatesTimeline dates={finalData.key_dates} />
          <FinancialTerms terms={finalData.financial_terms} />
          <ClauseChecklist documentType={data.document_type} keyTerms={data.key_terms} />
          <ComplianceChecker data={data} />
          <GlossaryPanel data={data} />
          <NotesPanel filename={filename} />
        </div>
      </div>
      <ContractChat filename={filename} />
    </>
  );
}
