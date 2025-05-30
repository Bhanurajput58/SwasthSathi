import { Link } from 'react-router-dom';
import starIcon from '../../assets/images/Star.png';
import { FaArrowRight } from 'react-icons/fa';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const {
    id,
    name,
    specialization,
    avgRating,
    totalRating,
    photo,
    totalPatients,
    hospital,
  } = doctor;

  return (
    <div className="transform hover:-translate-y-2 transition-all duration-300">
      <div className="bg-white rounded-[35px] shadow-xl hover:shadow-2xl overflow-hidden border border-slate-100">
        <div className="relative">
          <img
            src={photo}
            className="w-full h-[280px] object-cover transition-transform duration-500 hover:scale-110"
            alt={name}
          />
          <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <img src={starIcon} alt="rating" className="w-5 h-5" />
            <span className="font-bold text-[16px] text-[#1e293b]">{avgRating}</span>
            <span className="text-[#64748b] text-[14px]">({totalRating})</span>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-[24px] font-bold text-[#1e293b] mb-4 text-center">
            {name}
          </h2>

          <div className="flex justify-center mb-6">
            <span className="bg-[#e0f2fe] text-[#0ea5e9] px-6 py-2 rounded-full text-[14px] font-semibold">
              {specialization}
            </span>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
            <div className="text-center">
              <p className="text-[14px] text-[#64748b] mb-1">Total Patients</p>
              <p className="text-[18px] font-bold text-[#1e293b]">+{totalPatients}</p>
            </div>
            <div className="text-center">
              <p className="text-[14px] text-[#64748b] mb-1">Hospital</p>
              <p className="text-[18px] font-bold text-[#1e293b]">{hospital}</p>
            </div>
          </div>

          <Link
            to={`/doctors/${id}`}
            className="mt-8 w-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 px-6 rounded-full flex items-center justify-center gap-2 hover:from-[#38bdf8] hover:to-[#0ea5e9] transition-all duration-300 font-bold text-[16px] shadow-lg shadow-sky-200 group"
          >
            View Profile
            <FaArrowRight className="text-[14px] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;