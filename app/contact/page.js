'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Thank you for contacting us! We will get back to you within 24-48 hours.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'support@libraryms.com',
      link: 'mailto:support@libraryms.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Library Street, Book City, BC 12345',
      link: 'https://maps.google.com',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Fri: 9:00 AM - 6:00 PM',
      link: null,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
    },
    {
      question: 'How long can I reserve a book?',
      answer: 'You can reserve books for 7, 14, or 21 days depending on your selection.'
    },
    {
      question: 'Can I extend my reservation?',
      answer: 'Yes, you can request an extension through your profile page if the book is not reserved by others.'
    },
    {
      question: 'How do I become a librarian?',
      answer: 'Contact the system administrator or select the "Librarian" role during signup if you have authorization.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-purple-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Send className="h-6 w-6" />
                  Send Us a Message
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status.message && (
                    <div className={`px-4 py-3 rounded-lg flex items-start gap-2 border-2 ${
                      status.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {status.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm font-medium">{status.message}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Name *</label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-2 border-purple-200 h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-2 border-purple-200 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Subject *</label>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="border-2 border-purple-200 h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Message *</label>
                    <textarea
                      name="message"
                      rows="6"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="flex w-full rounded-md border-2 border-purple-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading}>
                    {loading ? 'Sending...' : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-blue-100 to-cyan-100">
                <CardTitle className="text-gray-800">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className={`flex items-start gap-3 p-4 bg-gradient-to-r ${info.color} rounded-xl text-white`}>
                    <info.icon className="h-6 w-6 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold mb-1">{info.title}</div>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-sm hover:underline"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <div className="text-sm">{info.content}</div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Follow Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30">
                    <span className="text-2xl">📘</span>
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30">
                    <span className="text-2xl">🐦</span>
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30">
                    <span className="text-2xl">💼</span>
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30">
                    <span className="text-2xl">📸</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2 border-green-200 hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardTitle className="text-lg text-gray-800">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}