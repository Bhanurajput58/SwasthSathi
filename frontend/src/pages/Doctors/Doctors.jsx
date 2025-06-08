import React, { useState } from 'react';
import DoctorCard from '../../components/Doctors/DoctorCard';
import { FaSearch } from 'react-icons/fa';

const doctorsData = [
  {
    id: 1,
    name: "Dr. Akash Ray",
    specialization: "Cardiologist",
    avgRating: 4.8,
    totalRating: 272,
    photo: "http://localhost:5173/src/assets/images/doctor-img01.png",
    totalPatients: 1500,
    hospital: "City Hospital"
  },
  {
    id: 2,
    name: "Dr. Aman Singh",
    specialization: "Neurologist",
    avgRating: 4.5,
    totalRating: 189,
    photo: "http://localhost:5173/src/assets/images/doctor-img02.png",
    totalPatients: 1200,
    hospital: "General Hospital"
  },
];

const specializations = [
  "All",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedist",
  "Gynecologist"
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-[#1e293b] mb-4">Our Doctors</h1>
        <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
          Find and connect with the best doctors in your area. Book appointments and get expert medical care.
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

          {/* Specialization Filter */}
          <div className="flex gap-1 overflow-x-auto pb-2 w-full md:w-auto">
            {specializations.map((spec) => (
              <button
                key={spec}
                className={`px-6 py-1 rounded-full whitespace-nowrap transition-all duration-300 ${selectedSpecialization === spec
                    ? 'bg-[#0EA5E9] text-black'
                    : 'bg-[#e0f2fe] text-[#0ea5e9] hover:bg-[#bae6fd]'
                  }`}
                onClick={() => setSelectedSpecialization(spec)}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {/* No Results Message */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-[#1e293b] mb-2">No doctors found</h3>
          <p className="text-[#64748b]">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;