import { useState } from 'react'
import { Send, Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@smartstudyhub.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
  ]

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
            Have questions or feedback? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-xl border bg-white p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Send className="h-8 w-8" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">Message Sent!</h2>
                <p className="mb-6 text-[var(--muted-foreground)]">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary)]/80"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-none rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-[var(--primary)]/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="rounded-xl border bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--primary)] shadow-sm">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">{item.label}</p>
                      <p className="font-medium text-[var(--foreground)]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">FAQs</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">How do I track my progress?</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Visit the Progress page to see your learning journey and completed courses.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Are the courses free?</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Yes! All courses are free to access. We curate the best resources from around the web.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Can I suggest a course?</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Absolutely! Use the contact form to suggest new courses or topics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
