const ROWS = 15;
const COLS = 15;
const TOTAL = ROWS * COLS;

async function makeMineSet(secret, gameId, mineCount) {
  const mines = new Set();
  let round = 0;
  const encoder = new TextEncoder();

  while (mines.size < mineCount) {
    const data = encoder.encode(`${secret}:${gameId}:${round++}`);
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", data));

    for (let i = 0; i + 3 < digest.length && mines.size < mineCount; i += 4) {
      const value =
        ((digest[i] << 24) | (digest[i + 1] << 16) | (digest[i + 2] << 8) | digest[i + 3]) >>> 0;
      const index = value % TOTAL;
      mines.add(`${Math.floor(index / COLS)},${index % COLS}`);
    }
  }

  return mines;
}

function getNumber(row, col, mines) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && mines.has(`${r},${c}`)) count++;
    }
  }
  return count;
}

function getSafeArea(startRow, startCol, mines) {
  const result = [];
  const visited = new Set();
  const queue = [[startRow, startCol]];

  while (queue.length) {
    const [row, col] = queue.shift();
    const key = `${row},${col}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS || mines.has(key)) continue;

    const number = getNumber(row, col, mines);
    result.push({ row, col, number });

    if (number === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = row + dr;
          const c = col + dc;
          const nextKey = `${r},${c}`;
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS && !visited.has(nextKey) && !mines.has(nextKey)) {
            queue.push([r, c]);
          }
        }
      }
    }
  }

  return result;
}

export async function onRequestPost(context) {
  try {
    const secret = context.env.MINE_SECRET;
    const mineCount = Number(context.env.MINE_COUNT);

    if (!secret || !Number.isInteger(mineCount) || mineCount < 1 || mineCount >= TOTAL) {
      return Response.json({ error: "Game configuration missing" }, { status: 500 });
    }

    const body = await context.request.json();
    const row = Number(body.row);
    const col = Number(body.col);
    const gameId = String(body.gameId || "");
    const alreadyRevealed = Array.isArray(body.revealed) ? body.revealed.map(String) : [];

    if (!gameId || !Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const mines = await makeMineSet(secret, gameId, mineCount);
    const key = `${row},${col}`;

    if (mines.has(key)) {
      return Response.json({ mine: true });
    }

    const cells = getSafeArea(row, col, mines);
    const revealedSet = new Set(alreadyRevealed);
    cells.forEach(cell => revealedSet.add(`${cell.row},${cell.col}`));
    const won = revealedSet.size >= TOTAL - mineCount;

    const response = { mine: false, cells, won };
    if (won) response.mineCount = mineCount;
    return Response.json(response);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
