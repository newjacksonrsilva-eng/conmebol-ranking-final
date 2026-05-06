import { getClubColor } from '@/data/clubColors';
import { getTeamLogoById } from '@/data/teamLogos';
import { normalizeTeamName } from '@/utils/teamUtils';

interface ClubBadgeProps {
  clubName: string;
  teamId?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export function ClubBadge({ clubName, teamId, size = 'md' }: ClubBadgeProps) {
  const normalizedName = normalizeTeamName(clubName);

  const escudoUrl = getTeamLogoById(teamId) || '/logos/default.png';

  const colors = getClubColor(normalizedName);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl shadow-sm border border-border flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800 transition-colors`}
    >
      <img
        src={escudoUrl}
        alt={normalizedName}
        className="w-full h-full object-contain p-1"
        loading="eager"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/logos/default.png';
        }}
      />
    </div>
  );
}