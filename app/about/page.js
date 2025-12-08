'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Eye, Users, Award, TrendingUp, Sparkles, Zap, Heart, Star } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Modern Technology',
      description: 'Built with Next.js, Spring Boot, and MySQL for optimal performance and scalability.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'User-Centric Design',
      description: 'Intuitive interface designed for both librarians and members with role-based access.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'Comprehensive book management with advanced search and reservation features.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      description: 'Regular updates and improvements based on user feedback and modern standards.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { label: 'Books Available', value: '10,000+', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Members', value: '5,000+', icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Daily Reservations', value: '500+', icon: Star, color: 'from-purple-500 to-pink-500' },
    { label: 'Categories', value: '50+', icon: Zap, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            About LibraryMS
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A modern, full-stack library management system designed to revolutionize how libraries manage their collections and serve their communities.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card className="border-2 border-blue-200 hover:shadow-2xl transition-all">
            <CardHeader className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">
                To provide an efficient, user-friendly platform that empowers libraries to manage their resources effectively while delivering an exceptional experience to every member. We believe in making knowledge accessible to everyone through innovative technology.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:shadow-2xl transition-all">
            <CardHeader className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Eye className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">
                To become the leading library management solution that bridges the gap between traditional library services and modern digital expectations. We envision a world where every library, regardless of size, has access to enterprise-grade management tools.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 mb-20 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">By The Numbers</h2>
            <p className="text-blue-100 text-lg">Our impact in the library community</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className={`inline-block p-3 bg-gradient-to-r ${stat.color} rounded-xl mb-3`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What Makes Us Different
            </h2>
            <p className="text-gray-600 text-lg">Innovation meets simplicity</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-purple-200 hover:shadow-2xl transition-all hover:-translate-y-2">
                <CardHeader className="bg-gradient-to-br from-white to-purple-50">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-gray-800">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Built With Modern Technology
            </h2>
          </div>
          <Card className="border-2 border-blue-200">
            <CardContent className="pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="text-3xl mb-2">⚛️</div>
                  <div className="font-bold text-gray-800 mb-1">Frontend</div>
                  <div className="text-sm text-gray-600">Next.js & React</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-3xl mb-2">☕</div>
                  <div className="font-bold text-gray-800 mb-1">Backend</div>
                  <div className="text-sm text-gray-600">Spring Boot & Java</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-3xl mb-2">🗄️</div>
                  <div className="font-bold text-gray-800 mb-1">Database</div>
                  <div className="text-sm text-gray-600">MySQL</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="font-bold text-gray-800 mb-1">Security</div>
                  <div className="text-sm text-gray-600">JWT & Spring Security</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}