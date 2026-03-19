import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, Globe, Users, Factory, Shield, Leaf, ArrowRight, CheckCircle, TrendingUp } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const milestones = [
  { year: "2009", title: "Founded in Lahore",     desc: "Started as a family-run tannery supplying local markets with handcrafted leather goods." },
  { year: "2012", title: "First Export Order",    desc: "Secured our first international contract with a European fashion retailer — 2,000 jackets." },
  { year: "2015", title: "Platform Launch",       desc: "Launched the Global Leather Hub digital platform to serve wholesale buyers directly." },
  { year: "2018", title: "ISO 9001 Certified",    desc: "Achieved ISO 9001 certification and expanded to 50,000 units per month." },
  { year: "2021", title: "50+ Countries",         desc: "Crossed the milestone of serving buyers across 50 countries on six continents." },
  { year: "2024", title: "Sustainable Line",      desc: "Launched eco-conscious leather line using chrome-free tanning and recycled packaging." },
];

const values = [
  { icon: Shield,     title: "Uncompromising Quality",  desc: "Every piece passes a 12-point quality inspection before leaving our factory." },
  { icon: Globe,      title: "Global Partnerships",     desc: "We build long-term relationships, not one-time transactions. Consistency keeps buyers returning." },
  { icon: Leaf,       title: "Responsible Sourcing",    desc: "We work exclusively with certified tanneries adhering to environmental and labor standards." },
  { icon: TrendingUp, title: "Buyer Success First",     desc: "Tiered pricing, flexible MOQs, and dedicated account managers for every buyer." },
];

const team = [
  { name: "Ahmed Raza",     role: "Founder & CEO",               bio: "20+ years in leather manufacturing. Grew from a 5-person tannery to an international platform.", initial: "A" },
  { name: "Sarah Mitchell", role: "Head of International Sales", bio: "Former fashion buyer with 15 years experience. Oversees NA and European relationships.",          initial: "S" },
  { name: "Liu Wei",        role: "Quality Assurance Director",  bio: "Led quality systems for Fortune 500 manufacturers. Ensures global compliance standards.",         initial: "L" },
  { name: "Fatima Khan",    role: "Head of Design & Product",    bio: "Award-winning leather goods designer driving trend forecasting and new collections.",             initial: "F" },
];

const certs = [
  "ISO 9001:2015 Quality Management",
  "REACH Compliance Certified",
  "Leather Working Group (LWG) Rated",
  "OEKO-TEX® STANDARD 100",
  "Fair Labor Association Member",
  "Chrome-Free Tanning Available",
];

