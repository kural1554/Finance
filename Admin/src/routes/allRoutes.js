import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Calendar
import Calendar from "../pages/Calendar/index";

//Chat
import Chat from "../pages/Chat/Chat";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";

//Invoice
import InvoicesList from "../pages/Invoices/invoices-list";
import InvoiceDetail from "../pages/Invoices/invoices-detail";

//Contact
import ContactsGrid from "../pages/Contacts/contacts-grid";
import ContactsList from "../pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "../pages/Contacts/ContactsProfile/contacts-profile";

//blog
import BlogGrid from "../pages/Blog/blogGrid"
import BlogList from "../pages/Blog/blogList"
import BlogDetails from "../pages/Blog/blogDetails"

//Utility
import PagesStarter from "../pages/Utility/StarterPage";
import PageMaintenance from "../pages/Utility/PageMaintenance";
import PagesComingsoon from "../pages/Utility/PageComingsoon";
import PageTimeline from "../pages/Utility/PageTimeline";
import PageFaqs from "../pages/Utility/PageFaqs";
import PagePricing from "../pages/Utility/PagePricing/index";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

// Ui Components
import UiAlert from "../pages/UiElements/UiAlert";
import UiButton from "../pages/UiElements/UiButton";
import UiCard from "../pages/UiElements/UiCard";
import UiCarousel from "../pages/UiElements/UiCarousel";
import UiDropdowns from "../pages/UiElements/UiDropdowns";
import UiGrid from "../pages/UiElements/UiGrid";
import UiImages from "../pages/UiElements/UiImages";
import UiModal from "../pages/UiElements/UiModals";
import UiOffCanvas from "../pages/UiElements/UiOffCanvas";
import UiProgressbar from "../pages/UiElements/UiProgressbar";
import UiPlaceholders from "../pages/UiElements/UiPlaceholders";
import UiTabsAccordions from "../pages/UiElements/UiTabsAccordions";
import UiTypography from "../pages/UiElements/UiTypography";
import UiToasts from "../pages/UiElements/UiToast";
import UiVideo from "../pages/UiElements/UiVideo";
import UiGeneral from "../pages/UiElements/UiGeneral";
import UiColors from "../pages/UiElements/UiColors";
import UiUtilities from "../pages/UiElements/UiUtilities";

//Extended pages
import Lightbox from "../pages/Extended/Lightbox";
import SessionTimeout from "../pages/Extended/SessionTimeout";
import UiRating from "../pages/Extended/UiRating";
import Notifications from "../pages/Extended/Notifications";

//Forms
import FormElements from "../pages/Forms/FormElements/index";
import FormValidation from "../pages/Forms/FormValidation/";
import AdvancedPlugins from "../pages/Forms/AdvancedPlugins";
import FormEditors from "../pages/Forms/FormEditors";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormMask from "../pages/Forms/FormMask";

//Tables
import BasicTable from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";

//Charts
import Apexchart from "../pages/Charts/Apexcharts";
import EChart from "../pages/Charts/EChart";
import ChartjsChart from "../pages/Charts/ChartjsChart";

//Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconFontawesomes from "../pages/Icons/Fontawesomes";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";
import MapsLeaflet from "../pages/Maps/MapsLeaflet";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

//AuthenticationInner related pages
import PageLogin from "../pages/AuthenticationInner/PageLogin";
import PageRegister from "../pages/AuthenticationInner/PageRegister";
import RecoverPassword from "../pages/AuthenticationInner/RecoverPassword";
import LockScreen from "../pages/AuthenticationInner/LockScreen";
import ConfirmMail from "../pages/AuthenticationInner/ConfirmMail";
import EmailVerification from "../pages/AuthenticationInner/EmailVerification";
import TwoStepVerfication from "../pages/AuthenticationInner/TwoStepVerfication";
import AuthLogout from "../pages/AuthenticationInner/Logout";
import UserProfile from "../pages/Authentication/user-profile";
import RangeSlider from "../pages/Extended/RangeSlider/Index";

