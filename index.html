const ROWS = 15;
const COLS = 15;

const minePositions = new Set([
  "0,3",
  "0,11",
  "1,7",
  "2,1",
  "2,14",
  "3,5",
  "3,9",
  "4,2",
  "4,12",
  "5,8",
  "6,0",
  "6,6",
  "6,13",
  "7,4",
  "7,10",
  "8,1",
  "8,11",
  "9,7",
  "9,12",
  "10,3",
  "10,14",
  "11,5",
  "11,9",
  "12,2",
  "12,12",
  "13,6",
  "13,10",
  "14,0",
  "14,8",
  "14,13",
  "5,3"
]);

function isMine(row, col) {
  return minePositions.has(`${row},${col}`);
}

function getNumber(row, col) {
  let count = 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const r = row + dr;
      const c = col + dc;

      if (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        isMine(r, c)
      ) {
        count++;
      }
    }
  }

  return count;
}

function getSafeArea(startRow, startCol) {
  const result = [];
  const visited = new Set();
  const queue = [[startRow, startCol]];

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    const key = `${row},${col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (
      row < 0 ||
      row >= ROWS ||
      col < 0 ||
      col >= COLS ||
      isMine(row, col)
    ) {
      continue;
    }

    const number = getNumber(row, col);

    result.push({
      row,
      col,
      number
    });

    if (number === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const r = row + dr;
          const c = col + dc;

          if (
            r >= 0 &&
            r < ROWS &&
            c >= 0 &&
            c < COLS
          ) {
            const neighborKey = `${r},${c}`;

            if (!visited.has(neighborKey) && !isMine(r, c)) {
              queue.push([r, c]);
            }
          }
        }
      }
    }
  }

  return result;
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const row = Number(body.row);
    const col = Number(body.col);

    if (
      !Number.isInteger(row) ||
      !Number.isInteger(col) ||
      row < 0 ||
      row >= ROWS ||
      col < 0 ||
      col >= COLS
    ) {
      return Response.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    if (isMine(row, col)) {
      return Response.json({
        mine: true
      });
    }

    return Response.json({
      mine: false,
      cells: getSafeArea(row, col)
    });
  } catch (error) {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
