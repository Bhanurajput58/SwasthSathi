import React, { useState } from 'react';
import { FaUserMd, FaHospital, FaAmbulance, FaHeartbeat, FaCapsules, FaWheelchair, FaStethoscope, FaFlask } from 'react-icons/fa';
import { MdLocalPharmacy, MdHealthAndSafety, MdBiotech, MdChildCare, MdPeople, MdPregnantWoman } from 'react-icons/md';
import { RiMentalHealthFill, RiHospitalLine, RiHeartPulseLine } from 'react-icons/ri';
import { GiMedicalDrip, GiMedicines } from 'react-icons/gi';
import { TbDental, TbReportMedical } from 'react-icons/tb';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'emergency', name: 'Emergency' },
  { id: 'consultation', name: 'Consultation' },
  { id: 'diagnostic', name: 'Diagnostic' },
  { id: 'specialized', name: 'Specialized Care' },
];

const servicesList = [
  {
    icon: FaAmbulance,
    title: "24/7 Emergency Care",
    description: "Round-the-clock emergency medical services with rapid response teams and fully equipped ambulances.",
    features: [
      "Immediate medical attention",
      "Advanced life support ambulances",
      "Expert emergency response team",
      "Real-time tracking of ambulance",
      "Critical care specialists"
    ],
    color: "#DC2626",
    category: "emergency"
  },  {
    icon: FaUserMd,
    title: "Expert Doctor Consultation",
    description: "Connect with experienced doctors across various specialties for personalized medical care.",
    features: [
      "Video consultations",
      "In-person appointments",
      "Specialist referrals",
      "Follow-up care",
      "Digital prescription"
    ],
    color: "#0EA5E9",
    category: "consultation"
  },  {
    icon: MdLocalPharmacy,
    title: "Pharmacy Services",
    description: "Convenient access to medicines with doorstep delivery and automatic refill reminders.",
    features: [
      "24/7 pharmacy access",
      "Home delivery of medicines",
      "Generic alternatives",
      "Prescription management",
      "Medicine reminders"
    ],
    color: "#10B981",
    category: "specialized"
  },
  {
    icon: FaHeartbeat,
    title: "Preventive Health Checkups",
    description: "Comprehensive health screening packages for early detection and prevention.",
    features: [
      "Full body check-up",
      "Cardiac screening",
      "Cancer screening",
      "Customized health packages"
    ],
    color: "#F97316"
  },  {
    icon: MdBiotech,
    title: "Laboratory Services",
    description: "State-of-the-art diagnostic testing with home sample collection facility.",
    features: [
      "Home sample collection",
      "Digital reports",
      "Quick turnaround time",
      "Regular health monitoring",
      "Advanced diagnostics"
    ],
    color: "#6366F1",
    category: "diagnostic"
  },
  {
    icon: RiHospitalLine,
    title: "Hospital Network",
    description: "Access to our network of premium hospitals and healthcare facilities across the country.",
    features: [
      "Multi-specialty hospitals",
      "Priority admission",
      "Cashless treatment",
      "Inter-hospital transfer",
      "International facilities"
    ],
    color: "#0369A1",
    category: "specialized"
  },
  {
    icon: MdPregnantWoman,
    title: "Maternity Care",
    description: "Comprehensive maternity care services from pregnancy planning to postnatal support.",
    features: [
      "Prenatal care programs",
      "Birthing facilities",
      "Postnatal support",
      "Lactation consulting",
      "Parenting workshops"
    ],
    color: "#D946EF",
    category: "specialized"
  },
  {
    icon: FaFlask,
    title: "Genetic Testing",
    description: "Advanced genetic testing and counseling for preventive healthcare and personalized treatment.",
    features: [
      "DNA sequencing",
      "Genetic counseling",
      "Hereditary testing",
      "Prenatal screening",
      "Personalized medicine"
    ],
    color: "#14B8A6",
    category: "diagnostic"
  },
  {
    icon: RiMentalHealthFill,
    title: "Mental Health Care",
    description: "Professional mental health support with licensed therapists and counselors.",
    features: [
      "Online counseling",
      "Therapy sessions",
      "Stress management",
      "Mental wellness programs"
    ],
    color: "#8B5CF6"
  },
  {
    icon: MdChildCare,
    title: "Child Care Services",
    description: "Specialized pediatric care and child development programs.",
    features: [
      "Pediatric consultations",
      "Vaccination services",
      "Growth monitoring",
      "Child nutrition guidance"
    ],
    color: "#EC4899"
  },
  {
    icon: TbDental,
    title: "Dental Care",
    description: "Complete dental care solutions from routine check-ups to advanced procedures.",
    features: [
      "Dental check-ups",
      "Advanced treatments",
      "Cosmetic dentistry",
      "Dental emergencies"
    ],
    color: "#14B8A6"
  },
  {
    icon: GiMedicalDrip,
    title: "Home Healthcare",
    description: "Professional medical care services in the comfort of your home.",
    features: [
      "Nursing care",
      "Physiotherapy",
      "Medical equipment",
      "Post-surgery care"
    ],
    color: "#F43F5E"
  }
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredService, setHoveredService] = useState(null);  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-6">
            Our Healthcare Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive healthcare solutions designed to provide you with the best medical care and support for your well-being.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105
                ${selectedCategory === category.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {servicesList
            .filter(service => selectedCategory === 'all' || service.category === selectedCategory)
            .map((service, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredService(index)}
              onHoverEnd={() => setHoveredService(null)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transform transition-all duration-300 ${
                      hoveredService === index ? 'scale-110 rotate-6' : ''
                    }`}
                    style={{ 
                      background: `linear-gradient(135deg, ${service.color}15, ${service.color}30)`,
                      color: service.color
                    }}
                  >
                    <service.icon />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                    {service.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {service.description}
                </p>                <ul className="space-y-1">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center text-xs text-gray-600"
                    >
                      <div className="mr-1.5 text-emerald-500 flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </div>
                      <span className="line-clamp-1">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>        {/* CTA Section */}
        <motion.div 
          className="mt-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 md:p-16">
            <div className="absolute top-0 right-0 -mt-16 -mr-16">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="100" fill="rgba(255,255,255,0.1)" />
                <circle cx="100" cy="100" r="70" fill="rgba(255,255,255,0.1)" />
                <circle cx="100" cy="100" r="40" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Need Immediate Medical Attention?
                </h3>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
                  Our emergency response team is available 24/7 to provide immediate medical assistance. Don't hesitate to reach out.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  <FaAmbulance className="text-xl" />
                  Call Emergency
                </button>
                <button className="px-8 py-4 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  <FaStethoscope className="text-xl" />
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { number: '50,000+', label: 'Happy Patients', icon: MdPeople },
            { number: '200+', label: 'Expert Doctors', icon: FaUserMd },
            { number: '24/7', label: 'Emergency Care', icon: FaAmbulance },
            { number: '98%', label: 'Success Rate', icon: RiHeartPulseLine }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 flex justify-center">
                <stat.icon className="text-4xl text-blue-600" />
              </div>
              <h4 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h4>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;