const userRoutes = [
  //dashboard
  { path: "/dashboard", component: <Dashboard/> },

  //profile
  { path: "/profile", component: <UserProfile/> },

  //Calendar
  { path: "/apps-calendar", component: <Calendar/> },

  //Chat
  { path: "/apps-chat", component: <Chat/> },

  //Email
  { path: "/email-inbox", component: <EmailInbox/> },
  { path: "/email-read", component: <EmailRead/> },

  //Invoice
  { path: "/invoices-list", component: <InvoicesList/> },
  { path: "/invoices-detail", component: <InvoiceDetail/> },

  //Contact
  { path: "/contacts-grid", component: <ContactsGrid/> },
  { path: "/contacts-list", component: <ContactsList/> },
  { path: "/contacts-profile", component: <ContactsProfile/> },

  //blog
  {path: "/blog-grid", component: <BlogGrid/> },
  {path: "/blog-list", component: <BlogList/> },
  {path: "/blog-details", component: <BlogDetails/> },

  //Utility
  { path: "/pages-starter", component: <PagesStarter/> },
  { path: "/pages-timeline", component: <PageTimeline/> },
  { path: "/pages-faqs", component: <PageFaqs/> },
  { path: "/pages-pricing", component: <PagePricing/> },

  //Components
  { path: "/ui-alerts", component: <UiAlert/> },
  { path: "/ui-buttons", component: <UiButton/> },
  { path: "/ui-cards", component: <UiCard/> },
  { path: "/ui-carousel", component: <UiCarousel/> },
  { path: "/ui-dropdowns", component: <UiDropdowns/> },
  { path: "/ui-grid", component: <UiGrid/> },
  { path: "/ui-images", component: <UiImages/> },
  { path: "/ui-modals", component: <UiModal/> },
  { path: "/ui-offcanvas", component: <UiOffCanvas/> },
  { path: "/ui-progressbars", component: <UiProgressbar/> },
  { path: "/ui-placeholders", component: <UiPlaceholders/> },
  { path: "/ui-tabs-accordions", component: <UiTabsAccordions/> },
  { path: "/ui-typography", component: <UiTypography/> },
  { path: "/ui-toasts", component: <UiToasts/> },
  { path: "/ui-video", component: <UiVideo/> },
  { path: "/ui-general", component: <UiGeneral/> },
  { path: "/ui-colors", component: <UiColors/> },
  { path: "/ui-utilities", component: <UiUtilities/> },

  //Extended pages
  { path: "/extended-lightbox", component: <Lightbox/> },
  { path: "/extended-rangeslider", component: <RangeSlider/> },
  { path: "/extended-session-timeout", component: <SessionTimeout/> },
  { path: "/extended-rating", component: <UiRating/> },
  { path: "/extended-notifications", component: <Notifications/> },

  //Forms
  { path: "/form-elements", component: <FormElements/> },
  { path: "/form-validation", component: <FormValidation/> },
  { path: "/form-advanced", component: <AdvancedPlugins/> },
  { path: "/form-uploads", component: <FormUpload/> },
  { path: "/form-wizard", component: <FormWizard/> },
  { path: "/form-mask", component: <FormMask/> },

  //tables
  { path: "/tables-basic", component: <BasicTable/> },
  { path: "/tables-datatable", component: <DatatableTables/> },
  { path: "/tables-responsive", component: <ResponsiveTables/> },

  //Charts
  { path: "/charts-apex", component: <Apexchart/> },
  { path: "/charts-echart", component: <EChart/> },
  { path: "/charts-chartjs", component: <ChartjsChart/> },

  //Icons
  { path: "/icons-boxicons", component: <IconBoxicons/> },
  { path: "/icons-materialdesign", component: <IconMaterialdesign/> },
  { path: "/icons-dripicons", component: <IconDripicons/> },
  { path: "/icons-fontawesome", component: <IconFontawesomes/> },

  // Maps
  { path: "/maps-google", component: <MapsGoogle/> },
  { path: "/maps-vector", component: <MapsVector/> },
  { path: "/maps-leaflet", component: <MapsLeaflet/> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const authRoutes = [
  //authencation page
  { path: "/logout", component: <Logout/> },
  { path: "/login", component: <Login/> },
  { path: "/forgot-password", component: <ForgetPwd/> },
  { path: "/register", component: <Register/> },

  //AuthenticationInner pages
  { path: "/page-login", component: <PageLogin/> },
  { path: "/page-register", component: <PageRegister/> },
  { path: "/page-recoverpw", component: <RecoverPassword/> },
  { path: "/page-lock-screen", component: <LockScreen/> },
  { path: "/page-confirm-mail", component: <ConfirmMail/> },
  { path: "/page-email-verification", component: <EmailVerification/> },
  { path: "/page-two-step-verification", component: <TwoStepVerfication/> },
  { path: "/page-logout", component: <AuthLogout/>  },

  //Utility page
  { path: "/pages-maintenance", component: <PageMaintenance/> },
  { path: "/pages-comingsoon", component: <PagesComingsoon/> },
  { path: "/pages-404", component: <Error404/> },
  { path: "/pages-500", component: <Error500/> },
];

export { userRoutes, authRoutes };
