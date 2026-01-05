import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Leaf, Target, Users, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Transparency",
      description: "Every calculation, emission factor, and assumption is viewable and referenced with international standards."
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Sustainability tools should be available to all organizations, regardless of size or resources."
    },
    {
      icon: Lightbulb,
      title: "Actionable Insights",
      description: "We provide not just data, but clear recommendations with impact estimates and implementation guidance."
    },
    {
      icon: Leaf,
      title: "Sustainability First",
      description: "Our platform practices what it preaches—energy-efficient design, green hosting, and minimal resource usage."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">About Trace Resource</h1>
            <p className="text-lg text-muted-foreground">
              Empowering organizations with transparent, accessible sustainability intelligence.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                Trace Resource exists to democratize sustainability measurement and management. We believe every organization—from startups to enterprises—should have access to professional-grade tools for understanding and reducing their environmental impact.
              </p>
              <p className="text-muted-foreground">
                Our platform provides three expert tools that follow international standards (GHG Protocol, GRI, SASB, ISO) while maintaining complete transparency about methodologies, calculations, and assumptions.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-foreground">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {values.map((value, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sustainable by Design</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span><strong>Client-side calculations:</strong> All processing happens in your browser for maximum privacy and minimal server load</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span><strong>Optimized assets:</strong> Compressed images (WebP/AVIF), lazy loading, and efficient code bundling</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span><strong>Green hosting:</strong> Powered by renewable energy infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span><strong>Accessible design:</strong> WCAG 2.1 AA compliant with keyboard navigation and screen reader support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
