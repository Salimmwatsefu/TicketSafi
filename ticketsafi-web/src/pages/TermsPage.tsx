import React from 'react';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8 border-b border-white/5 pb-8 last:border-0">
    <h3 className="text-xl font-heading font-bold text-white mb-3 flex items-center">
        <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
        {title}
    </h3>
    <div className="text-zinc-400 text-sm leading-relaxed space-y-2 pl-4">
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
             <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold flex items-center">
                <FileText className="w-3 h-3 mr-1" /> Kenya Data Protection Act 2019
             </span>
          </div>
      </div>

      {/* Content Card */}
      <div className="max-w-4xl mx-auto bg-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
            
            <Section title="1. Introduction">
                <p>These Terms & Conditions and Privacy Policy (“Agreement”) constitute a legally binding agreement between you (“User”) and <strong>tickets.yadi.app</strong> governing your access and use of our software, website, mobile application, and related services (“Services”). By accessing or using the Services, you agree to be bound by this Agreement. If you do not agree, do not access or use the Services.</p>
            </Section>

            <Section title="2. Definitions">
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li><strong>“Personal Data”</strong>: Information relating to an identifiable individual, as defined under the Data Protection Act, 2019 (Kenya).</li>
                    <li><strong>“Data Controller”</strong>: Entity determining the purposes and means of personal data processing.</li>
                    <li><strong>“Data Processor”</strong>: Entity processing personal data on behalf of a Data Controller.</li>
                    <li><strong>“Processing”</strong>: Any operation on personal data including collection, storage, use, or deletion.</li>
                </ul>
            </Section>

            <Section title="3. Eligibility & User Obligations">
                <p className="mb-2">You represent and warrant that you are at least 18 years old or have parental/guardian consent, have the legal capacity to enter into this Agreement, and that all information provided is true, accurate, and lawful.</p>
                <p><strong>You agree to:</strong></p>
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li>Comply with all applicable laws, including the Data Protection Act, 2019.</li>
                    <li>Maintain confidentiality of your account credentials.</li>
                    <li>Refrain from misuse, unauthorized access, or disruption of the Services.</li>
                    <li>Not upload or transmit harmful, illegal, or infringing content.</li>
                </ul>
            </Section>

            <Section title="4. Intellectual Property">
                <p>All content, software, trademarks, logos, and documentation are the property of the Company. Users may not copy, modify, distribute, reverse engineer, or sublicense any Company property without express written consent.</p>
            </Section>

            <Section title="5. Data Collection & Use">
                <p className="mb-2">We collect Personal Data for lawful purposes, including:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                    <li>Provision and improvement of Services.</li>
                    <li>Account management and authentication.</li>
                    <li>Transaction processing (e.g., M-Pesa integration).</li>
                    <li>Fraud detection and security compliance.</li>
                </ul>
                <p className="mt-2 text-xs text-zinc-500">Lawful bases include consent, contractual necessity, legal obligations, or legitimate interests.</p>
            </Section>

            <Section title="6. Data Sharing & Security">
                <p>Data may be shared with authorized employees, service providers (e.g., payment processors), or regulatory authorities where legally required. <strong>Data is never sold.</strong></p>
                <p className="mt-2">We implement reasonable technical, administrative, and organizational measures to protect Personal Data from unauthorized access, disclosure, or destruction.</p>
            </Section>

            <Section title="7. User Rights (Data Protection Act, 2019)">
                <p>Under Kenyan law, you have the right to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">Access & Correct Data</div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">Withdraw Consent</div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">Request Deletion</div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">Lodge Complaints (ODPC)</div>
                </div>
            </Section>

            <Section title="8. Limitation of Liability & Indemnity">
                <p>To the fullest extent permitted by law, the Company is not liable for indirect, incidental, or consequential damages. The Company does not guarantee uninterrupted or error-free service.</p>
                <p className="mt-2">Users agree to indemnify and hold the Company harmless from claims arising from violation of this Agreement, misuse of Services, or infringement of third-party rights.</p>
            </Section>

            <Section title="9. Termination & Modifications">
                <p>The Company may suspend or terminate access for breach of this Agreement, fraudulent activity, or security compromise. Users may request account termination at any time.</p>
                <p className="mt-2">We may update this Agreement periodically. Continued use of Services constitutes acceptance of any modifications.</p>
            </Section>

            <Section title="10. Governing Law">
                <p>This Agreement is governed by the laws of <strong>Kenya</strong>. Disputes will be resolved amicably, and if unresolved, submitted to Kenyan courts with competent jurisdiction.</p>
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