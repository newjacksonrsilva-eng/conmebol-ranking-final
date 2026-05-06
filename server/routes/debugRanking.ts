import { Router } from 'express';

const router = Router();

router.get('/api/debug/ranking', async (req, res) => {
  res.json({
    season: 2029,
    updatedAt: new Date().toISOString(),
    data: [
      {
        rank: 1,
        teamId: 4,
        name: "Flamengo",
        points: 52,
        status: "Classificado"
      },
      {
        rank: 2,
        teamId: 22,
        name: "Palmeiras",
        points: 49,
        status: "Pontuando na Libertadores 2026"
      },
      {
        rank: 3,
        teamId: 11,
        name: "Independiente Rivadavia",
        points: 31,
        status: "Não pontua em 2026"
      }
    ]
  });
});

export default router;