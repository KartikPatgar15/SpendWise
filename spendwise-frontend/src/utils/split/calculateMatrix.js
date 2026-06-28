// src/utils/split/calculateMatrix.js
// Derives a who-owes-whom matrix from settlement transactions.
// Input: settlements array, participants array
// Output: matrix[fromId][toId] = amount

export function calculateMatrix(settlements, participants) {
  // Initialize empty matrix
  const matrix = {};
  participants.forEach((p) => {
    matrix[p.id] = {};
    participants.forEach((q) => {
      matrix[p.id][q.id] = 0;
    });
  });

  // Fill from settlements
  settlements.forEach(({ from, to, amount }) => {
    matrix[from][to] = amount;
  });

  return matrix;
}
