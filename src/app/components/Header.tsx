import { angkor } from "./fonts";

const Header = () => {
    return (
      <div className="text-center mb-4">
        <p className={` text-xl text-gray-700 dark:text-gray-300 ${angkor.className} `}>
        Calculate Your <span className="text-blue-400">Daily Intake</span> to Achieve
        </p>
        <p className={` text-xl text-gray-700 dark:text-gray-300 ${angkor.className} `}>
        Your Desired <span className="text-red-400"> Weight Loss</span>
        </p>
      </div>
    );
  };
  
  export default Header;