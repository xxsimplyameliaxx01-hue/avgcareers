import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Our Mission', href: '#' },
    { name: 'Leadership', href: '#' },
    { name: 'Press', href: '#' },
  ],
  careers: [
    { name: 'Open Positions', href: '/jobs' },
    { name: 'My Applications', href: '/applications' },
    { name: 'Benefits', href: '#' },
    { name: 'Culture', href: '#' },
  ],
  resources: [
    { name: 'Blog', href: '#' },
    { name: 'Help Center', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary p-1.5">
                <Image
                  src="/logo-white.png"
                  alt="avio group logo"
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">avio group</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Building the future of technology, one innovation at a time.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Careers</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.careers.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} avio group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
