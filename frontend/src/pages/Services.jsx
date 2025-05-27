import React, { useState } from 'react';
import { FaUserMd, FaHospital, FaAmbulance, FaHeartbeat, FaCapsules, FaWheelchair, FaStethoscope, FaFlask } from 'react-icons/fa';
import { MdLocalPharmacy, MdHealthAndSafety, MdBiotech, MdChildCare, MdPeople, MdPregnantWoman } from 'react-icons/md';
import { RiMentalHealthFill, RiHospitalLine, RiHeartPulseLine } from 'react-icons/ri';
import { GiMedicalDrip, GiMedicines } from 'react-icons/gi';
import { TbDental, TbReportMedical } from 'react-icons/tb';
import { motion } from 'framer-motion';
import './Services.css';

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
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <div className="services-container">
      <div className="services-wrapper">
        <motion.div 
          className="services-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="services-title">
            Our Healthcare Services
          </h1>
          <p className="services-description">
            Comprehensive healthcare solutions designed to provide you with the best medical care and support for your well-being.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="category-filter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="services-grid"
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
                className="service-card"
              >
                <div className="service-content">
                  <div className="service-header">
                    <div
                      className={`service-icon-wrapper ${hoveredService === index ? 'hovered' : ''}`}
                      style={{ 
                        background: `linear-gradient(135deg, ${service.color}15, ${service.color}30)`,
                        color: service.color
                      }}
                    >
                      <service.icon />
                    </div>
                    <h3 className="service-title">
                      {service.title}
                    </h3>
                  </div>

                  <p className="service-description">
                    {service.description}
                  </p>

                  <ul className="features-list">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="feature-item"
                      >
                        <div className="feature-icon">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        </div>
                        <span className="feature-text">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="cta-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="cta-content">
            <div className="cta-background">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="100" fill="rgba(255,255,255,0.1)" />
                <circle cx="100" cy="100" r="70" fill="rgba(255,255,255,0.1)" />
                <circle cx="100" cy="100" r="40" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>
            
            <div className="cta-text">
              <div>
                <h3 className="cta-heading">
                  Need Immediate Medical Attention?
                </h3>
                <p className="cta-description">
                  Our emergency response team is available 24/7 to provide immediate medical assistance.
                  Don't hesitate to reach out.
                </p>
              </div>
              
              <div className="cta-buttons">
                <button className="cta-button cta-button-primary">
                  <FaAmbulance />
                  Call Emergency
                </button>
                <button className="cta-button cta-button-secondary">
                  <FaStethoscope />
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="stats-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="stat-item">
            <div className="stat-icon">
              <MdPeople />
            </div>
            <h4 className="stat-number">50,000+</h4>
            <p className="stat-label">Happy Patients</p>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <FaUserMd />
            </div>
            <h4 className="stat-number">200+</h4>
            <p className="stat-label">Expert Doctors</p>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <FaAmbulance />
            </div>
            <h4 className="stat-number">24/7</h4>
            <p className="stat-label">Emergency Care</p>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <RiHeartPulseLine />
            </div>
            <h4 className="stat-number">98%</h4>
            <p className="stat-label">Success Rate</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;