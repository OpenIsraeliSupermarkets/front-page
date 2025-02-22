import { Database, ChartBar, Users, Code, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthDialog } from "@/components/AuthDialog";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen">
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container px-4 mx-auto text-center z-10 animate-fade-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10">
            Open Source Initiative
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Unlocking Israeli Supermarket Data
            <br /> for Everyone
          </h1>
          <span className="inline-block px-4 py-1.5 mb-6 text-lg font-semibold tracking-wider text-green-700 uppercase rounded-full bg-green-100">
            Free - No Credit Card Required
          </span>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Making supermarket data accessible, standardized, and actionable for
            researchers, developers, and consumers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/documentation")}
              className="px-8 py-3 font-semibold text-white bg-primary rounded-lg hover-lift"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowAuthDialog(true)}
              className="px-8 py-3 font-semibold border border-primary/20 rounded-lg hover-lift"
            >
              Get API key
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and features designed to make supermarket data
              accessible and useful.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-xl hover-lift animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
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
              Who We Support
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform serves diverse needs across multiple sectors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audiences.map((audience, index) => (
              <div
                key={audience.title}
                className="p-8 rounded-xl border border-border hover-lift animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {audience.title}
                </h3>
                <ul className="space-y-3">
                  {audience.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ArrowUp className="w-5 h-5 text-primary shrink-0 rotate-45" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
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
              Join Our Community
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Be part of the movement to make supermarket data accessible to
              everyone. Contribute, learn, and build with us.
            </p>
            <a
              href="https://discord.gg/qtJyuwKy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 font-semibold bg-white text-primary rounded-lg hover-lift"
            >
              Get Involved
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
    title: "Data Collection",
    description:
      "Comprehensive and reliable data fetched directly from supermarket sources.",
  },
  {
    icon: ChartBar,
    title: "Analytics",
    description:
      "Track prices and promotions over time with detailed insights.",
  },
  {
    icon: Code,
    title: "API Access",
    description: "Flexible integration options with programmatic data access.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a growing community of developers and researchers.",
  },
];

const audiences = [
  {
    title: "For Researchers",
    benefits: [
      "Access comprehensive historical data",
      "Analyze price trends and patterns",
      "Export data in research-friendly formats",
      "Connect with other academic users",
    ],
  },
  {
    title: "For Developers",
    benefits: [
      "Integrate with our robust API",
      "Access standardized data structures",
      "Build innovative applications",
      "Contribute to open-source tools",
    ],
  },
  {
    title: "For Consumers",
    benefits: [
      "Make informed purchasing decisions",
      "Track price changes over time",
      "Compare prices across stores",
      "Stay updated on promotions",
    ],
  },
  {
    title: "For Social Entrepreneurs",
    benefits: [
      "Drive social impact initiatives",
      "Analyze market accessibility",
      "Promote price transparency",
      "Support community projects",
    ],
  },
];

export default Index;
