const complianceRules = {
  GDPR: {
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    description: 'EU regulation on data protection and privacy',
    checks: [
      { id: 'gdpr-1', rule: 'Data Processing Agreement', keywords: ['data processing', 'processor', 'controller', 'personal data'], required: true },
      { id: 'gdpr-2', rule: 'Lawful Basis for Processing', keywords: ['lawful basis', 'consent', 'legitimate interest', 'legal obligation'], required: true },
      { id: 'gdpr-3', rule: 'Data Subject Rights', keywords: ['right to access', 'right to erasure', 'data portability', 'right to rectification'], required: true },
      { id: 'gdpr-4', rule: 'Data Breach Notification', keywords: ['data breach', 'breach notification', 'notify', '72 hours'], required: true },
      { id: 'gdpr-5', rule: 'Cross-Border Data Transfer', keywords: ['data transfer', 'standard contractual clauses', 'adequacy decision', 'third country'], required: false },
      { id: 'gdpr-6', rule: 'Data Retention Period', keywords: ['retention', 'data retention', 'deletion', 'destroy'], required: true },
      { id: 'gdpr-7', rule: 'Sub-Processor Controls', keywords: ['sub-processor', 'subprocessor', 'sub-contractor', 'third party processor'], required: false },
      { id: 'gdpr-8', rule: 'Data Protection Impact Assessment', keywords: ['impact assessment', 'dpia', 'privacy impact'], required: false },
    ],
  },
  CCPA: {
    name: 'CCPA',
    fullName: 'California Consumer Privacy Act',
    description: 'California state law enhancing privacy rights for consumers',
    checks: [
      { id: 'ccpa-1', rule: 'Right to Know', keywords: ['right to know', 'disclosure', 'categories of information', 'personal information collected'], required: true },
      { id: 'ccpa-2', rule: 'Right to Delete', keywords: ['right to delete', 'deletion request', 'erase', 'remove personal information'], required: true },
      { id: 'ccpa-3', rule: 'Right to Opt-Out', keywords: ['opt-out', 'do not sell', 'opt out of sale'], required: true },
      { id: 'ccpa-4', rule: 'Non-Discrimination', keywords: ['non-discrimination', 'equal service', 'not discriminate'], required: true },
      { id: 'ccpa-5', rule: 'Service Provider Obligations', keywords: ['service provider', 'business purpose', 'retain use disclose'], required: false },
      { id: 'ccpa-6', rule: 'Privacy Notice', keywords: ['privacy notice', 'privacy policy', 'notice at collection'], required: true },
    ],
  },
  SOX: {
    name: 'SOX',
    fullName: 'Sarbanes-Oxley Act',
    description: 'US federal law on corporate financial reporting and accountability',
    checks: [
      { id: 'sox-1', rule: 'Internal Controls', keywords: ['internal controls', 'financial controls', 'audit controls', 'control procedures'], required: true },
      { id: 'sox-2', rule: 'Record Retention', keywords: ['record retention', 'document retention', 'preserve records', 'retention policy'], required: true },
      { id: 'sox-3', rule: 'Audit Trail', keywords: ['audit trail', 'audit log', 'record keeping', 'documentation'], required: true },
      { id: 'sox-4', rule: 'Whistleblower Protection', keywords: ['whistleblower', 'retaliation', 'anonymous reporting'], required: false },
      { id: 'sox-5', rule: 'Conflict of Interest', keywords: ['conflict of interest', 'independence', 'impartial'], required: false },
    ],
  },
  HIPAA: {
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    description: 'US law protecting sensitive patient health information',
    checks: [
      { id: 'hipaa-1', rule: 'Business Associate Agreement', keywords: ['business associate', 'baa', 'protected health information', 'phi'], required: true },
      { id: 'hipaa-2', rule: 'Safeguards', keywords: ['administrative safeguards', 'physical safeguards', 'technical safeguards', 'security measures'], required: true },
      { id: 'hipaa-3', rule: 'Minimum Necessary', keywords: ['minimum necessary', 'minimum required', 'least privilege'], required: false },
      { id: 'hipaa-4', rule: 'Breach Notification', keywords: ['breach notification', 'notify affected', 'report breach'], required: true },
      { id: 'hipaa-5', rule: 'De-identification', keywords: ['de-identification', 'de-identify', 'anonymize', 'anonymization'], required: false },
    ],
  },
};

export default complianceRules;
