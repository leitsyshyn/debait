import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";

interface LinkifyProps {
  children: React.ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <Link
          className="hover:underline underline-offset-4 text-muted-foreground"
          key={key}
          href={`/user/${match.slice(1)}`}
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <Link key={key} href={`/${match.slice(1)}`}>
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  return <LinkItUrl>{children}</LinkItUrl>;
}
