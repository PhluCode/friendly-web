import { useTranslation } from 'react-i18next';
import Map from './Map.jsx';

function Contact() {

    const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-screen px-4 overflow-hidden mt-16">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">

            <Map/>

            <div className='py-5 border-b-2'>
                <h1 className="text-2xl sm:text-3xl font-semibold mb-4">{t("Contact us")}</h1>
                <p className="text-gray-600 text-base sm:text-lg">110/40 Moo 6 Ban Tai Koh Phagan Surat Thani <br /> Surat Thani, Surat Thani, 84280 <br /> Thailand</p>
            </div>

            <div className='py-5 border-b-2'>  
                <p><span className="font-semibold">{t("Phone")}:</span> +660838888341</p>
                <p><span className="font-semibold">{t("Email")}:</span> maxfriendlyresort@gmail.com</p>
            </div>

            <div className='py-5 border-b-2'>  
                <p>{t("Free Parking")}</p>
            </div>

            <div className='py-5 border-b-2'>  
                <p>Popular points of interest near Friendly Resort include Haad Rin Nai Beach, Haad Rin Nok Beach and Leela Beach.
                </p>
            </div>

        </div>
    </div>
  )
}

export default Contact
