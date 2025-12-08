'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Email address and account credentials',
        'Book reservation and borrowing history',
        'Profile information (role, preferences)',
        'Usage data and interaction with our platform'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our library management services',
        'To manage book reservations and returns',
        'To send important notifications about your reservations',
        'To improve our services and user experience',
        'To ensure security and prevent fraudulent activities'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'All passwords are encrypted using BCrypt hashing',
        'JWT-based authentication for secure sessions',
        'SSL/TLS encryption for data transmission',
        'Regular security audits and updates',
        'Access controls based on user roles'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        'Access your personal information at any time',
        'Request correction of inaccurate data',
        'Delete your account and associated data',
        'Export your reservation history',
        'Opt-out of non-essential communications'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Eye,
      title: 'Data Sharing',
      content: [
        'We do not sell your personal information',
        'Data is only shared with library administrators for management purposes',
        'Third-party services are limited to essential operations only',
        'All data sharing complies with applicable privacy laws'
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: AlertCircle,
      title: 'Cookies & Tracking',
      content: [
        'We use essential cookies for authentication',
        'Session tokens are stored locally for convenience',
        'Analytics cookies help us improve the platform',
        'You can control cookie preferences in your browser'
      ],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-600 mt-4 bg-blue-50 inline-block px-4 py-2 rounded-full border border-blue-200">
            Last updated: November 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-12 border-2 border-purple-200 shadow-xl">
          <CardContent className="pt-8 bg-gradient-to-br from-white to-purple-50">
            <p className="text-gray-700 leading-relaxed text-lg">
              LibraryMS is committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy describes how we collect, use, store, and protect your data when you use our library 
              management system. By using LibraryMS, you agree to the terms outlined in this policy.
            </p>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} className="border-2 border-purple-200 hover:shadow-2xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 bg-gradient-to-r ${section.color} rounded-xl shrink-0 shadow-lg`}>
                    <section.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  </div>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${section.color} mt-2`} />
                      <span className="text-gray-700 flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="space-y-8">
          <Card className="border-2 border-blue-200 shadow-xl">
            <CardContent className="pt-8 bg-gradient-to-br from-blue-50 to-cyan-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to provide you services. 
                We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, 
                and enforce our agreements.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When you delete your account, your personal data will be removed from our active databases within 30 days. 
                However, some information may be retained in backup systems for up to 90 days for security and legal purposes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 shadow-xl">
            <CardContent className="pt-8 bg-gradient-to-br from-green-50 to-emerald-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is not directed to children under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you are a parent or guardian and you are aware that your child has provided us with 
                personal information, please contact us so we can take necessary actions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-xl">
            <CardContent className="pt-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
                Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 shadow-xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <p className="leading-relaxed mb-6 text-orange-50">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-3 bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20">
                <p className="flex items-center gap-2">📧 Email: privacy@libraryms.com</p>
                <p className="flex items-center gap-2">📞 Phone: +1 (555) 123-4567</p>
                <p className="flex items-center gap-2">📍 Address: 123 Library Street, Book City, BC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}