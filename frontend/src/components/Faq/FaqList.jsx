import faqs from './../../assets/data/faqs';
import FaqItem from './FaqItem';
import faqImg from '../../assets/images/faq-img.png';

const FaqList = () => {
  return (
    <div className="grid md:grid-cols-2 gap-[50px] items-center">
      <div className="hidden md:block">
        <img
          src={faqImg}
          alt="FAQ Illustration"
          className="w-full max-w-[500px] mx-auto"
        />
      </div>
      <div>
        <h2 className="text-[2rem] lg:text-[2.5rem] font-bold text-[#2c3e50]">
          Frequently Asked Questions
        </h2>
        <p className="text-[16px] leading-7  text-gray-600">
          Find quick answers to common questions about our healthcare services, appointment booking, and more.
        </p>
        <div className="mt-[30px]">
          {faqs.map((item, index) => (
            <FaqItem item={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqList;