import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

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
