import { angkor } from "./fonts";

const Footer = () => {
    return (
      <footer className="bottom-0 left-0 right-0 p-4 text-center">
        <p className={` text-sm text-gray-600 dark:text-gray-300 ${angkor.className} `}>
          Made with ❤️ by Abdelmajid Elousse
        </p>
      </footer>
    );
  };
  
  export default Footer;