import { Link } from "react-router-dom";
import logo from "../images/logos/meet-greek.png";
import { useTranslation } from "react-i18next";


const Footer = () => {
      const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-50 text-gray-300 mt-auto w-full md:pl-[320px] xl:pl-[200px]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-10 px-5 sm:px-6 lg:pl-[340px] [1700px]:pl-[340px] lg:pr-6">
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex flex-row gap-2">
              <img src={logo} alt="" width="50px" />
              <h4 className="text-black text-3xl sm:text-lg font-semibold mt-2">
                Meet Greek Singles 
              </h4>
            </div>
            <p className="text-sm text-gray-400">
               {t("Connecting Greek Hearts Worldwide")}
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-black text-base sm:text-lg font-semibold mb-2">
               {t("legal")}
            </h4>
            <ul className="space-y-2 text-sm p-0">
              <li>
                <Link
                  to="/page/terms_&_conditions"
                  className="hover:text-white  text-gray"
                >
                  {t("Terms & Conditions")}
                </Link>
              </li>
              <li>
                <Link
                  to="/page/privacy_policy_"
                  className="hover:text-white text-gray"
                >
                  {t("Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/page/cookie_policy"
                  className="hover:text-white text-gray"
                >
                   {t("Cookie Policy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-black text-base sm:text-lg font-semibold mb-2">
               {t("Support")}
            </h4>
            <ul className="space-y-2 text-sm p-0">
              <li>
                <Link to="/page/contact_us" className="text-gray">
                  {t("Contact Us")}
                </Link>
              </li>
              <li>
                <Link to="/page/safety_&_community_care" className="text-gray">
                  {t("Safety & Community Care")}
                </Link>
              </li>
              <li>
                <Link to="/page/community_events_&_ambassadors" className="text-gray">
                  {t("Community Events & Ambassadors")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div>
            <h4 className="text-black text-base sm:text-lg font-semibold mb-2">
               {t("language")}
            </h4>
            <div className="flex gap-2 text-sm flex-wrap items-center">
              <button className="text-gray">English</button>
              <span className="text-gray-500">|</span>
              <button className="text-gray">Ελληνικά</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-5 sm:px-6 lg:pl-[340px] lg:pr-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Meet Greek Singles. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;