import { ClubBadge } from "./ClubBadge";
import { normalizeTeamName } from "@/utils/teamUtils";
import { type KnockoutMatch } from "@/data/libertadores2025";

interface KnockoutCardProps {
  match: KnockoutMatch;
  label?: string;
}

export function KnockoutCard({ match, label }: KnockoutCardProps) {
  const isWinner1 = match.winner === match.team1;
  const isWinner2 = match.winner === match.team2;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {label && <div className="bg-slate-800 text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 text-center">{label}</div>}
      <div className="p-4 space-y-2">
        <div className={`flex items-center justify-between gap-3 p-3 rounded-xl ${isWinner1 ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted/50'}`}>
          <div className="flex items-center gap-3 min-w-0"><ClubBadge clubName={match.team1} size="sm" /><span className="font-bold text-sm truncate text-foreground">{normalizeTeamName(match.team1)}</span></div>
          {isWinner1 && <span className="text-green-500 text-[10px] font-black">AVANÇOU ✓</span>}
        </div>
        <div className="text-center py-1"><span className="text-[10px] font-black text-muted-foreground uppercase">AGG: {match.agg}</span></div>
        <div className={`flex items-center justify-between gap-3 p-3 rounded-xl ${isWinner2 ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted/50'}`}>
          <div className="flex items-center gap-3 min-w-0"><ClubBadge clubName={match.team2} size="sm" /><span className="font-bold text-sm truncate text-foreground">{normalizeTeamName(match.team2)}</span></div>
          {isWinner2 && <span className="text-green-500 text-[10px] font-black">AVANÇOU ✓</span>}
        </div>
      </div>
    </div>
  );
}

