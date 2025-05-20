import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const ServiceCard = ({ item, index }) => {
  const { name, desc, Icon, bgColor, textColor } = item;

  return (
    <div className="service-card py-[30px] pb-[50px] px-3 lg:px-5 relative z-10">
      <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
        {name}
      </h2>
      <p className="text-[16px] leading-7 font-[400] text-textColor mt-4 flex-grow">
        {desc}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <Link
          to="/doctors"
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none"
        >
          <BsArrowRight className="group-hover:text-white w-6 h-5" />
        </Link>
        <span
          className="w-10 h-10 absolute bottom-4 right-4 flex items-center justify-center text-[18px] leading-[30px] font-[600] z-20"
          style={{
            background: `${bgColor}`,
            color: `${textColor}`,
            borderRadius: "4px",
          }}
        >
          {index + 1}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;