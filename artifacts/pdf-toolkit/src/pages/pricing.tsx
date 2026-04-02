import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, X, Star, Zap, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "For occasional personal use",
    price: "$0",
    period: "forever",
    icon: Zap,
    iconColor: "text-muted-foreground",
    highlighted: false,
    cta: "Get Started",
    features: [
      { text: "Access to all PDF tools", included: true },
      { text: "Up to 25 MB file size", included: true },
      { text: "Process 2 files at a time", included: true },
      { text: "Standard compression", included: true },
      { text: "Community support", included: true },
      { text: "Batch processing", included: false },
      { text: "Priority processing queue", included: false },
      { text: "No watermark on output", included: false },
    ],
  },
  {
    name: "Premium",
    description: "For professionals and power users",
    price: "$7",
    period: "/month",
    icon: Star,
    iconColor: "text-yellow-500",
    highlighted: true,
    cta: "Upgrade to Premium",
    features: [
      { text: "Access to all PDF tools", included: true },
      { text: "Up to 200 MB file size", included: true },
      { text: "Process 10 files at a time", included: true },
      { text: "Maximum compression", included: true },
      { text: "Priority email support", included: true },
      { text: "Batch processing", included: true },
      { text: "Priority processing queue", included: true },
      { text: "No watermark on output", included: true },
    ],
  },
  {
    name: "Business",
    description: "For teams and organizations",
    price: "$15",
    period: "/user/month",
    icon: Building2,
    iconColor: "text-blue-500",
    highlighted: false,
    cta: "Contact Sales",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Up to 500 MB file size", included: true },
      { text: "Unlimited batch processing", included: true },
      { text: "Team management dashboard", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom branding & watermarks", included: true },
      { text: "API access", included: true },
      { text: "SSO & advanced security", included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-pricing">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`flex flex-col relative ${
                  plan.highlighted
                    ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                    : ""
                }`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 bg-muted ${plan.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground/60"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    data-testid={`btn-${plan.name.toLowerCase()}-cta`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>All plans include HTTPS encryption and secure file handling. Files are automatically deleted after processing.</p>
        </div>
      </div>
    </Layout>
  );
}
