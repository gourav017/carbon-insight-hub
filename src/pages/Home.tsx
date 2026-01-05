import { Link } from "react-router-dom";
import { Calculator, LineChart, Footprints, ArrowRight, CheckCircle2, TrendingDown, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Home = () => {
  const tools = [
    {
      icon: Shield,
      title: "ESG Alignment Assessment",
      description: "Comprehensive scoring across Environmental, Social, and Governance criteria with transparent benchmarking against international frameworks.",
      features: [
        "Sector-specific benchmarks",
        "Pillar breakdown (E, S, G)",
        "Actionable recommendations",
        "Compliance mapping"
      ],
      path: "/esg-assessment",
      color: "text-chart-1 bg-chart-1/10"
    },
    {
      icon: Calculator,
      title: "Carbon Emissions Calculator",
      description: "Calculate company-wide emissions across all scopes (1, 2, 3) following GHG Protocol standards with personalized reduction strategies.",
      features: [
        "Full Scope 1, 2, 3 tracking",
        "GHG Protocol compliant",
        "Reduction pathway planning",
        "Carbon credit guidance"
      ],
      path: "/carbon-emissions",
      color: "text-chart-2 bg-chart-2/10"
    },
    {
      icon: Footprints,
      title: "Sector-Specific Footprint",
      description: "Detailed carbon footprint calculations tailored to your industry sector with granular emission factor transparency.",
      features: [
        "10+ sector templates",
        "Granular input categories",
        "Transparent calculations",
        "Industry comparisons"
      ],
      path: "/carbon-footprint",
      color: "text-chart-3 bg-chart-3/10"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "All calculations run client-side for instant results and maximum privacy"
    },
    {
      icon: CheckCircle2,
      title: "Transparent Methods",
      description: "Every calculation, factor, and assumption is viewable and referenced"
    },
    {
      icon: TrendingDown,
      title: "Actionable Insights",
      description: "Receive personalized recommendations with impact estimates"
    },
    {
      icon: Shield,
      title: "Standards Compliant",
      description: "Aligned with GHG Protocol, GRI, SASB, ISO, and SDG frameworks"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Your Sustainability Intelligence Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Three expert tools for comprehensive ESG assessment, emissions tracking, and carbon footprint calculation—accessible, transparent, and built for sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary-light text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                <a href="#tools">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Impact Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {["3 Expert Tools", "All Sectors", "Transparent Methods", "Free & Fast"].map((item, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-4 text-center shadow-sm">
                <p className="font-semibold text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${benefit.icon === Zap ? 'bg-chart-1/10' : benefit.icon === CheckCircle2 ? 'bg-chart-2/10' : benefit.icon === TrendingDown ? 'bg-chart-3/10' : 'bg-chart-4/10'}`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.icon === Zap ? 'text-chart-1' : benefit.icon === CheckCircle2 ? 'text-chart-2' : benefit.icon === TrendingDown ? 'text-chart-3' : 'text-chart-4'}`} />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Sustainability Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the right tool for your sustainability goals. Each tool provides transparent calculations and actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${tool.color}`}>
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full bg-primary hover:bg-primary-light text-primary-foreground group-hover:shadow-md transition-all">
                    <Link to={tool.path}>
                      Start Assessment
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join organizations worldwide using Trace Resource to measure, manage, and reduce their environmental impact.
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary-light text-primary-foreground shadow-lg hover:shadow-xl">
            <a href="#tools">
              Choose Your Tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
