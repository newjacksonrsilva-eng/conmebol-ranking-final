import { useMemo, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit2,
  Plus,
  RotateCcw,
  Save,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type AdminTab = 'results' | 'discipline' | 'createMatch' | 'teams';
type MatchStatus = 'scheduled' | 'in_progress' | 'completed';

const statusLabel: Record<MatchStatus, string> = {
  scheduled: 'Agendado',
  in_progress: 'Em andamento',
  completed: 'Finalizado',
};

const statusClasses: Record<MatchStatus, string> = {
  scheduled: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
  in_progress: 'border-yellow-500/25 bg-yellow-500/10 text-yellow-300',
  completed: 'border-green-500/25 bg-green-500/10 text-green-300',
};

const groupOptions = ['Todos', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const phaseOptions = [
  'Fase de Grupos',
  'Oitavas',
  'Quartas',
  'Semifinal',
  'Final',
];

function normalizeStatus(status?: string): MatchStatus {
  if (status === 'completed') return 'completed';
  if (status === 'in_progress') return 'in_progress';
  return 'scheduled';
}

function getTeamName(teams: any[] | undefined, teamId: number) {
  return teams?.find((team: any) => team.id === teamId)?.name || `Time ${teamId}`;
}

function getMatchDateLabel(matchDate: string | Date) {
  try {
    return new Date(matchDate).toLocaleDateString('pt-BR');
  } catch {
    return 'Data indefinida';
  }
}

function ScoreInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <Input
        type="number"
        inputMode="numeric"
        min="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0"
        className="h-14 w-16 rounded-2xl border-slate-700 bg-slate-950 text-center text-2xl font-black text-white"
      />
    </div>
  );
}

