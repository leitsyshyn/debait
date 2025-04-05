import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import React from "react";

import SubscriptionCard, {
  SubscriptionCardProps,
} from "@/features/subscriptions/components/subscripton-card";

const subscriptions: SubscriptionCardProps[] = [
  {
    tier: "Basic",
    price: "Free forever",
    benefits: ["Access to basic features", "Community support"],
    action: "Current plan",
    paymentLink: "",
  },
  {
    tier: "Pro",
    price: "$1/month",
    benefits: ["Access to all features", "Priority support"],
    action: "Subscribe",
    paymentLink: process.env.STRIPE_MONTHLY_PLAN_LINK!,
  },
  {
    tier: "Pro",
    price: "$10/year",
    benefits: ["Access to all features", "Priority support"],
    action: "Subscribe",
    paymentLink: process.env.STRIPE_YEARLY_PLAN_LINK!,
  },
];

const SubscriptionsPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Debait.
        </a>
        <div className="flex  flex-row gap-6 items-center justify-center flex-wrap ">
          {subscriptions.map((subscription, index) => (
            <SubscriptionCard
              key={index}
              tier={subscription.tier}
              price={subscription.price}
              benefits={subscription.benefits}
              action={subscription.action}
              paymentLink={subscription.paymentLink}
            />
          ))}
        </div>
      </div>
      <Link href="/" className="hover:underline underline-offset-1">
        Return
      </Link>
    </div>
  );
};

export default SubscriptionsPage;
