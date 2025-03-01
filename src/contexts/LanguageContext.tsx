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

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // Navigation
        home: "Home",
        documentation: "Documentation",
        apiTokens: "API Tokens",
        login: "Login / Register",
        logout: "Logout",

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
        apiAccess: "API Access",
        apiAccessDesc:
          "Flexible integration options with programmatic data access.",
        community: "Community",
        communityDesc:
          "Join a growing community of developers and researchers.",

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
        authRequiredDesc:
          "You need to be logged in to create and manage tokens.",
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
      },
    },
    he: {
      translation: {
        // Navigation
        home: "דף הבית",
        documentation: "דוקומנטציה",
        apiTokens: "מפתחות API",
        login: "התחברות / הרשמה",
        logout: "התנתקות",

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
        apiAccess: "גישת API",
        apiAccessDesc: "אפשרויות אינטגרציה גמישות עם גישה תכנותית לנתונים.",
        community: "קהילה",
        communityDesc: "הצטרפו לקהילה צומחת של מפתחים וחוקרים.",

        // Target Audiences
        whoWeSupport: "למי אנחנו עוזרים",
        audiencesDescription:
          "הפלטפורמה שלנו משרתת צרכים מגוונים במגזרים שונים.",

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
      },
    },
  },
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

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setDirection(lang === "he" ? "rtl" : "ltr");
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    handleLanguageChange(language);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleLanguageChange, direction }}
    >
      {children}
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