function QuickScoreCard({
  match,
  teams,
  scoreDraft,
  onDraftChange,
  onSave,
  onSetInProgress,
  onClear,
  isSaving,
}: {
  match: any;
  teams: any[] | undefined;
  scoreDraft: { homeScore: string; awayScore: string };
  onDraftChange: (value: { homeScore: string; awayScore: string }) => void;
  onSave: () => void;
  onSetInProgress: () => void;
  onClear: () => void;
  isSaving: boolean;
}) {
  const status = normalizeStatus(match.status);
  const homeName = match.homeTeam?.name || getTeamName(teams, match.homeTeamId);
  const awayName = match.awayTeam?.name || getTeamName(teams, match.awayTeamId);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-950 p-4 shadow-xl">
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:22px_22px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_45%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-blue-200">
                <Trophy className="h-3 w-3" />
                {match.phase}
              </span>

              {match.group && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-300">
                  Grupo {match.group}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {getMatchDateLabel(match.matchDate)}
            </div>
          </div>

          <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusClasses[status]}`}>
            {statusLabel[status]}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_160px_1fr] items-center gap-3">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-right">
            <p className="truncate text-sm font-black text-white">
              {homeName}
            </p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
              Mandante
            </p>
          </div>

          <div className="flex items-end justify-center gap-2">
            <ScoreInput
              label="Casa"
              value={scoreDraft.homeScore}
              onChange={(value) => onDraftChange({ ...scoreDraft, homeScore: value })}
            />
            <div className="pb-4 text-xl font-black text-slate-500">x</div>
            <ScoreInput
              label="Fora"
              value={scoreDraft.awayScore}
              onChange={(value) => onDraftChange({ ...scoreDraft, awayScore: value })}
            />
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
            <p className="truncate text-sm font-black text-white">
              {awayName}
            </p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
              Visitante
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-2xl bg-green-600 font-black text-white hover:bg-green-500"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar final
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onSetInProgress}
            disabled={isSaving}
            className="rounded-2xl border-yellow-500/30 bg-yellow-500/10 font-black text-yellow-200 hover:bg-yellow-500/20"
          >
            <Clock className="mr-2 h-4 w-4" />
            Em andamento
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={isSaving}
            className="rounded-2xl border-slate-700 bg-slate-950 font-black text-slate-300 hover:bg-slate-900"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('results');
  const [season, setSeason] = useState('2026');
  const [selectedGroup, setSelectedGroup] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState<'all' | MatchStatus>('all');

  const {
    data: matches,
    isLoading: matchesLoading,
    refetch: refetchMatches,
  } = trpc.libertadores.matches.list.useQuery({ season: Number(season) });

  const { data: teams, isLoading: teamsLoading, refetch: refetchTeams } =
    trpc.libertadores.teams.list.useQuery();

  const {
    data: discipline,
    refetch: refetchDiscipline,
  } = trpc.libertadores.discipline.list.useQuery({ season: Number(season) });

  const createMatchMutation = trpc.libertadores.matches.create.useMutation({
    onSuccess: () => {
      refetchMatches();
      alert('Jogo criado com sucesso!');
    },
  });

  const updateMatchMutation = trpc.libertadores.matches.update.useMutation({
    onSuccess: () => {
      refetchMatches();
    },
  });

  const createTeamMutation = trpc.libertadores.teams.create.useMutation({
    onSuccess: () => {
      refetchTeams();
      alert('Time criado com sucesso!');
    },
  });

  const upsertDisciplineMutation = trpc.libertadores.discipline.upsert.useMutation({
    onSuccess: () => {
      refetchDiscipline();
    },
  });

  const [newMatch, setNewMatch] = useState({
    homeTeamId: '',
    awayTeamId: '',
    phase: 'Fase de Grupos',
    group: 'A',
    matchDate: new Date().toISOString().split('T')[0],
  });

  const [newTeam, setNewTeam] = useState({
    name: '',
    country: '',
  });

  const [scoreDrafts, setScoreDrafts] = useState<Record<number, { homeScore: string; awayScore: string }>>({});
  const [disciplineGroup, setDisciplineGroup] = useState('A');
  const [disciplineDrafts, setDisciplineDrafts] = useState<Record<string, { yellowCards: string; redCards: string }>>({});

  const filteredMatches = useMemo(() => {
    return (matches || [])
      .filter((match: any) => {
        if (selectedGroup !== 'Todos' && match.group !== selectedGroup) return false;
        if (selectedStatus !== 'all' && normalizeStatus(match.status) !== selectedStatus) return false;
        return true;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.matchDate).getTime();
        const dateB = new Date(b.matchDate).getTime();

        if (dateA !== dateB) return dateA - dateB;

        return Number(a.id) - Number(b.id);
      });
  }, [matches, selectedGroup, selectedStatus]);

  const matchesByGroup = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    filteredMatches.forEach((match: any) => {
      const key = match.group ? `Grupo ${match.group}` : match.phase || 'Sem grupo';

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(match);
    });

    return grouped;
  }, [filteredMatches]);

  const getDraft = (match: any) => {
    return scoreDrafts[match.id] || {
      homeScore: match.homeScore === null || match.homeScore === undefined ? '' : String(match.homeScore),
      awayScore: match.awayScore === null || match.awayScore === undefined ? '' : String(match.awayScore),
    };
  };

  const setDraft = (matchId: number, value: { homeScore: string; awayScore: string }) => {
    setScoreDrafts((previous) => ({
      ...previous,
      [matchId]: value,
    }));
  };

  const getDisciplineData = (teamId: number) => {
    return discipline?.find((item: any) => item.teamId === teamId && item.group === disciplineGroup);
  };

  const getDisciplineDraft = (teamId: number) => {
    const key = `${disciplineGroup}-${teamId}`;
    const data = getDisciplineData(teamId);

    return disciplineDrafts[key] || {
      yellowCards: data?.yellowCards === null || data?.yellowCards === undefined ? '0' : String(data.yellowCards),
      redCards: data?.redCards === null || data?.redCards === undefined ? '0' : String(data.redCards),
    };
  };

  const setDisciplineDraft = (
    teamId: number,
    value: { yellowCards: string; redCards: string }
  ) => {
    const key = `${disciplineGroup}-${teamId}`;

    setDisciplineDrafts((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const saveDiscipline = (teamId: number) => {
    const draft = getDisciplineDraft(teamId);

    upsertDisciplineMutation.mutate({
      season: Number(season),
      group: disciplineGroup,
      teamId,
      yellowCards: Number(draft.yellowCards || 0),
      redCards: Number(draft.redCards || 0),
    });
  };

  const saveResult = (match: any) => {
    const draft = getDraft(match);

    if (draft.homeScore === '' || draft.awayScore === '') {
      alert('Preencha os dois placares antes de salvar.');
      return;
    }

    updateMatchMutation.mutate({
      id: match.id,
      homeScore: Number(draft.homeScore),
      awayScore: Number(draft.awayScore),
      status: 'completed',
    });
  };

  const setInProgress = (match: any) => {
    const draft = getDraft(match);
    const payload: any = {
      id: match.id,
      status: 'in_progress',
    };

    if (draft.homeScore !== '' && draft.awayScore !== '') {
      payload.homeScore = Number(draft.homeScore);
      payload.awayScore = Number(draft.awayScore);
    }

    updateMatchMutation.mutate(payload);
  };

  const clearResult = (match: any) => {
    setDraft(match.id, { homeScore: '', awayScore: '' });

    updateMatchMutation.mutate({
      id: match.id,
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
    });
  };

  // Check admin access - comentado para desenvolvimento local
  // if (!isAuthenticated || user?.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen bg-background p-4">
  //       <div className="max-w-2xl mx-auto mt-20">
  //         <Alert variant="destructive">
  //           <AlertCircle className="h-4 w-4" />
  //           <AlertDescription>
  //             Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar jogos e times.
  //           </AlertDescription>
  //         </Alert>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-200">
                <Shield className="h-4 w-4" />
                Painel de Admin
              </div>

              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white md:text-4xl">
                Libertadores Manager
              </h1>

              <p className="mt-2 text-sm font-medium text-slate-400">
                Adicione resultados, jogos e times sem brigar com planilha.
              </p>
            </div>

            <div className="w-full max-w-xs">
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Temporada
              </label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">Libertadores 2026</SelectItem>
                  <SelectItem value="2025">Libertadores 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('results')}
            className={`rounded-2xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition ${
              activeTab === 'results'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Resultados rápidos
          </button>

          <button
            onClick={() => setActiveTab('discipline')}
            className={`rounded-2xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition ${
              activeTab === 'discipline'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Cartões
          </button>

          <button
            onClick={() => setActiveTab('createMatch')}
            className={`rounded-2xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition ${
              activeTab === 'createMatch'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Criar jogo
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`rounded-2xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition ${
              activeTab === 'teams'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Times
          </button>
        </div>

        {activeTab === 'results' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
                  <Edit2 className="h-5 w-5 text-blue-400" />
                  Resultados rápidos
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Filtre a rodada/grupo e preencha o placar direto no cartão do jogo.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Grupo
                    </label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {groupOptions.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group === 'Todos' ? 'Todos os grupos' : `Grupo ${group}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </label>
                    <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="scheduled">Agendados</SelectItem>
                        <SelectItem value="in_progress">Em andamento</SelectItem>
                        <SelectItem value="completed">Finalizados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedGroup('Todos');
                        setSelectedStatus('all');
                      }}
                      className="w-full rounded-2xl border-slate-700 bg-slate-950 font-black text-slate-300 hover:bg-slate-800"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Limpar filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {matchesLoading ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
                Carregando jogos...
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
                Nenhum jogo encontrado para os filtros selecionados.
              </div>
            ) : (
              Object.entries(matchesByGroup).map(([groupName, groupMatches]) => (
                <div key={groupName} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-800" />
                    <h2 className="rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-blue-200">
                      {groupName}
                    </h2>
                    <div className="h-px flex-1 bg-slate-800" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {groupMatches.map((match: any) => (
                      <QuickScoreCard
                        key={match.id}
                        match={match}
                        teams={teams}
                        scoreDraft={getDraft(match)}
                        onDraftChange={(value) => setDraft(match.id, value)}
                        onSave={() => saveResult(match)}
                        onSetInProgress={() => setInProgress(match)}
                        onClear={() => clearResult(match)}
                        isSaving={updateMatchMutation.isPending}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'discipline' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Cartões por grupo
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Atualize amarelos e vermelhos usados no desempate CONMEBOL da fase de grupos.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Grupo
                    </label>
                    <Select value={disciplineGroup} onValueChange={setDisciplineGroup}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {groupOptions.filter((group) => group !== 'Todos').map((group) => (
                          <SelectItem key={group} value={group}>
                            Grupo {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-200/70">
                      Temporada
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      Libertadores {season}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {(teams || []).map((team: any) => {
                const draft = getDisciplineDraft(team.id);

                return (
                  <div
                    key={team.id}
                    className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-950 p-4 shadow-xl"
                  >
                    <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:22px_22px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(234,179,8,0.15),_transparent_42%)]" />

                    <div className="relative z-10 grid grid-cols-[1fr_220px] items-center gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black uppercase text-white">
                          {team.name}
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Grupo {disciplineGroup}
                        </p>
                      </div>

                      <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                        <div>
                          <label className="mb-1 block text-center text-[9px] font-black uppercase tracking-widest text-yellow-300">
                            🟨 Amarelos
                          </label>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={draft.yellowCards}
                            onChange={(event) =>
                              setDisciplineDraft(team.id, {
                                ...draft,
                                yellowCards: event.target.value,
                              })
                            }
                            className="h-12 rounded-2xl border-slate-700 bg-slate-900 text-center text-xl font-black text-white"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-center text-[9px] font-black uppercase tracking-widest text-red-300">
                            🟥 Vermelhos
                          </label>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={draft.redCards}
                            onChange={(event) =>
                              setDisciplineDraft(team.id, {
                                ...draft,
                                redCards: event.target.value,
                              })
                            }
                            className="h-12 rounded-2xl border-slate-700 bg-slate-900 text-center text-xl font-black text-white"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={() => saveDiscipline(team.id)}
                          disabled={upsertDisciplineMutation.isPending}
                          className="h-12 rounded-2xl bg-blue-600 px-4 font-black text-white hover:bg-blue-500"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(!teams || teams.length === 0) && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
                Nenhum time cadastrado para editar cartões.
              </div>
            )}
          </div>
        )}

        {activeTab === 'createMatch' && (
          <Card className="border-slate-800 bg-slate-900/80 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
                <Plus className="h-5 w-5 text-blue-400" />
                Adicionar novo jogo
              </CardTitle>
              <CardDescription className="text-slate-400">
                Crie um jogo para a temporada selecionada.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Time da casa
                  </label>
                  <Select
                    value={newMatch.homeTeamId}
                    onValueChange={(value) => setNewMatch({ ...newMatch, homeTeamId: value })}
                  >
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teams?.map((team: any) => (
                        <SelectItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Time visitante
                  </label>
                  <Select
                    value={newMatch.awayTeamId}
                    onValueChange={(value) => setNewMatch({ ...newMatch, awayTeamId: value })}
                  >
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teams?.map((team: any) => (
                        <SelectItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Fase
                  </label>
                  <Select
                    value={newMatch.phase}
                    onValueChange={(value) => setNewMatch({ ...newMatch, phase: value })}
                  >
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phaseOptions.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Grupo
                  </label>
                  <Input
                    value={newMatch.group}
                    onChange={(event) => setNewMatch({ ...newMatch, group: event.target.value.toUpperCase() })}
                    placeholder="A, B, C..."
                    className="rounded-2xl border-slate-700 bg-slate-950 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Data do jogo
                  </label>
                  <Input
                    type="date"
                    value={newMatch.matchDate}
                    onChange={(event) => setNewMatch({ ...newMatch, matchDate: event.target.value })}
                    className="rounded-2xl border-slate-700 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  if (!newMatch.homeTeamId || !newMatch.awayTeamId) {
                    alert('Selecione os dois times.');
                    return;
                  }

                  if (newMatch.homeTeamId === newMatch.awayTeamId) {
                    alert('O time da casa e o visitante não podem ser iguais.');
                    return;
                  }

                  createMatchMutation.mutate({
                    homeTeamId: Number(newMatch.homeTeamId),
                    awayTeamId: Number(newMatch.awayTeamId),
                    phase: newMatch.phase,
                    group: newMatch.group || undefined,
                    matchDate: new Date(newMatch.matchDate),
                    season: Number(season),
                  });
                }}
                disabled={createMatchMutation.isPending}
                className="w-full rounded-2xl bg-blue-600 py-6 font-black text-white hover:bg-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar jogo em {season}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
                  <Users className="h-5 w-5 text-blue-400" />
                  Adicionar novo time
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Crie um time na base de dados.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Nome do time
                    </label>
                    <Input
                      value={newTeam.name}
                      onChange={(event) => setNewTeam({ ...newTeam, name: event.target.value })}
                      placeholder="Ex: Palmeiras"
                      className="rounded-2xl border-slate-700 bg-slate-950 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      País
                    </label>
                    <Input
                      value={newTeam.country}
                      onChange={(event) => setNewTeam({ ...newTeam, country: event.target.value })}
                      placeholder="Ex: Brasil"
                      className="rounded-2xl border-slate-700 bg-slate-950 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!newTeam.name || !newTeam.country) {
                      alert('Preencha todos os campos.');
                      return;
                    }

                    createTeamMutation.mutate(newTeam);
                    setNewTeam({ name: '', country: '' });
                  }}
                  disabled={createTeamMutation.isPending}
                  className="w-full rounded-2xl bg-blue-600 py-6 font-black text-white hover:bg-blue-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar time
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader>
                <CardTitle>Times cadastrados</CardTitle>
                <CardDescription className="text-slate-400">
                  Total de {teams?.length || 0} times
                </CardDescription>
              </CardHeader>

              <CardContent>
                {teamsLoading ? (
                  <p className="text-slate-400">Carregando...</p>
                ) : !teams || teams.length === 0 ? (
                  <p className="text-slate-400">Nenhum time cadastrado.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teams.map((team: any) => (
                      <div key={team.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p className="font-black text-white">{team.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{team.country || 'País não informado'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
