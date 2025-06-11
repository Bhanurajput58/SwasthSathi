import { Link } from 'react-router-dom';
import starIcon from '../../assets/images/Star.png';
import { FaArrowRight, FaUserMd } from 'react-icons/fa';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const {
    _id,
    name,
    specialization,
    avgRating,
    totalRating,
    photo,
    totalPatients,
    hospital,
  } = doctor;

  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (url.startsWith('data:image')) return true;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <div>
      <div className="bg-white rounded-[35px] shadow-xl overflow-hidden border border-slate-100">
        <div className="relative">
          {photo && isValidImageUrl(photo) ? (
            <img
              src={photo}
              className="w-full h-[280px] object-cover"
              alt={name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = null;
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-[280px] bg-slate-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-[280px] bg-slate-100 flex items-center justify-center">
              <FaUserMd className="w-16 h-16 text-slate-400" />
            </div>
          )}
          <div className="absolute top-6 right-6 bg-white px-1 py-1 rounded-full shadow-lg flex items-center gap-1.5">
            <img src={starIcon} alt="rating" className="w-2 h-2" />
            <span className="font-bold text-[14px] text-[#1e293b]">{avgRating || '4.8'}</span>
            <span className="text-[#64748b] text-[12px]">({totalRating || '0'})</span>
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
              <p className="text-[18px] font-bold text-[#1e293b]">+{totalPatients || '0'}</p>
            </div>
            <div className="text-center">
              <p className="text-[14px] text-[#64748b] mb-1">Hospital</p>
              <p className="text-[18px] font-bold text-[#1e293b]">{hospital || 'Not specified'}</p>
            </div>
          </div>

          <Link
            to={`/patient/doctors/${_id}`}
            className="mt-8 w-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 px-6 rounded-full flex items-center justify-center gap-2 font-bold text-[16px] shadow-lg shadow-sky-200"
          >
            View Profile
            <FaArrowRight className="text-[14px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;