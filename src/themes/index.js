import PremiumRestaurant from './PremiumRestaurant.jsx';
import BakeryCafe from './BakeryCafe.jsx';
import Corporate from './Corporate.jsx';
import DigitalAgency from './DigitalAgency.jsx';
import HotelResort from './HotelResort.jsx';
import SalonBeauty from './SalonBeauty.jsx';
import VehicleRental from './VehicleRental.jsx';
import RealEstate from './RealEstate.jsx';
import RetailStore from './RetailStore.jsx';
import EducationAcademy from './EducationAcademy.jsx';

// Maps stable theme IDs (see src/data/themes.js) to their demo components.
export const THEME_COMPONENTS = {
  'restaurant-premium-dining': PremiumRestaurant,
  'restaurant-bakery-cafe': BakeryCafe,
  'hotel-resort': HotelResort,
  'salon-beauty': SalonBeauty,
  'rental-vehicles': VehicleRental,
  'business-corporate': Corporate,
  'business-digital-agency': DigitalAgency,
  'realestate-agency': RealEstate,
  'retail-fashion-store': RetailStore,
  'education-academy': EducationAcademy,
};
