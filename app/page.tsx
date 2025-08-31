import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">LocRaven</div>
          <div className="nav-links">
            <Link href="#pricing" className="nav-link">Pricing</Link>
            <Link href="/login" className="nav-cta">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Get discovered by AI in 60 seconds</h1>
            <p>Stop waiting months for SEO. LocRaven gets your business found by ChatGPT, Claude, and Perplexity instantly.</p>
            
            <div className="hero-cta">
              <Link href="/login" className="primary-btn">Get Started Free</Link>
              <p className="cta-subtext">No credit card required • 2-minute setup</p>
            </div>
            
            <div className="social-proof">
              <p>Private beta launching February 2025</p>
              <div className="ai-platforms">
                <div className="platform">ChatGPT</div>
                <div className="platform">Claude</div>
                <div className="platform">Perplexity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Validation */}
      <section className="market-validation">
        <div className="container">
          <h2>The AI Search Revolution</h2>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">112M+</div>
              <div className="stat-label">Americans used AI search tools in 2024</div>
            </div>
            <div className="stat">
              <div className="stat-number">50%+</div>
              <div className="stat-label">Google searches now show AI overviews</div>
            </div>
            <div className="stat">
              <div className="stat-number">6-12</div>
              <div className="stat-label">Months small businesses wait for SEO results</div>
            </div>
            <div className="stat">
              <div className="stat-number">$526B</div>
              <div className="stat-label">Digital marketing market growing 13% annually</div>
            </div>
            <div className="stat">
              <div className="stat-number">800M</div>
              <div className="stat-label">ChatGPT weekly active users in 2025</div>
            </div>
            <div className="stat">
              <div className="stat-number">94%</div>
              <div className="stat-label">Small businesses lack local SEO strategy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders">
        <div className="container">
          <h2>Founded by domain experts</h2>
          <div className="founders-grid">
            <div className="founder">
              <h3>Michael Chen</h3>
              <p className="founder-title">CTO & Co-Founder</p>
              <p className="founder-subtitle">Computer Science @ UC Riverside</p>
              <div className="credentials">
                <div className="credential">AMD University Program Award Winner</div>
                <div className="credential">Software Engineer Intern at MOBIVOLT</div>
                <div className="credential">Founded AI at UCR (50+ members)</div>
                <div className="credential">AI/ML Development & Systems Engineering</div>
              </div>
            </div>
            <div className="founder">
              <h3>Justin Tan</h3>
              <p className="founder-title">CEO & Co-Founder</p>
              <p className="founder-subtitle">Business Economics @ UC San Diego</p>
              <div className="credentials">
                <div className="credential">Associate Consultant Intern at Mastercard</div>
                <div className="credential">Associate Consultant Intern at West Monroe</div>
                <div className="credential">VP External Relations, Business Council UCSD</div>
                <div className="credential">Product Management & Market Research</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>Our AI Agent System</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Post your update</h3>
              <p>&ldquo;Fresh fish tacos until 10pm&rdquo;</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI agents optimize instantly</h3>
              <p>Our intelligent agent system analyzes your content and creates targeted pages optimized for ChatGPT, Claude, and Perplexity search patterns</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get discovered</h3>
              <p>Your business appears in AI search results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Validation */}
      <section className="validation">
        <div className="container">
          <h2>Why businesses need AI discovery now</h2>
          <div className="validation-content">
            <div className="problem">
              <h3>The Traditional SEO Problem</h3>
              <ul>
                <li>6-12 months to see Google ranking results</li>
                <li>$526B spent annually on digital marketing with slow ROI</li>
                <li>94% of small businesses lack local SEO strategy</li>
                <li>AI search tools reached 112M+ US users in 2024</li>
              </ul>
            </div>
            <div className="solution">
              <h3>LocRaven&apos;s Technical Innovation</h3>
              <ul>
                <li>AI-powered content optimization for ChatGPT, Claude, and Perplexity</li>
                <li>Real-time discovery tracking across AI platforms</li>
                <li>60-second setup vs 6-month traditional timeline</li>
                <li>Beta testing with local restaurant partners</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing">
        <div className="container">
          <h2>Simple pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">$29<span>/month</span></div>
              <ul>
                <li>10 updates per month</li>
                <li>50 AI-optimized pages</li>
                <li>Basic analytics</li>
                <li>Email support</li>
                <li>AI discovery tracking</li>
              </ul>
              <Link href="/login" className="plan-btn">Get Started</Link>
            </div>
            
            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Professional</h3>
              <div className="price">$99<span>/month</span></div>
              <ul>
                <li>50 updates per month</li>
                <li>250 AI-optimized pages</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom branding</li>
              </ul>
              <Link href="/login" className="plan-btn featured">Get Started</Link>
            </div>
            
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="price">Custom</div>
              <ul>
                <li>Unlimited updates</li>
                <li>Unlimited pages</li>
                <li>Custom integrations</li>
                <li>Dedicated support</li>
                <li>SLA guarantee</li>
              </ul>
              <Link href="/login" className="plan-btn">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to get discovered by AI?</h2>
          <p>Join thousands of businesses already getting found by AI assistants</p>
          <Link href="/login" className="cta-btn">Get Started Free</Link>
          <p className="guarantee">30-day money-back guarantee</p>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <h3>LocRaven</h3>
                <p>AI-discoverable business updates in 60 seconds</p>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#pricing">Pricing</a></li>
                <li><Link href="/login">Get Started</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/chat">AI Chat</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><Link href={"/blog" as any}>Blog</Link></li>
                <li><Link href={"/careers" as any}>Careers</Link></li>
                <li><Link href={"/contact" as any}>Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link href={"/help" as any}>Help Center</Link></li>
                <li><Link href={"/docs" as any}>Documentation</Link></li>
                <li><Link href={"/api" as any}>API</Link></li>
                <li><Link href={"/status" as any}>Status</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><Link href={"/privacy" as any}>Privacy Policy</Link></li>
                <li><Link href={"/terms" as any}>Terms of Service</Link></li>
                <li><Link href={"/security" as any}>Security</Link></li>
                <li><Link href={"/compliance" as any}>Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 LocRaven. All rights reserved.</p>
              <div className="footer-social">
                <a href="https://twitter.com/locraven" aria-label="Twitter">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/locraven" aria-label="LinkedIn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://youtube.com/@locraven" aria-label="YouTube">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}