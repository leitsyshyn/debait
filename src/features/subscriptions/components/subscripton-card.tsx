"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface SubscriptionCardProps {
  tier: string;
  price: string;
  benefits: string[];
  action: string;
  paymentLink?: string;
}

const SubscriptionCard = ({
  tier,
  price,
  benefits,
  action,
  paymentLink,
}: SubscriptionCardProps) => {
  const handleSubscribe = () => {
    if (tier !== "Basic") {
      // Open the Stripe portal link in a new tab
      window.open(paymentLink, "_blank");
    }
  };
  return (
    <Card className="flex flex-col justify-between w-[300px] h-[400px] bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-2xl">{tier}</CardTitle>
        <CardDescription className="text-base">{price}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="list-disc pl-5">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-base">
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={tier === "Basic"}
          onClick={handleSubscribe}
        >
          {action}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
