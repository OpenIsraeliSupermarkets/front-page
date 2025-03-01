import {
  Database,
  ChartBar,
  Users,
  Code,
  ArrowUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthDialog } from "@/components/AuthDialog";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const { direction } = useLanguage();

  return (
    <div className="min-h-screen" dir={direction}>
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container px-4 mx-auto text-center z-10 animate-fade-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10">
            {t("openSourceInitiative")}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {t("heroTitle")}
          </h1>
          <span className="inline-block px-4 py-1.5 mb-6 text-lg font-semibold tracking-wider text-green-700 uppercase rounded-full bg-green-100">
            {t("freeNoCard")}
          </span>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("heroDescription")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/documentation")}
              className="px-8 py-3 font-semibold text-white bg-primary rounded-lg hover-lift"
              aria-label={t("getStarted")}
            >
              {t("getStarted")}
            </button>
            <button
              onClick={() => setShowAuthDialog(true)}
              className="px-8 py-3 font-semibold text-white bg-primary/90 border-2 border-primary rounded-lg hover-lift hover:bg-primary"
              aria-label={t("getApiKey")}
            >
              {t("getApiKey")}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("keyFeatures")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("featuresDescription")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.titleKey}
                className="glass-card p-6 rounded-xl hover-lift animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <feature.icon
                  className="w-12 h-12 text-primary mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("whoWeSupport")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("audiencesDescription")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audiences.map((audience, index) => (
              <div
                key={audience.titleKey}
                className="p-8 rounded-xl border border-border hover-lift animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {t(audience.titleKey)}
                </h3>
                <ul className="space-y-3">
                  {audience.benefitKeys.map((benefitKey, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ArrowUp
                        className="w-5 h-5 text-primary shrink-0 rotate-45"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">
                        {t(benefitKey)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("faqTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("faqDescription")}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-lg hover-lift animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`faq-${index}`}
                >
                  <span className="font-semibold">{t(faq.questionKey)}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div
                    id={`faq-${index}`}
                    className="px-6 pb-4 text-muted-foreground"
                  >
                    {t(faq.answerKey)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("joinCommunity")}
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              {t("ctaDescription")}
            </p>
            <a
              href="https://discord.gg/qtJyuwKy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 font-semibold bg-white text-primary rounded-lg hover-lift"
            >
              {t("getInvolved")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Database,
    titleKey: "dataCollection",
    descriptionKey: "dataCollectionDesc",
  },
  {
    icon: ChartBar,
    titleKey: "analytics",
    descriptionKey: "analyticsDesc",
  },
  {
    icon: Code,
    titleKey: "apiAccess",
    descriptionKey: "apiAccessDesc",
  },
  {
    icon: Users,
    titleKey: "community",
    descriptionKey: "communityDesc",
  },
];

const audiences = [
  {
    titleKey: "forResearchers",
    benefitKeys: [
      "researcherBenefit1",
      "researcherBenefit2",
      "researcherBenefit3",
      "researcherBenefit4",
    ],
  },
  {
    titleKey: "forDevelopers",
    benefitKeys: [
      "developerBenefit1",
      "developerBenefit2",
      "developerBenefit3",
      "developerBenefit4",
    ],
  },
  {
    titleKey: "forConsumers",
    benefitKeys: [
      "consumerBenefit1",
      "consumerBenefit2",
      "consumerBenefit3",
      "consumerBenefit4",
    ],
  },
  {
    titleKey: "forSocialEntrepreneurs",
    benefitKeys: [
      "socialBenefit1",
      "socialBenefit2",
      "socialBenefit3",
      "socialBenefit4",
    ],
  },
];

const faqs = [
  {
    questionKey: "howOftenUpdated",
    answerKey: "howOftenUpdatedAnswer",
  },
  {
    questionKey: "dataUsage",
    answerKey: "dataUsageAnswer",
  },
  {
    questionKey: "apiLimits",
    answerKey: "apiLimitsAnswer",
  },
  {
    questionKey: "dataAccuracy",
    answerKey: "dataAccuracyAnswer",
  },
  {
    questionKey: "privacyPolicy",
    answerKey: "privacyPolicyAnswer",
  },
];

export default Index;
