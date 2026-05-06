import { useState } from "react";
import { trpc } from "@/lib/trpc";

const grupos = ["A","B","C","D","E","F","G","H"];

export default function AdminDiscipline() {
  const [group, setGroup] = useState("A");

  const { data: teams } = trpc.libertadores.teams.list.useQuery();
  const { data: discipline, refetch } = trpc.libertadores.discipline.list.useQuery({ season: 2026 });

  const mutation = trpc.libertadores.discipline.upsert.useMutation({
    onSuccess: () => {
      refetch();
      alert("Salvo!");
    }
  });

  const getTeamData = (teamId: number) => {
    return discipline?.find(d => d.teamId === teamId && d.group === group);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>⚙️ Admin - Cartões</h1>

      <select value={group} onChange={e => setGroup(e.target.value)}>
        {grupos.map(g => <option key={g}>{g}</option>)}
      </select>

      <table border={1} cellPadding={10} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Time</th>
            <th>🟨 Amarelos</th>
            <th>🟥 Vermelhos</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {teams?.map((t) => {
            const data = getTeamData(t.id);

            let yellow = data?.yellowCards ?? 0;
            let red = data?.redCards ?? 0;

            return (
              <tr key={t.id}>
                <td>{t.name}</td>

                <td>
                  <input
                    type="number"
                    defaultValue={yellow}
                    onChange={(e) => (yellow = Number(e.target.value))}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    defaultValue={red}
                    onChange={(e) => (red = Number(e.target.value))}
                  />
                </td>

                <td>
                  <button
                    onClick={() =>
                      mutation.mutate({
                        season: 2026,
                        group,
                        teamId: t.id,
                        yellowCards: yellow,
                        redCards: red,
                      })
                    }
                  >
                    Salvar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}