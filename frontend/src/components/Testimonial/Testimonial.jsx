import React from 'react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import patientAvatar from '../../assets/images/patient-avatar.png';
import { HiStar } from 'react-icons/hi';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    review: "SwasthSathi made finding the right doctor so easy. The video consultation was smooth, and the doctor was very attentive. Highly recommend their services!",
    specialty: "Cardiology",
    date: "2 weeks ago"
  },
  {
    name: "Rahul Verma",
    location: "Mumbai",
    rating: 5,
    review: "The emergency care response was incredibly fast. The ambulance arrived within minutes, and the paramedics were highly professional. They saved my father's life.",
    specialty: "Emergency Care",
    date: "1 month ago"
  },
  {
    name: "Anjali Patel",
    location: "Bangalore",
    rating: 5,
    review: "Regular check-ups made easy! The reminder system is great, and the doctors are very thorough with their examinations. Best healthcare platform I've used.",
    specialty: "General Medicine",
    date: "3 weeks ago"
  },
  {
    name: "Dr. Arjun Kumar",
    location: "Chennai",
    rating: 5,
    review: "As a healthcare provider, I'm impressed with SwasthSathi's platform. It's user-friendly and helps me manage my patients effectively. Great job!",
    specialty: "Pediatrics",
    date: "1 week ago"
  }
];

const Testimonial = () => {
  return (
    <div className='mt-[30px] lg:mt-[55px]'>
      <Swiper 
        modules={[Pagination, Autoplay, Navigation]} 
        spaceBetween={30} 
        slidesPerView={1} 
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.location} • {testimonial.specialty}
                    </p>
                  </div>
                </div>
                <FaQuoteLeft className="text-2xl text-sky-500 opacity-50" />
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <HiStar key={i} className="text-yellow-400 w-5 h-5" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                "{testimonial.review}"
              </p>

              <div className="text-sm text-gray-500 mt-4">
                {testimonial.date}
              </div>
            </div>
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <div className='py-[30px] px-5 rounded-3'>
            <div className='flex items-center gap-[13px]'>
              <img src={patientAvatar} alt='' />
              <div>
                <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor'>
                  Aaditya
                </h4>
                <div className='flex items-center gap-[2px]'>
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                </div>
              </div>
            </div>

            <p className='text-[16px] leading-7 mt-4 text-textColor font-[400]'>
              "Amazing medical services! The doctors are highly skilled and caring.
              I highly recommend their services to everyone."
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='py-[30px] px-5 rounded-3'>
            <div className='flex items-center gap-[13px]'>
              <img src={patientAvatar} alt='' />
              <div>
                <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor'>
                  Ravi
                </h4>
                <div className='flex items-center gap-[2px]'>
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                  <HiStar className='text-yellowColor w-[18px] h-5' />
                </div>
              </div>
            </div>

            <p className='text-[16px] leading-7 mt-4 text-textColor font-[400]'>
              "The medical staff is very professional and friendly. They make sure
              you get the best treatment possible."
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Testimonial;