'use client'

const PERSONAL_BRAND_TEAM = [
  { name: 'TBD', role: 'Video Editor', area: 'personal_brand', status: 'active' },
  { name: 'TBD', role: 'Graphic Designer', area: 'personal_brand', status: 'active' },
  { name: 'VACANT', role: 'Social Media Manager', area: 'personal_brand', status: 'hiring', note: 'Previous manager resigned — urgent hire' },
]

const STARTUPS_TEAM = [
  { name: 'TBD', role: 'Marketing Expert (Skryve)', area: 'skryve', status: 'active' },
  { name: 'TBD', role: 'Product Designer', area: 'skryve', status: 'active' },
  { name: 'TBD', role: 'UI/UX Designer', area: 'nexus', status: 'active' },
  { name: 'TBD', role: 'Customer Success', area: 'skryve', status: 'active' },
]

const CHURCH_UNITS = [
  { unit: 'Photography', leader: 'Unit Leader', members: 18 },
  { unit: 'Videography', leader: 'Unit Leader', members: 22 },
  { unit: 'Graphics & Design', leader: 'Unit Leader', members: 15 },
  { unit: 'Audio Engineering', leader: 'Unit Leader', members: 12 },
  { unit: 'Live Streaming', leader: 'Unit Leader', members: 10 },
  { unit: 'Social Media', leader: 'Unit Leader', members: 25 },
  { unit: 'Production', leader: 'Unit Leader', members: 18 },
]

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-400/10 text-green-400 border-green-400/20',
  hiring: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
  inactive: 'bg-gray-600/10 text-gray-500 border-gray-600/20',
}

const AREA_COLORS: Record<string, string> = {
  personal_brand: 'text-[#C9A84C]',
  skryve: 'text-blue-400',
  nexus: 'text-purple-400',
  church: 'text-green-400',
}

export default function TeamPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#C9A84C]">Team Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">Personal brand · Startups · Church media</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#C9A84C]">4</div>
          <div className="text-xs text-gray-500 mt-1">Personal Brand Team</div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">4</div>
          <div className="text-xs text-gray-500 mt-1">Startups Team</div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">120+</div>
          <div className="text-xs text-gray-500 mt-1">Church Media Team</div>
        </div>
      </div>

      {/* Personal Brand Team */}
      <div className="mb-8">
        <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
          PERSONAL BRAND TEAM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERSONAL_BRAND_TEAM.map((member, i) => (
            <div key={i} className={`bg-[#111111] border rounded-xl p-4 ${member.status === 'hiring' ? 'border-orange-400/30' : 'border-[#222222]'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  member.status === 'hiring' ? 'bg-orange-400/10 text-orange-400' : 'bg-[#C9A84C] text-black'
                }`}>
                  {member.status === 'hiring' ? '?' : member.name[0] || 'T'}
                </div>
                <span className={`text-xs border rounded px-1.5 py-0.5 font-mono ${STATUS_STYLES[member.status]}`}>
                  {member.status}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">{member.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{member.role}</div>
              {member.note && (
                <div className="text-xs text-orange-400/80 mt-2 bg-orange-400/5 rounded p-2">{member.note}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Startups Team */}
      <div className="mb-8">
        <h2 className="text-sm font-mono font-bold text-blue-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          STARTUPS TEAM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STARTUPS_TEAM.map((member, i) => (
            <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 text-blue-400 flex items-center justify-center text-sm font-bold">
                  T
                </div>
                <span className={`text-xs font-mono ${AREA_COLORS[member.area]}`}>{member.area}</span>
              </div>
              <div className="text-sm font-semibold text-white">{member.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{member.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Church Media Team */}
      <div>
        <h2 className="text-sm font-mono font-bold text-green-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          CHURCH MEDIA TEAM — 7 UNITS (120+ MEMBERS)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CHURCH_UNITS.map((unit, i) => (
            <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-1">{unit.unit}</div>
              <div className="text-xs text-gray-500">{unit.leader}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600 font-mono">Members</span>
                <span className="text-sm font-bold text-green-400 font-mono">{unit.members}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Banner */}
      <div className="mt-8 bg-orange-400/5 border border-orange-400/20 rounded-xl p-5">
        <div className="font-semibold text-orange-400 mb-1">🚨 Urgent: Hire Social Media Manager</div>
        <div className="text-sm text-gray-400">
          Your previous social media manager resigned. This is a critical gap for your personal brand growth.
          Tell BRAIN to help you write a job description and recruitment plan.
        </div>
      </div>
    </div>
  )
}
