import React from 'react';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Ensure Link is imported if not already

const Section = ({ number, title, children }: { number: number, title: string, children: React.ReactNode }) => (
  <div className="mb-8 border-b border-white/5 pb-8 last:border-0">
    <h3 className="text-xl font-heading font-bold text-white mb-3 flex items-center">
        <span className="w-6 text-primary text-2xl font-mono mr-3 text-left shrink-0">{number}.</span>
        {title}
    </h3>
    <div className="text-zinc-400 text-sm leading-relaxed space-y-3 pl-4">
        {children}
    </div>
  </div>
);

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-zinc-500 hover:text-white mb-6 transition-colors"
          >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Legal & Privacy
          </h1>
          <p className="text-zinc-400 max-w-2xl">
              Transparency is key. This agreement outlines how we protect your rights, your data, and the rules of our platform.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
             <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Terms of Service
             </span>
             <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center">
                <Lock className="w-3 h-3 mr-1" /> Privacy Policy
             </span>
          </div>
      </div>

      {/* Content Card */}
      <div className="max-w-4xl mx-auto bg-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        
        <div className="relative z-10">
            
            <Section number={1} title="Introduction">
                <p>These <strong>Terms & Conditions and Privacy Policy</strong> (“Agreement”) constitute a legally binding agreement between you (“User”) and <strong>tickets.yadi.app</strong> governing your access and use of our software, website, mobile application, and related services (“Services”).</p>
                <p>By accessing or using the Services, you agree to be bound by this Agreement. If you do not agree, do not access or use the Services.</p>
            </Section>

            <Section number={2} title="Definitions">
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li><strong>“Personal Data”</strong>: Information relating to an identifiable individual, as defined under the **Data Protection Act, 2019 (Kenya)**.</li>
                    <li><strong>“Data Controller”</strong>: Entity determining the purposes and means of personal data processing.</li>
                    <li><strong>“Data Processor”</strong>: Entity processing personal data on behalf of a Data Controller.</li>
                    <li><strong>“Processing”</strong>: Any operation on personal data including collection, storage, use, or deletion.</li>
                </ul>
            </Section>

            <Section number={3} title="Eligibility">
                <p className="mb-2">You represent and warrant that:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li>You are at least 18 years old or have parental/guardian consent.</li>
                    <li>You have the legal capacity to enter into this Agreement.</li>
                    <li>All information provided to the Company is true, accurate, and lawful.</li>
                </ul>
            </Section>
            
            <Section number={4} title="User Obligations">
                <p>You agree to:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li>Comply with all applicable laws, including the **Data Protection Act, 2019**.</li>
                    <li>Maintain confidentiality of your account credentials.</li>
                    <li>Refrain from misuse, unauthorized access, or disruption of the Services.</li>
                    <li>Not upload or transmit harmful, illegal, or infringing content.</li>
                </ul>
            </Section>

            <Section number={5} title="Intellectual Property">
                <p>All content; software, trademarks, logos, and documentation are the property of the Company. Users may not copy, modify, distribute, reverse engineer, or sublicense any Company property.</p>
            </Section>

            <Section number={6} title="Data Collection and Use">
                <p className="mb-2">The Company collects **Personal Data** for lawful purposes, including:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li>Provision and improvement of Services.</li>
                    <li>Account management and authentication.</li>
                    <li>Transaction processing.</li>
                    <li>Legal compliance and fraud detection.</li>
                </ul>
                <p className="mt-2">Lawful bases include consent, contractual necessity, legal obligations, or legitimate interests.</p>
            </Section>

            <Section number={7} title="Data Sharing and Security">
                <p>Data may be shared with authorized employees, service providers, or regulatory authorities where legally required. **Data is not sold**.</p>
                <p className="mt-2">The Company implements reasonable technical, administrative, and organizational measures to protect Personal Data from unauthorized access, disclosure, or destruction.</p>
            </Section>
            
            <Section number={8} title="Data Retention">
                <p>Personal Data will be retained only for as long as necessary for the purpose collected or as required by law. Data will be securely deleted or anonymized thereafter.</p>
            </Section>

            <Section number={9} title="User Rights (Data Protection Act, 2019)">
                <p>Under the Data Protection Act, 2019, Users have rights to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">Access, correct, or delete personal data</div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">Withdraw consent & Object to processing</div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">Restrict processing & Request data portability</div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center md:col-span-2">Lodge complaints with the **Office of the Data Protection Commissioner (ODPC)**</div>
                </div>
            </Section>

            <Section number={10} title="Limitation of Liability">
                <p>To the fullest extent permitted by law, the Company is not liable for indirect, incidental, or consequential damages. The Company does not guarantee uninterrupted or error-free service. Users are responsible for securing their accounts and complying with this Agreement.</p>
            </Section>

            <Section number={11} title="Indemnity">
                <p>Users agree to indemnify and hold the Company, its officers, and employees harmless from claims, damages, or liabilities arising from:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li>Violation of this Agreement.</li>
                    <li>Misuse of the Services.</li>
                    <li>Infringement of third-party rights.</li>
                </ul>
            </Section>
            
            <Section number={12} title="Termination">
                <p>The Company may suspend or terminate access for breach of this Agreement, fraudulent or unlawful activity, or security compromise. Users may request account termination at any time.</p>
            </Section>
            
            <Section number={13} title="Governing Law and Dispute Resolution">
                <p>This Agreement is governed by the laws of **Kenya**, including the **Data Protection Act, 2019**. Disputes will be resolved amicably, and if unresolved, submitted to Kenyan courts with competent jurisdiction.</p>
            </Section>
            
            <Section number={14} title="Modifications">
                <p>The Company may update this Agreement periodically. Continued use of Services constitutes acceptance of any modifications.</p>
            </Section>
            
            <div className="pt-4 text-center">
                <p className="text-xs text-zinc-600">Last Updated: November 2025</p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;