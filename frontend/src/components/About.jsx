import { useTranslation } from "react-i18next";

function About() {

  const { t } = useTranslation();

    return (
      <div className="flex items-center justify-center min-h-screen px-4 mt-10">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-3xl">
          {/* About Section */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4">{t("About")}</h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Friendly Resort - Relax, Comfort, and Style, and the best pool spread across a beautiful private beach, just a short distance from the famous Full Moon Party place Rinn Beach with the best sea views in Koh Phangan. Hotel Beachfront Resort - Beautiful vacation Koh Phangan, Thailand.
            </p>
          </div>
          
          {/* Amenities Section */}
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4">{t("Amenities")}</h1>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-sm sm:text-base">
              <li>{t("On-Site Restaurant")}</li>
              <li>{t("Outdoor Swimming Pool")}</li>
              <li>{t("Broadband Internet Access")}</li>
              <li>{t("24-hour Reception")}</li>
              <li>{t("Non-Smoking Rooms")}</li>
              <li>{t("Air-Conditionin")}</li>
              <li>{t("Coffee/tea")}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  export default About;
  
  