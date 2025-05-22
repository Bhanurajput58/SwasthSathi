import { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const FaqItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (    <div 
      className={`p-4 lg:p-6 rounded-[12px] border border-solid mb-5 cursor-pointer transition-all duration-300 hover:shadow-md ${
        isOpen ? 'bg-[#f0f7ff] border-[#0052cc]' : 'bg-white border-[#e5e7eb] hover:border-[#0052cc]'
      }`}
    >
      <div
        className="flex items-center justify-between gap-5 select-none"
        onClick={toggleAccordion}
      >
        <h4 className={`text-[17px] leading-7 lg:text-[19px] lg:leading-8 font-semibold transition-colors duration-300 ${
          isOpen ? 'text-[#0052cc]' : 'text-[#2c3e50] group-hover:text-[#0052cc]'
        }`}>
          {item.question}
        </h4>
        <div
          className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-all duration-300 transform ${
            isOpen 
              ? 'bg-[#0052cc] text-white rotate-180' 
              : 'bg-[#f0f7ff] text-[#0052cc] hover:bg-[#0052cc] hover:text-white'
          }`}
        >
          {isOpen ? <AiOutlineMinus className="text-xl" /> : <AiOutlinePlus className="text-xl" />}
        </div>
      </div>
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 px-1">
          <p className="text-[15px] leading-7 lg:text-[16px] lg:leading-8 text-gray-600">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqItem;