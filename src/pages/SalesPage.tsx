import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Clock, Users, FileText, BarChart, Heart, Stethoscope } from 'lucide-react';

export default function SalesPage() {
  const features = [
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security and compliance for protected health information'
    },
    {
      icon: Clock,
      title: 'Streamlined Workflow',
      description: 'Reduce administrative burden with automated referral processing'
    },
    {
      icon: Users,
      title: 'Care Coordination',
      description: 'Seamless communication between providers, staff, and specialists'
    },
    {
      icon: BarChart,
      title: 'Analytics & Insights',
      description: 'Track referral patterns and optimize patient care pathways'
    }
  ];

  const stats = [
    { value: '35%', label: 'Reduction in referral leakage' },
    { value: '50%', label: 'Less administrative time' },
    { value: '24hr', label: 'Average referral processing' },
    { value: '98%', label: 'Patient satisfaction' }
  ];

  const benefits = [
    'Centralized referral management across your healthcare network',
    'Real-time tracking and status updates for every referral',
    'Automated insurance verification and prior authorization',
    'Secure document sharing and communication',
    'Custom workflows for different specialties and locations',
    'Comprehensive analytics and reporting dashboard'
  ];

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">Referral MD</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-500 hover:text-gray-900">Sign In</Link>
              <Link to="/signup" className="btn-primary">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 bg-gradient-to-b from-primary/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Modernize Your Healthcare Referral Management
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              A comprehensive platform that streamlines referrals, reduces leakage, and improves care coordination across your healthcare network.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/signup" className="btn-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#demo" className="btn-secondary">
                Request Demo
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Built for Healthcare Providers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A complete solution designed to meet the unique needs of healthcare organizations.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Transform Your Referral Process
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Join leading healthcare providers who have revolutionized their referral management with our platform.
              </p>
              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute -inset-4">
                  <div className="w-full h-full mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-primary to-primary-dark"></div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                  alt="Healthcare dashboard"
                  className="relative rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              See Referral MD in Action
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Schedule a personalized demo to see how Referral MD can transform your referral management process.
            </p>
            <form className="mt-8 sm:flex justify-center">
              <input
                type="email"
                placeholder="Enter your work email"
                className="block w-full sm:max-w-xs rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <button type="submit" className="mt-3 sm:mt-0 sm:ml-3 btn-primary">
                Request Demo
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to streamline your referrals?</span>
            <span className="block text-white/90">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup" className="btn-primary bg-white text-primary hover:bg-gray-50">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}