import Link from 'next/link';

const links: { href: string; title: string }[] = [
  { href: '/', title: 'Terms of service' },
  { href: '/', title: 'Privacy Policy' },
  { href: '/', title: 'Cookie Policy' },
  { href: '/', title: 'Accesibility' },
  { href: '/', title: 'Adds info' },
  { href: '/', title: '©2024 CrunchyFans' },
];

export function Sidebar() {
  return (
    <div className="flex flex-col px-5 py-2">
      <nav className="flex flex-col items-center">
        {links.map(({ href, title }, i) => (
          <Link href={href} key={i}>
            <span className="text-nowrap text-xs text-muted-foreground hover:underline">
              {title}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
