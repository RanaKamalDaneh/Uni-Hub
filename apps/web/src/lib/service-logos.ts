/**
 * Visual identity for each service card.
 * - `logos`: technology logos from /public/logos (Devicon, MIT) — up to 2 are shown.
 * - `icon`: a Lucide icon name for services without a technology logo (research, reports, tutoring…).
 * - `brand`: icon + official brand colour for technologies whose logo is not redistributable here.
 * Keys are service slugs: `${categorySlug}-${subcategorySlug}`.
 */
export type ServiceVisual =
  | { logos: string[] }
  | { icon: string }
  | { brand: 'excel' | 'powerbi' | 'tableau' | 'cisco' };

const L = (...logos: string[]): ServiceVisual => ({ logos });
const I = (icon: string): ServiceVisual => ({ icon });
const B = (brand: 'excel' | 'powerbi' | 'tableau' | 'cisco'): ServiceVisual => ({ brand });

export const SERVICE_VISUALS: Record<string, ServiceVisual> = {
  // Programming
  'programming-python': L('python'),
  'programming-java': L('java'),
  'programming-cpp': L('cplusplus'),
  'programming-csharp': L('csharp'),
  'programming-javascript': L('javascript'),
  'programming-php': L('php'),
  'programming-html-css': L('html5', 'css3'),
  'programming-react': L('react'),
  'programming-nextjs': L('nextjs'),
  'programming-full-stack': L('react', 'nodejs'),
  'programming-backend': L('django', 'spring'),
  'programming-frontend': L('react', 'vuejs'),
  'programming-mobile': L('flutter', 'kotlin'),
  'programming-flutter': L('flutter'),
  'programming-android': L('android'),
  'programming-code-review': L('git'),
  'programming-software-docs': L('markdown'),
  'programming-software-engineering': L('jira'),

  // Artificial Intelligence
  'artificial-intelligence-machine-learning': L('scikitlearn'),
  'artificial-intelligence-deep-learning': L('pytorch', 'tensorflow'),
  'artificial-intelligence-nlp': I('Languages'),
  'artificial-intelligence-computer-vision': L('opencv'),
  'artificial-intelligence-generative-ai': I('Sparkles'),
  'artificial-intelligence-llm': I('BrainCircuit'),
  'artificial-intelligence-chatbots': I('Bot'),
  'artificial-intelligence-recommendation': I('ThumbsUp'),
  'artificial-intelligence-sentiment': I('Smile'),
  'artificial-intelligence-text-classification': I('Tags'),
  'artificial-intelligence-image-classification': L('pytorch'),
  'artificial-intelligence-object-detection': I('ScanEye'),
  'artificial-intelligence-preprocessing': L('pandas'),
  'artificial-intelligence-feature-engineering': L('numpy'),
  'artificial-intelligence-model-evaluation': L('matplotlib'),
  'artificial-intelligence-explainability': I('Lightbulb'),
  'artificial-intelligence-ai-research': L('latex'),
  'artificial-intelligence-model-deployment': L('docker', 'fastapi'),
  'artificial-intelligence-ai-prototyping': L('streamlit'),

  // Data Science
  'data-science-data-analysis': L('jupyter'),
  'data-science-data-cleaning': L('pandas'),
  'data-science-eda': L('matplotlib'),
  'data-science-statistical-analysis': L('spss'),
  'data-science-python-analysis': L('python'),
  'data-science-r-programming': L('r'),
  'data-science-excel': B('excel'),
  'data-science-power-bi': B('powerbi'),
  'data-science-tableau': B('tableau'),
  'data-science-visualization': L('plotly'),
  'data-science-predictive': L('scikitlearn'),
  'data-science-bi': B('powerbi'),
  'data-science-data-mining': I('Pickaxe'),
  'data-science-dataset-prep': L('numpy'),
  'data-science-data-reporting': I('FileBarChart'),

  // Database
  'database-db-design': I('Database'),
  'database-erd': I('Workflow'),
  'database-eer': I('Network'),
  'database-sql': I('SquareTerminal'),
  'database-mysql': L('mysql'),
  'database-oracle': L('oracle'),
  'database-normalization': I('Table2'),
  'database-dba': I('ShieldCheck'),
  'database-query-optimization': I('Gauge'),
  'database-migration': I('ArrowRightLeft'),
  'database-stored-procedures': I('Cog'),
  'database-db-docs': I('BookText'),
  'database-db-projects': L('mysql', 'oracle'),

  // Research & Master's Support
  'research-topic-exploration': I('Compass'),
  'research-proposal-review': I('FileSearch'),
  'research-research-questions': I('CircleHelp'),
  'research-objectives-review': I('Target'),
  'research-methodology': I('Microscope'),
  'research-literature-review': I('Library'),
  'research-paper-analysis': I('FileText'),
  'research-research-gap': I('SearchCheck'),
  'research-research-design': I('PencilRuler'),
  'research-questionnaire': I('ClipboardList'),
  'research-survey-analysis': I('PieChart'),
  'research-research-statistics': L('spss'),
  'research-hypothesis-testing': I('Sigma'),
  'research-results-interpretation': I('LineChart'),
  'research-writing-review': I('PenLine'),
  'research-thesis-formatting': L('latex'),
  'research-citation-management': I('Quote'),
  'research-reference-verification': I('BadgeCheck'),
  'research-research-presentation': I('Presentation'),
  'research-journal-selection': I('Newspaper'),
  'research-paper-structure': I('LayoutList'),

  // Graduation Projects
  'graduation-projects-planning': L('trello'),
  'graduation-projects-idea-development': I('Lightbulb'),
  'graduation-projects-requirements': I('ClipboardList'),
  'graduation-projects-proposal-review': I('FileCheck'),
  'graduation-projects-web-prototype': L('react', 'figma'),
  'graduation-projects-mobile-prototype': L('flutter'),
  'graduation-projects-ai-projects': L('pytorch'),
  'graduation-projects-data-science-projects': L('jupyter'),
  'graduation-projects-database-projects': L('mysql', 'oracle'),
  'graduation-projects-documentation': I('BookOpen'),
  'graduation-projects-testing': L('selenium'),
  'graduation-projects-presentation': L('canva'),
  'graduation-projects-defense': I('Mic'),
  'graduation-projects-code-explanation': L('vscode'),

  // Reports & Documentation
  'reports-technical': I('FileCode2'),
  'reports-scientific': I('FlaskConical'),
  'reports-business': I('Briefcase'),
  'reports-data-analysis-reports': I('FileBarChart'),
  'reports-project-docs': L('confluence'),
  'reports-srs': I('FileCheck2'),
  'reports-sdd': I('Blocks'),
  'reports-user-manuals': I('BookOpen'),
  'reports-technical-presentations': I('Presentation'),
  'reports-excel-reports': B('excel'),
  'reports-power-bi-reports': B('powerbi'),
  'reports-research-presentations': L('canva'),

  // Tutoring
  'tutoring-programming': L('python', 'java'),
  'tutoring-database': L('mysql'),
  'tutoring-ai': I('BrainCircuit'),
  'tutoring-machine-learning': L('scikitlearn'),
  'tutoring-statistics': L('spss'),
  'tutoring-research-methodology': I('Microscope'),
  'tutoring-data-analysis': L('jupyter'),
  'tutoring-online-sessions': I('Video'),
  'tutoring-project-explanation': L('vscode'),
  'tutoring-course-support': I('GraduationCap'),
};
