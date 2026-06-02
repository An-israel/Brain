'use client'

const GTM_STEPS = [
  { step: 1, title: 'Cold outreach to Lagos SMEs', desc: 'Identify 50 SMEs on LinkedIn and Instagram. DM founders directly with a short value prop and free trial offer.' },
  { step: 2, title: 'Create LinkedIn content series', desc: 'Post 3x/week on HR pain points for African SMEs — attendance, payroll errors, team management. Build authority.' },
  { step: 3, title: 'Free 30-day trial offer', desc: 'Remove friction: "Get Nexus free for 30 days, no card required." Convert on value, then upsell.' },
  { step: 4, title: 'Target SME WhatsApp communities', desc: 'Join Nigerian SME and founders\' groups. Share value (HR tips), not spam. Build trust before pitching.' },
  { step: 5, title: 'Partner with business coaches', desc: 'Find 3-5 coaches who work with SMEs. Offer referral commissions for each client they bring.' },
  { step: 6, title: 'Cold email campaign', desc: 'Source 200 SME emails from Apollo or LinkedIn. Send personalized 3-email sequence over 2 weeks.' },
  { step: 7, title: 'Demo webinar for SME owners', desc: 'Host a free 45-min "HR made easy for SMEs" webinar. Demo Nexus at the end. Capture warm leads.' },
  { step: 8, title: 'Case study from pilot users', desc: 'Convert 2-3 free trial users to case studies. "This Lagos retail business saved 8 hrs/week on HR."' },
  { step: 9, title: 'Referral program', desc: 'Every paying client gets a unique referral link. ₦5K discount per referred client who converts.' },
  { step: 10, title: 'Paid Meta ads (small budget)', desc: 'Run ₦20K/month in targeted Facebook/Instagram ads to SME founders in Lagos, Abuja, PH.' },
]

const TARGETS = [
  { label: '10 Paying Clients', value: '10', desc: 'End of month 1', color: 'text-[#C9A84C]' },
  { label: '₦50K/month from Nexus', value: '₦50K', desc: 'Recurring revenue', color: 'text-green-400' },
  { label: '3 Case Studies', value: '3', desc: 'Social proof assets', color: 'text-blue-400' },
]

export default function NexusPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#C9A84C] font-mono tracking-widest">NEXUS HQ</h1>
          <span className="text-xs font-mono bg-orange-500 text-black px-3 py-1 rounded font-bold">NEEDS GTM</span>
        </div>
        <p className="text-gray-400 text-sm">HR &amp; Team Ops Platform for African SMEs</p>
      </div>

      {/* Product Status */}
      <div className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-6 mb-8">
        <div className="text-xs font-mono text-[#C9A84C] tracking-widest mb-4">PRODUCT STATUS</div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-sm text-green-400 font-mono font-bold">Built ✓</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-sm text-green-400 font-mono font-bold">Tested ✓</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            <span className="text-sm text-red-400 font-mono font-bold">Growing ✗</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
          Nexus is a built and tested HR &amp; team ops platform designed for African SMEs who struggle with
          attendance tracking, payroll, and team management. The product works — the gap is go-to-market.
          Aniekan runs this solo. The mission: get 10 paying SME clients in the next 30 days.
        </p>
      </div>

      {/* GTM Strategy */}
      <div className="mb-8">
        <div className="text-xs font-mono text-[#C9A84C] tracking-widest mb-4">GTM STRATEGY — 10 LEAN STEPS TO FIRST 10 CLIENTS</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GTM_STEPS.map((s) => (
            <div key={s.step} className="bg-[#111111] border border-[#222222] rounded-xl p-5 flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-[#C9A84C11] border border-[#C9A84C33] flex items-center justify-center">
                <span className="text-xs font-bold font-mono text-[#C9A84C]">{s.step}</span>
              </div>
              <div>
                <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Metrics */}
      <div className="mb-8">
        <div className="text-xs font-mono text-[#C9A84C] tracking-widest mb-4">TARGET METRICS</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TARGETS.map((t, i) => (
            <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-6 text-center">
              <div className={`text-2xl font-bold font-mono mb-1 ${t.color}`}>{t.value}</div>
              <div className="text-xs font-mono text-white mb-1">{t.label}</div>
              <div className="text-xs text-gray-600">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Solo operator note */}
      <div className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-5">
        <div className="flex gap-3">
          <span className="text-[#C9A84C] font-mono text-sm shrink-0">BRAIN:</span>
          <p className="text-sm text-gray-300 leading-relaxed">
            Nexus is your most monetizable product right now because it&apos;s already built. Every day without
            clients is a day leaving money on the table. Start the outreach today — even 10 DMs to SME founders
            is progress. One &quot;yes&quot; changes the revenue picture.
          </p>
        </div>
      </div>
    </div>
  )
}
