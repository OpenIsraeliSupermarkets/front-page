import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

// Define the context type
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  direction: "ltr" | "rtl";
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Define translations
const translations = {
  en: {
    translation: {
      playground: "Playground",
      apiPlayground: "API Playground",
      selectChain: "Select Chain",
      selectChainPlaceholder: "Select a chain from the list",
      selectFile: "Select File",
      selectFilePlaceholder: "Select a file from the list",
      loading: "Loading",
      errorLoadingChains: "Error loading chains list",
      errorLoadingFiles: "Error loading files list",
      errorLoadingFileContent: "Error loading file content",
      // Navigation
      home: "Home",
      documentation: "Documentation",
      apiTokens: "API Tokens",
      loginRegister: "Login / Register",
      logout: "Logout",
      socialLinks: "Social Links",
      contact: "Contact Us",

      // Hero Section
      openSourceInitiative: "Open Source Initiative",
      heroTitle: "Unlocking Israeli Supermarket Data for Everyone",
      freeNoCard: "Free - No Credit Card Required",
      heroDescription:
        "Making supermarket data accessible, standardized, and actionable for researchers, developers, and consumers.",
      getStarted: "Get Started",
      getApiKey: "Get API key",

      // Features Section
      keyFeatures: "Key Features",
      featuresDescription:
        "Comprehensive tools and features designed to make supermarket data accessible and useful.",

      // Features
      dataCollection: "Data Collection",
      dataCollectionDesc:
        "Comprehensive and reliable data fetched directly from supermarket sources.",
      analytics: "Analytics",
      analyticsDesc:
        "Track prices and promotions over time with detailed insights.",
      apiAccess: "Start Here  ",
      apiAccessDesc:
        "Flexible integration options with programmatic data access.",
      community: "Community",
      communityDesc: "Join a growing community of developers and researchers.",

      // Plans Section
      plansTitle: "Our Plans",
      plansDescription: "Choose the plan that best fits your needs",
      ourPlans: "Our Plans",
      rawApiPlan: "Raw API Access",
      rawApiDescription: "Direct access to our raw supermarket data API",
      rawApiFeature1: "Unlimited access to raw supermarket data",
      rawApiFeature2: "Real-time updates",
      rawApiFeature3: "Bring your own use case (forecasting, prediction, etc.)",
      processedApiPlan: "Processed API Access",
      processedApiDescription: "Enhanced API with advanced features",
      processedApiFeature1: "Data standardization and normalization",
      processedApiFeature2: "Natural language interface",
      processedApiFeature3: "Complex queries and analytics support",
      available: "Available Freely via Login",
      beta: "Join Our Early Adopters",

      // Target Audiences
      whoWeSupport: "Who We Support",
      audiencesDescription:
        "Our platform serves diverse needs across multiple sectors.",

      // Audience Types
      forResearchers: "For Researchers",
      forDevelopers: "For Developers",
      forConsumers: "For Consumers",
      forSocialEntrepreneurs: "For Social Entrepreneurs",

      // Researcher Benefits
      researcherBenefit1: "Access comprehensive historical data",
      researcherBenefit2: "Analyze price trends and patterns",
      researcherBenefit3: "Export data in research-friendly formats",
      researcherBenefit4: "Connect with other academic users",

      // Developer Benefits
      developerBenefit1: "Integrate with our robust API",
      developerBenefit2: "Access standardized data structures",
      developerBenefit3: "Build innovative applications",
      developerBenefit4: "Contribute to open-source tools",

      // Consumer Benefits
      consumerBenefit1: "Make informed purchasing decisions",
      consumerBenefit2: "Track price changes over time",
      consumerBenefit3: "Compare prices across stores",
      consumerBenefit4: "Stay updated on promotions",

      // Social Entrepreneur Benefits
      socialBenefit1: "Drive social impact initiatives",
      socialBenefit2: "Analyze market accessibility",
      socialBenefit3: "Promote price transparency",
      socialBenefit4: "Support community projects",

      // CTA Section
      joinCommunity: "Join Our Community",
      ctaDescription:
        "Be part of the movement to make supermarket data accessible to everyone. Contribute, learn, and build with us.",
      getInvolved: "Get Involved",

      // Documentation
      apiDocumentation: "API Documentation",
      apiDocDescription:
        "Complete guide to integrating with the Israeli Supermarket Data API",
      gettingStarted: "Getting Started",
      baseUrl: "Base URL",
      baseUrlDesc: "All API requests should be made to the base URL:",
      authentication: "Authentication",
      authDesc:
        "All requests require authentication using a Bearer Token. You can get your free API token by",
      signUpHere: "signing up here",
      noCardRequired:
        "No credit card required - our API is completely free to use.",
      addToken: "Add the token in the Authorization header:",
      apiEndpoints: "API Endpoints",
      codeExamples: "Code Examples",
      quickStartGuide: "Quick Start Guide",

      // API Tokens Page
      apiTokensTitle: "API Tokens",
      authRequired: "Authentication Required",
      authRequiredDesc: "You need to be logged in to create and manage tokens.",
      createNewToken: "Create New Token",
      tokenName: "Token Name",
      enterTokenName: "Enter token name",
      generateToken: "Generate Token",
      yourNewToken: "Your New Token",
      copyTokenWarning:
        "Make sure to copy this token now. You won't be able to see it again!",
      yourTokens: "Your Tokens",
      created: "Created:",
      status: "Status:",
      active: "Active",
      inactive: "Inactive",
      deactivate: "Deactivate",
      backToHome: "Back to Home",
      tokenCreated: "Token Created",
      tokenCreatedDesc: "Token created successfully.",
      tokenDeactivated: "Token Deactivated",
      tokenDeactivatedDesc: "Token has been deactivated.",
      errorTitle: "Error",
      errorMustLogin: "You must be logged in to create a token",
      errorEnterName: "Please enter a token name",
      errorCreateToken: "Failed to create token",
      errorDeactivateToken: "Failed to deactivate token",
      errorLoadTokens: "Failed to load tokens",

      // Auth Dialog
      createAccount: "Create an account",
      loginTitle: "Login",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      processing: "Processing...",
      register: "Register",
      login: "Login",
      haveAccount: "Already have an account? Login",
      noAccount: "Don't have an account? Register",
      registrationSuccess: "Registration successful!",
      checkEmail: "Please check your email to verify your account.",
      loginSuccess: "Login successful!",
      welcomeBack: "Welcome back!",
      authError: "Authentication Error",
      invalidCredentials: "Invalid login credentials. Please try again.",

      // Password Reset
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      resetPasswordSuccess: "Password reset email sent!",
      resetPasswordError: "Failed to send reset password email",
      resetPasswordDesc:
        "Please check your email for password reset instructions.",
      backToLogin: "Back to Login",

      // Endpoints
      listChains: "List Chains",
      listChainsDesc: "Retrieve a list of available supermarket chains",
      listFileTypes: "List File Types",
      listFileTypesDesc: "Get a list of available file types",
      listScrapedFiles: "List Scraped Files",
      listScrapedFilesDesc: "Get a list of files for a specific chain",
      fileContent: "File Content",
      fileContentDesc: "Retrieve the content of a specific file",

      // FAQ Section
      faqTitle: "Frequently Asked Questions",
      faqDescription:
        "Find answers to the most common questions about using our data and service.",
      howOftenUpdated: "How often is the data updated?",
      howOftenUpdatedAnswer:
        "Our data is updated multiple times daily to ensure you have access to the most current supermarket prices and promotions.",

      dataUsage: "How can I use this data?",
      dataUsageAnswer:
        "The data can be used for research, price comparison applications, market analysis, and consumer awareness initiatives. We provide both raw data access and processed analytics.",

      apiLimits: "Are there any API rate limits?",
      apiLimitsAnswer:
        "Our free tier includes generous API limits suitable for most use cases. We implement fair use policies to ensure service availability for all users.",

      dataAccuracy: "How accurate is the data?",
      dataAccuracyAnswer:
        "Our data is sourced directly from official supermarket price databases and verified through automated validation processes. We maintain high accuracy standards and promptly correct any discrepancies.",

      privacyPolicy: "What about data privacy?",
      privacyPolicyAnswer:
        "We adhere to strict privacy guidelines. The data we collect is publicly available pricing information and does not include any personal data.",

      // Quick Start Guide Steps
      getApiToken: "Get your API token from the system",
      startListChains:
        "Start by calling /list_chains to get available supermarket chains",
      useListFileTypes:
        "Use /list_file_types to see what types of files are available",
      getFilesList:
        "Get a list of files for your chosen chain using /list_scraped_files",
      retrieveFileContents:
        "Retrieve file contents using /raw/file_content with the chain and file name",
      handleResponses:
        "Handle responses appropriately and implement error handling",
      considerCaching:
        "Consider caching responses when appropriate to improve performance",

      chooseChain: "Choose Chain",
      selectFileToView: "Select File to View",
      chooseFile: "Choose File",
    },
  },
  he: {
    translation: {
      playground: "מגרש משחקים",
      apiPlayground: "מגרש משחקים API",
      selectChain: "בחר רשת",
      selectChainPlaceholder: "בחר רשת מהרשימה",
      selectFile: "בחר קובץ",
      selectFilePlaceholder: "בחר קובץ מהרשימה",
      loading: "טוען",
      errorLoadingChains: "שגיאה בטעינת רשימת הרשתות",
      errorLoadingFiles: "שגיאה בטעינת רשימת הקבצים",
      errorLoadingFileContent: "שגיאה בטעינת תוכן הקובץ",
      // Navigation
      home: "דף הבית",
      documentation: "דוקומנטציה",
      apiTokens: "מפתחות גישה",
      loginRegister: "התחברות / הרשמה",
      logout: "התנתקות",
      socialLinks: "קישורים חברתיים",
      contact: "צור קשר",

      // Hero Section
      openSourceInitiative: "קוד פתוח",
      heroTitle: "הנגשת נתוני סופרמרקטים בישראל לכולם",
      freeNoCard: "גישה חינם - ללא צורך בכרטיס אשראי",
      heroDescription:
        "הפיכת נתוני סופרמרקטים לנגישים, סטנדרטיים ושימושיים עבור חוקרים, מפתחים וצרכנים.",
      getStarted: "בואו נתחיל",
      getApiKey: "קבלת מפתח API",

      // Features Section
      keyFeatures: "תכונות מרכזיות",
      featuresDescription:
        "כלים ותכונות מקיפים שתוכננו להפוך את נתוני הסופרמרקטים לנגישים ושימושיים.",

      // Features
      dataCollection: "איסוף נתונים",
      dataCollectionDesc:
        "נתונים מקיפים ואמינים הנאספים ישירות ממקורות הסופרמרקטים.",
      analytics: "אנליטיקה",
      analyticsDesc: "מעקב אחר מחירים ומבצעים לאורך זמן עם תובנות מפורטות.",
      apiAccess: "התחילו כאן",
      apiAccessDesc: "אפשרויות אינטגרציה גמישות עם גישה תכנותית לנתונים.",
      community: "קהילה",
      communityDesc: "הצטרפו לקהילה צומחת של מפתחים וחוקרים.",

      // Plans Section
      plansTitle: "החבילות שלנו",
      plansDescription: "בחרו את החבילה המתאימה לצרכים שלכם",
      ourPlans: "החבילות שלנו",
      rawApiPlan: "גישה ל-API גולמי",
      rawApiDescription: "גישה ישירה ל-API של נתוני הסופרמרקט הגולמיים",
      rawApiFeature1: "גישה בלתי מוגבלת לנתוני סופרמרקט גולמיים",
      rawApiFeature2: "עדכונים בזמן אמת",
      rawApiFeature3: "הביאו את השימוש שלכם (חיזוי, תחזיות וכו')",
      processedApiPlan: "גישה ל-API מעובד",
      processedApiDescription: "API משופר עם תכונות מתקדמות",
      processedApiFeature1: "סטנדרטיזציה ונורמליזציה של נתונים",
      processedApiFeature2: "ממשק שפה טבעית",
      processedApiFeature3: "תמיכה בשאילתות מורכבות וניתוח",
      available: "זמין בחינם עם התחברות",
      beta: "הצטרף למאמצים המוקדמים",

      // Target Audiences
      whoWeSupport: "למי אנחנו עוזרים",
      audiencesDescription: "הפלטפורמה שלנו משרתת צרכים מגוונים במגזרים שונים.",

      // Audience Types
      forResearchers: "לחוקרים",
      forDevelopers: "למפתחים",
      forConsumers: "לצרכנים",
      forSocialEntrepreneurs: "ליזמים חברתיים",

      // Researcher Benefits
      researcherBenefit1: "גישה לנתונים היסטוריים מקיפים",
      researcherBenefit2: "ניתוח מגמות ודפוסי מחירים",
      researcherBenefit3: "ייצוא נתונים בפורמטים ידידותיים למחקר",
      researcherBenefit4: "התחברות עם משתמשים אקדמיים אחרים",

      // Developer Benefits
      developerBenefit1: "אינטגרציה עם ה-API החזק שלנו",
      developerBenefit2: "גישה למבני נתונים סטנדרטיים",
      developerBenefit3: "בניית אפליקציות חדשניות",
      developerBenefit4: "תרומה לכלי קוד פתוח",

      // Consumer Benefits
      consumerBenefit1: "קבלת החלטות רכישה מושכלות",
      consumerBenefit2: "מעקב אחר שינויי מחירים לאורך זמן",
      consumerBenefit3: "השוואת מחירים בין חנויות",
      consumerBenefit4: "עדכונים שוטפים על מבצעים",

      // Social Entrepreneur Benefits
      socialBenefit1: "קידום יוזמות להשפעה חברתית",
      socialBenefit2: "ניתוח נגישות השוק",
      socialBenefit3: "קידום שקיפות מחירים",
      socialBenefit4: "תמיכה בפרויקטים קהילתיים",

      // CTA Section
      joinCommunity: "הצטרפו לקהילה שלנו",
      ctaDescription:
        "היו חלק מהתנועה להנגשת נתוני סופרמרקטים לכולם. תרמו, למדו ובנו איתנו.",
      getInvolved: "בואו להשתתף",

      // Documentation
      apiDocumentation: "תיעוד ה-API",
      apiDocDescription:
        "מדריך מלא לאינטגרציה עם ה-API של נתוני הסופרמרקטים בישראל",
      gettingStarted: "התחלה מהירה",
      baseUrl: "כתובת בסיס",
      baseUrlDesc: "כל בקשות ה-API צריכות להישלח לכתובת הבסיס:",
      authentication: "אימות",
      authDesc:
        "כל הבקשות דורשות אימות באמצעות Bearer Token. ניתן לקבל את טוקן ה-API שלך בחינם על ידי",
      signUpHere: "הרשמה כאן",
      noCardRequired: "לא נדרש כרטיס אשראי - ה-API שלנו חינמי לחלוטין.",
      addToken: "הוסף את הטוקן בכותרת Authorization:",
      apiEndpoints: "נקודות קצה של ה-API",
      codeExamples: "דוגמאות קוד",
      quickStartGuide: "מדריך התחלה מהיר",

      // API Tokens Page
      apiTokensTitle: "טוקנים ל-API",
      authRequired: "נדרש אימות",
      authRequiredDesc: "עליך להיות מחובר כדי ליצור ולנהל טוקנים.",
      createNewToken: "יצירת טוקן חדש",
      tokenName: "שם הטוקן",
      enterTokenName: "הכנס שם לטוקן",
      generateToken: "יצירת טוקן",
      yourNewToken: "הטוקן החדש שלך",
      copyTokenWarning: "הקפד להעתיק את הטוקן עכשיו. לא תוכל לראות אותו שוב!",
      yourTokens: "הטוקנים שלך",
      created: "נוצר:",
      status: "סטטוס:",
      active: "פעיל",
      inactive: "לא פעיל",
      deactivate: "ביטול",
      backToHome: "חזרה לדף הבית",
      tokenCreated: "הטוקן נוצר",
      tokenCreatedDesc: "הטוקן נוצר בהצלחה.",
      tokenDeactivated: "הטוקן בוטל",
      tokenDeactivatedDesc: "הטוקן בוטל בהצלחה.",
      errorTitle: "שגיאה",
      errorMustLogin: "עליך להיות מחובר כדי ליצור טוקן",
      errorEnterName: "אנא הכנס שם לטוקן",
      errorCreateToken: "נכשל ביצירת הטוקן",
      errorDeactivateToken: "נכשל בביטול הטוקן",
      errorLoadTokens: "נכשל בטעינת הטוקנים",

      // Auth Dialog
      createAccount: "יצירת חשבון",
      loginTitle: "התחברות",
      firstName: "שם פרטי",
      lastName: "שם משפחה",
      email: "דואר אלקטרוני",
      password: "סיסמה",
      processing: "מעבד...",
      register: "הרשמה",
      login: "התחברות",
      haveAccount: "כבר יש לך חשבון? התחבר",
      noAccount: "אין לך חשבון? הירשם",
      registrationSuccess: "ההרשמה הצליחה!",
      checkEmail: "אנא בדוק את הדואר האלקטרוני שלך לאימות החשבון.",
      loginSuccess: "ההתחברות הצליחה!",
      welcomeBack: "ברוך שובך!",
      authError: "שגיאת אימות",
      invalidCredentials: "פרטי ההתחברות שגויים. אנא נסה שוב.",

      // Password Reset
      forgotPassword: "שכחת סיסמה?",
      resetPassword: "איפוס סיסמה",
      resetPasswordSuccess: "נשלח מייל לאיפוס סיסמה!",
      resetPasswordError: "שגיאה בשליחת מייל לאיפוס סיסמה",
      resetPasswordDesc: "אנא בדוק את תיבת הדואר שלך להוראות איפוס הסיסמה.",
      backToLogin: "חזרה להתחברות",

      // Endpoints
      listChains: "רשימת רשתות",
      listChainsDesc: "קבלת רשימה של רשתות סופרמרקטים זמינות",
      listFileTypes: "רשימת סוגי קבצים",
      listFileTypesDesc: "קבלת רשימה של סוגי קבצים זמינים",
      listScrapedFiles: "רשימת קבצים שנאספו",
      listScrapedFilesDesc: "קבלת רשימת קבצים עבור רשת ספציפית",
      fileContent: "תוכן קובץ",
      fileContentDesc: "קבלת התוכן של קובץ ספציפי",

      // FAQ Section
      faqTitle: "שאלות נפוצות",
      faqDescription:
        "תשובות לשאלות הנפוצות ביותר על השימוש במידע ובשירות שלנו",
      howOftenUpdated: "באיזו תדירות המידע מתעדכן?",
      howOftenUpdatedAnswer:
        "המידע שלנו מתעדכן מספר פעמים ביום כדי להבטיח שיש לכם גישה למחירי סופרמרקט ומבצעים עדכניים ביותר.",

      dataUsage: "כיצד ניתן להשתמש במידע?",
      dataUsageAnswer:
        "ניתן להשתמש במידע למחקר, אפליקציות השוואת מחירים, ניתוח שוק ויוזמות להעלאת מודעות צרכנית. אנו מספקים גם גישה לנתונים גולמיים וגם לניתוחים מעובדים.",

      apiLimits: "האם יש מגבלות על השימוש ב-API?",
      apiLimitsAnswer:
        "החבילה החינמית שלנו כוללת מכסות API נדיבות המתאימות לרוב השימושים. אנו מיישמים מדיניות שימוש הוגן כדי להבטיח זמינות השירות לכל המשתמשים.",

      dataAccuracy: "מה רמת הדיוק של המידע?",
      dataAccuracyAnswer:
        "המידע שלנו מגיע ישירות ממאגרי המחירים הרשמיים של רשתות השיווק ועובר תהליכי אימות אוטומטיים. אנו שומרים על סטנדרטים גבוהים של דיוק ומתקנים במהירות כל אי-התאמה.",

      privacyPolicy: "מה לגבי פרטיות המידע?",
      privacyPolicyAnswer:
        "אנו מקפידים על הנחיות פרטיות קפדניות. המידע שאנו אוספים הוא מידע מחירים פומבי ואינו כולל נתונים אישיים כלשהם.",

      // Quick Start Guide Steps
      getApiToken: "קבל את מפתח ה-API שלך מהמערכת",
      startListChains:
        "התחל בקריאה ל-list_chains/ כדי לקבל את רשימת רשתות הסופרמרקט הזמינות",
      useListFileTypes:
        "השתמש ב-list_file_types/ כדי לראות אילו סוגי קבצים זמינים",
      getFilesList:
        "קבל רשימת קבצים עבור הרשת שבחרת באמצעות list_scraped_files/",
      retrieveFileContents:
        "אחזר תוכן קובץ באמצעות raw/file_content/ עם שם הרשת ושם הקובץ",
      handleResponses: "טפל בתשובות בצורה נאותה והטמע טיפול בשגיאות",
      considerCaching: "שקול שמירת תשובות במטמון כדי לשפר ביצועים",

      chooseChain: "בחר רשת",
      selectFileToView: "בחר קובץ לצפייה",
      chooseFile: "בחר קובץ",
    },
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: translations,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState("en");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setIsChanging(true);

    // Wait for fade out to complete before changing language
    setTimeout(() => {
      setLanguage(lang);
      i18n.changeLanguage(lang);
      setDirection(lang === "he" ? "rtl" : "ltr");
      document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
      document.documentElement.lang = lang;

      // Remove fade out after language change
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    }, 300);
  };

  useEffect(() => {
    handleLanguageChange(language);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleLanguageChange, direction }}
    >
      <div className="relative">
        {children}
        {isChanging && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-fade-out" />
        )}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
