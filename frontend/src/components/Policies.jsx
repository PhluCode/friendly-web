import { useTranslation } from "react-i18next";

function Policies() {

  const { t } = useTranslation()

    return (
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div className='bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-3xl'>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
            {t("Terms, Conditions and Privacy Policy")}
          </h1>
          <ul className="list-inside space-y-4 text-gray-600 text-base sm:text-lg">
            <li>
              <span className="font-semibold">Check-in:</span> {t("From")} 10:00 AM
            </li>
            <li>
              <span className="font-semibold">Photo ID:</span> {t("Guests are required to show a photo identification and credit card upon check-in.")}
            </li>
            <li>
              <span className="font-semibold">Check-out:</span> {t("Until")} 12:00 PM
            </li>
            <li>
              <span className="font-semibold">Cancellation/Prepayment:</span> {t("Cancellation and prepayment policies vary according to accommodation type. Please check what conditions may apply to each option when making your selection.")}
            </li>
            <li>
              <span className="font-semibold">Age Restriction:</span> {t("The minimum age for check-in is 18.")}
            </li>
            <li>
              <span className="font-semibold">Pets:</span> {t("Pets are not allowed.")}
            </li>
            <li>
              <span className="font-semibold">Accepted Payment Methods:</span> {t("Mastercard, QrCode, Cash.")}
            </li>
          </ul>
        </div>
      </div>
    )
  }
  
  export default Policies;
  