export default function AboutPage() {
  useScrollReveal([]);

  return (
    <div className="bg-canvas min-h-screen page-enter">

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 overflow-hidden min-h-[70vh] flex items-end">
        <img
          src="/images/about-hero.webp"
          alt="Leather craftsman at work"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/60 to-canvas/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas/70 via-canvas/30 to-transparent" />

        {/* Decorative vertical text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 animate-fade-in stagger-6">
          <div className="w-px h-20 bg-tan/30" />
          <span className="text-tan/40 text-[9px] tracking-[0.4em] uppercase" style={{ writingMode: "vertical-rl" }}>Est. 2009</span>
          <div className="w-px h-20 bg-tan/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <p className="eyebrow mb-4 animate-fade-up">Our Story</p>
          <h1
            className="text-espresso leading-[1.05] mb-6 animate-fade-up stagger-1"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 400 }}
          >
            Crafted with Passion,
            <br />
            <em style={{ fontStyle: 'italic', color: '#8B5E3C' }}>Delivered with Purpose.</em>
          </h1>
          <p className="text-fog font-light leading-relaxed max-w-xl text-base animate-fade-up stagger-2">
            For over 15 years, Global Leather Hub has been the trusted bridge between premium leather
            craftsmanship and international wholesale buyers — from our factory floors in Lahore to
            warehouses on six continents.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-espresso py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Factory, value: "50K+",   label: "Units / Month" },
              { icon: Globe,   value: "50+",    label: "Countries" },
              { icon: Users,   value: "5,000+", label: "Partners" },
              { icon: Award,   value: "15+",    label: "Years" },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={label} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <Icon className="w-4 h-4 text-tan mx-auto mb-3" />
                <p className="text-3xl text-tan mb-1" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>{value}</p>
                <p className="text-paper/40 text-[10px] tracking-widest uppercase font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="reveal-left">
            <p className="eyebrow mb-4">Our Mission</p>
            <h2 className="text-espresso leading-tight mb-6"
              style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 400 }}>
              Making premium leather
              <br /><em style={{ fontStyle: 'italic', color: '#8B5E3C' }}>accessible worldwide.</em>
            </h2>
            <p className="text-fog font-light leading-relaxed mb-5 text-sm">
              We started with one belief: international buyers shouldn't have to compromise on quality
              for competitive wholesale prices. By building direct factory relationships, we pass those savings to you.
            </p>
            <p className="text-fog/70 font-light leading-relaxed mb-8 text-sm">
              Today, Global Leather Hub powers thousands of retail businesses — from boutique leather shops
              in Paris to department store chains in Chicago.
            </p>
            <div className="space-y-3">
              {[
                "Direct factory pricing with no hidden markups",
                "Dedicated account manager for every buyer",
                "Custom branding and private label available",
                "Real-time order tracking and logistics support",
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-3 reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <CheckCircle className="w-4 h-4 text-tan mt-0.5 flex-shrink-0" />
                  <span className="text-espresso/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] reveal-right">
            <img
              src="/images/about-craft.webp"
              alt="Premium leather goods craftsmanship"
              className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-espresso/30 to-transparent" />
            <div className="absolute -bottom-6 -left-6 bg-paper rounded-2xl shadow-card px-5 py-4 border border-border animate-float">
              <p className="text-fog text-[10px] uppercase tracking-widest mb-1">Avg. Rating</p>
              <p className="text-espresso text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>4.9 / 5.0</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-espresso rounded-2xl shadow-card px-5 py-3 text-center animate-float" style={{ animationDelay: "1.5s" }}>
              <p className="text-tan text-sm tracking-widest font-semibold">ISO</p>
              <p className="text-paper text-xs">9001 Certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section-linen py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14 reveal">
            <p className="eyebrow mb-3">What Drives Us</p>
            <h2 className="text-espresso" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}>
              Our Core <em style={{ fontStyle: 'italic', color: '#8B5E3C' }}>Values</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="card card-lift group reveal"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="w-10 h-10 bg-tan/10 border border-tan/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-tan/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-tan" />
                </div>
                <h3 className="text-espresso mb-2 text-lg" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>
                  {title}
                </h3>
                <p className="text-fog text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leather Process Showcase ── */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16 reveal">
            <p className="eyebrow mb-3">The Craft</p>
            <h2 className="text-espresso" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}>
              From Hide to
              <em style={{ fontStyle: 'italic', color: '#8B5E3C' }}> Finished Good</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { img: "/images/about-process-raw.webp", label: "Raw Material Selection", desc: "Premium hides sourced from certified suppliers" },
              { img: "/images/about-process-tanning.webp", label: "Artisan Tanning",         desc: "Traditional and modern techniques combined" },
              { img: "/images/about-process-finish.webp", label: "Quality Finishing",       desc: "12-point inspection on every finished piece" },
            ].map(({ img, label, desc }, i) => (
              <div key={label} className="group relative rounded-3xl overflow-hidden h-72 img-zoom reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                <img src={img} alt={label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-tan text-[10px] uppercase tracking-widest mb-1 font-medium">{`0${i + 1}`}</p>
                  <p className="text-paper text-lg" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>{label}</p>
                  <p className="text-paper/60 text-xs mt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section-paper py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16 reveal">
            <p className="eyebrow mb-3">Our Journey</p>
            <h2 className="text-espresso" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}>
              15 Years of <em style={{ fontStyle: 'italic', color: '#8B5E3C' }}>Growth</em>
            </h2>
          </div>
          <div className="relative max-w-3xl">
            <div className="absolute left-[4.5rem] top-0 bottom-0 w-px border-l border-dashed border-border" />
            <div className="space-y-10">
              {milestones.map(({ year, title, desc }, i) => (
                <div key={year} className="flex gap-8 group reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="w-16 flex-shrink-0 text-right pt-0.5">
                    <span className="text-tan text-base" style={{ fontFamily: '"Playfair Display", serif' }}>{year}</span>
                  </div>
                  <div className="flex items-start pt-2 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-border group-hover:bg-tan transition-all duration-300 group-hover:scale-125 border-2 border-canvas" style={{ marginLeft: '-6px' }} />
                  </div>
                  <div className="pb-8">
                    <h3 className="text-espresso text-lg mb-1.5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>{title}</h3>
                    <p className="text-fog text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14 reveal">
            <p className="eyebrow mb-3">Leadership</p>
            <h2 className="text-espresso" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}>
              Meet the <em style={{ fontStyle: 'italic', color: '#8B5E3C' }}>Team</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map(({ name, role, bio, initial }, i) => (
              <div key={name} className="card card-lift group overflow-hidden reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="w-16 h-16 rounded-full bg-linen border border-border flex items-center justify-center mb-4 group-hover:border-tan/50 transition-colors duration-300">
                  <span className="text-sienna text-2xl group-hover:scale-110 inline-block transition-transform duration-300" style={{ fontFamily: '"Playfair Display", serif' }}>{initial}</span>
                </div>
                <h3 className="text-espresso text-lg mb-0.5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>{name}</h3>
                <p className="text-tan text-[11px] tracking-wide font-medium mb-3">{role}</p>
                <p className="text-fog text-xs leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="section-linen py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14 reveal">
            <p className="eyebrow mb-3">Compliance & Quality</p>
            <h2 className="text-espresso" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}>
              Our <em style={{ fontStyle: 'italic', color: '#8B5E3C' }}>Certifications</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert, i) => (
              <div key={cert} className="card flex items-center gap-4 card-lift group reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="w-9 h-9 bg-tan/10 border border-tan/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-tan/20 transition-colors duration-300">
                  <Award className="w-4 h-4 text-tan" />
                </div>
                <span className="text-espresso/80 text-sm font-light">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-espresso py-24 relative overflow-hidden">
        <img
          src="/images/cta-factory.webp"
          alt="Leather workshop"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-tan/10 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <p className="eyebrow text-tan mb-5 reveal">Ready to Partner?</p>
          <h2 className="text-paper leading-tight mb-4 reveal stagger-1"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 400 }}>
            Let's Build Something <em style={{ fontStyle: 'italic', color: '#C9A97A' }}>Lasting.</em>
          </h2>
          <p className="text-paper/50 text-sm font-light mb-10 reveal stagger-2">
            Join thousands of retailers who trust Global Leather Hub for consistent quality and unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-3 justify-center reveal stagger-3">
            <Link to="/register" className="btn-tan">Get Started <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/contact" className="btn-outline border-paper/30 text-paper hover:bg-paper/10 hover:border-paper/60">Talk to Sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

