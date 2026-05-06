DELETE FROM teamPoints WHERE season = 2026;
DELETE FROM matches WHERE season = 2026;

INSERT INTO matches (homeTeamId, awayTeamId, homeScore, awayScore, season, `group`, status, processed, phase) VALUES
-- Grupo A
(1, 2, 1, 1, 2026, 'A', 'completed', 1, 'Fase de Grupos'),
(3, 4, 0, 2, 2026, 'A', 'completed', 1, 'Fase de Grupos'),
(4, 1, 4, 1, 2026, 'A', 'completed', 1, 'Fase de Grupos'),
(2, 3, 2, 1, 2026, 'A', 'completed', 1, 'Fase de Grupos'),
(2, 4, 1, 1, 2026, 'A', 'completed', 1, 'Fase de Grupos'),
(1, 3, 1, 0, 2026, 'A', 'completed', 1, 'Fase de Grupos'),
-- Grupo B
(8, 7, 1, 2, 2026, 'B', 'completed', 1, 'Fase de Grupos'),
(6, 5, 1, 1, 2026, 'B', 'completed', 1, 'Fase de Grupos'),
(5, 8, 3, 2, 2026, 'B', 'completed', 1, 'Fase de Grupos'),
(7, 6, 1, 1, 2026, 'B', 'completed', 1, 'Fase de Grupos'),
(5, 7, 3, 0, 2026, 'B', 'completed', 1, 'Fase de Grupos'),
(6, 8, 4, 2, 2026, 'B', 'completed', 1, 'Fase de Grupos'),
-- Grupo C
(9, 10, 0, 0, 2026, 'C', 'completed', 1, 'Fase de Grupos'),
(11, 12, 1, 0, 2026, 'C', 'completed', 1, 'Fase de Grupos'),
(12, 9, 1, 1, 2026, 'C', 'completed', 1, 'Fase de Grupos'),
(10, 11, 1, 2, 2026, 'C', 'completed', 1, 'Fase de Grupos'),
(11, 9, 4, 1, 2026, 'C', 'completed', 1, 'Fase de Grupos'),
(12, 10, 2, 0, 2026, 'C', 'completed', 1, 'Fase de Grupos'),
-- Grupo D
(13, 14, 0, 1, 2026, 'D', 'completed', 1, 'Fase de Grupos'),
(16, 15, 2, 1, 2026, 'D', 'completed', 1, 'Fase de Grupos'),
(14, 15, 1, 2, 2026, 'D', 'completed', 1, 'Fase de Grupos'),
(16, 13, 3, 0, 2026, 'D', 'completed', 1, 'Fase de Grupos'),
(14, 16, 1, 0, 2026, 'D', 'completed', 1, 'Fase de Grupos'),
(13, 15, 1, 2, 2026, 'D', 'completed', 1, 'Fase de Grupos'),
-- Grupo E
(19, 20, 1, 1, 2026, 'E', 'completed', 1, 'Fase de Grupos'),
(17, 18, 0, 2, 2026, 'E', 'completed', 1, 'Fase de Grupos'),
(18, 19, 2, 0, 2026, 'E', 'completed', 1, 'Fase de Grupos'),
(20, 17, 1, 2, 2026, 'E', 'completed', 1, 'Fase de Grupos'),
(17, 19, 2, 1, 2026, 'E', 'completed', 1, 'Fase de Grupos'),
(18, 20, 2, 0, 2026, 'E', 'completed', 1, 'Fase de Grupos'),
-- Grupo F
(21, 22, 1, 1, 2026, 'F', 'completed', 1, 'Fase de Grupos'),
(23, 24, 1, 0, 2026, 'F', 'completed', 1, 'Fase de Grupos'),
(22, 23, 2, 1, 2026, 'F', 'completed', 1, 'Fase de Grupos'),
(24, 21, 1, 0, 2026, 'F', 'completed', 1, 'Fase de Grupos'),
(24, 22, 1, 1, 2026, 'F', 'completed', 1, 'Fase de Grupos'),
(23, 21, 2, 0, 2026, 'F', 'completed', 1, 'Fase de Grupos'),
-- Grupo G
(25, 26, 0, 1, 2026, 'G', 'completed', 1, 'Fase de Grupos'),
(27, 28, 1, 0, 2026, 'G', 'completed', 1, 'Fase de Grupos'),
(26, 27, 2, 0, 2026, 'G', 'completed', 1, 'Fase de Grupos'),
(28, 25, 1, 0, 2026, 'G', 'completed', 1, 'Fase de Grupos'),
(27, 25, 2, 0, 2026, 'G', 'completed', 1, 'Fase de Grupos'),
(28, 26, 1, 0, 2026, 'G', 'completed', 1, 'Fase de Grupos'),
-- Grupo H
(29, 32, 1, 0, 2026, 'H', 'completed', 1, 'Fase de Grupos'),
(30, 31, 2, 1, 2026, 'H', 'completed', 1, 'Fase de Grupos'),
(31, 32, 3, 1, 2026, 'H', 'completed', 1, 'Fase de Grupos'),
(30, 29, 1, 0, 2026, 'H', 'completed', 1, 'Fase de Grupos'),
(32, 30, 2, 3, 2026, 'H', 'completed', 1, 'Fase de Grupos'),
(31, 29, 0, 3, 2026, 'H', 'completed', 1, 'Fase de Grupos');

SELECT COUNT(*) AS total FROM matches WHERE season = 2026;
SELECT `group`, COUNT(*) AS jogos FROM matches WHERE season = 2026 GROUP BY `group`;
