import { useState } from 'react'
import { Send, ArrowRight, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

const newsletterSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

type NewsletterForm = z.infer<typeof newsletterSchema>

const footerLinks = {
  Marketplace: ['All Auctions', 'Art & Paintings', 'Technology', 'Collectibles', 'Fashion', 'Jewelry'],
  Company: ['About Us', 'How It Works', 'Trust & Safety', 'Careers', 'Press'],
  Support: ['Help Center', 'Seller Guide', 'Buyer Protection', 'Shipping Info', 'Contact Us'],
  Legal: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'],
}

export function Footer() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = (data: NewsletterForm) => {
    toast.success(`Subscribed with ${data.email}. Welcome aboard!`)
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter CTA */}
      <div className="border-b border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left">
              <h3
                className="text-xl sm:text-2xl font-bold text-balance"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Never miss a rare find
              </h3>
              <p className="mt-1 text-sm text-primary-foreground/60">
                Get notified about trending auctions and exclusive drops.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full max-w-md gap-2"
            >
              <div className="flex-1 relative">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-bid focus:ring-2 focus:ring-bid/20 transition-all"
                />
                {errors.email && (
                  <p className="absolute -bottom-5 left-0 text-[10px] text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="flex items-center gap-2 rounded-lg bg-bid px-5 py-3 text-sm font-semibold text-bid-foreground transition-all hover:bg-bid/90 disabled:opacity-60 shrink-0"
              >
                {submitted ? (
                  'Subscribed!'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-lg bg-primary-foreground/10 p-1.5">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Aucto
              </span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/50 max-w-xs">
              The trusted marketplace for premium auctions. Buy and sell with confidence.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40">
                {title}
              </h4>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group flex items-center text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link}
                      <ArrowRight className="ml-1 h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-primary-foreground/40">
              {'2026 BidVault. All rights reserved.'}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-primary-foreground/40 hover:text-primary-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-xs text-primary-foreground/40 hover:text-primary-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-xs text-primary-foreground/40 hover:text-primary-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
