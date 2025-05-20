import doctorImg01 from '../assets/images/doctor-img01.png';
import doctorImg02 from '../assets/images/doctor-img02.png';
import doctorImg03 from '../assets/images/doctor-img03.png';

const doctors = [
  {
    id: 1,
    name: 'Dr. Akash Ray',
    specialty: 'Cardiologist',
    location: 'Delhi',
    image: doctorImg01,
    experience: 15,
    rating: 4.8,
    reviews: 120,
    patients: 1500,
    awards: ['Best Cardiologist 2024', 'Lifetime Achievement in Cardiology'],    bio: 'Distinguished cardiologist with expertise in interventional cardiology and complex cardiac procedures. Known for his patient-centric approach.',
    languages: ['English', 'Hindi', 'Bengali'],
    contact: {
      phone: '+91-9876543210',
      email: 'dr.akash.ray@swasthsathi.com',
      whatsapp: 'https://wa.me/919876543210',
    },
    badges: ['Top Rated', 'Most Experienced'],
    map: 'https://goo.gl/maps/xyz',
    reviewsList: [
      { name: 'Amit Kumar', rating: 5, comment: 'Excellent doctor, very caring and knowledgeable.' },
      { name: 'Sunita Rao', rating: 4, comment: 'Helped me recover quickly. Highly recommended!' },
    ],
  },  {
    id: 2,
    name: 'Dr. Aman Singh',
    specialty: 'Neurologist',
    location: 'Mumbai',
    image: doctorImg02,
    experience: 12,
    rating: 4.5,
    reviews: 90,
    patients: 1100,
    awards: ['Excellence in Neurology 2024', 'Research Innovation Award'],    bio: 'Leading neurologist specializing in advanced neurological disorders and brain health. Pioneer in modern neurological treatments.',
    languages: ['English', 'Hindi', 'Punjabi'],
    contact: {
      phone: '+91-9123456780',
      email: 'dr.aman.singh@swasthsathi.com',
      whatsapp: 'https://wa.me/919123456780',
    },
    badges: ['Top Rated'],
    map: 'https://goo.gl/maps/abc',
    reviewsList: [
      { name: 'Priya S.', rating: 5, comment: 'Very professional and friendly.' },
      { name: 'Rahul Jain', rating: 4, comment: 'Solved my skin issues effectively.' },
    ],
  },  {
    id: 3,
    name: 'Dr. Amit Verma',
    specialty: 'Orthopedic Surgeon',
    location: 'Bangalore',
    image: doctorImg03,
    experience: 10,
    rating: 4.7,
    reviews: 105,
    patients: 1300,
    awards: ['Outstanding Orthopedic Surgeon 2024', 'Sports Medicine Excellence Award'],    bio: 'Expert orthopedic surgeon specializing in joint replacements and sports injuries. Known for minimally invasive surgical techniques.',
    languages: ['English', 'Hindi', 'Kannada'],
    contact: {
      phone: '+91-9988776655',
      email: 'dr.amit.verma@swasthsathi.com',
      whatsapp: 'https://wa.me/919988776655',
    },
    badges: ['Most Experienced'],
    map: 'https://goo.gl/maps/def',
    reviewsList: [
      { name: 'Meena P.', rating: 5, comment: 'Great with kids and very patient.' },
      { name: 'Suresh R.', rating: 4, comment: 'Explained everything clearly.' },
    ],
  },
];

export default doctors; 