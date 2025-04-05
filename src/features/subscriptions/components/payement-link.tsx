import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

interface PaymentLinkProps {
  href: string;
  paymentLink?: string;
  text?: string;
}

const PaymentLink = ({ href, paymentLink, text }: PaymentLinkProps) => {
  return (
    <Link
      href={href}
      className={buttonVariants()}
      onClick={() => {
        if (paymentLink) {
          localStorage.setItem("paymentLink", paymentLink);
        }
      }}
    >
      {text}
    </Link>
  );
};

export default PaymentLink;
