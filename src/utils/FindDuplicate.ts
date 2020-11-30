export const findDuplicate = (array: any[]): any[] => {
  const sorted = array.map(walkResult => walkResult.position).slice().sort()

  let results = []

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] == sorted[i]) {
      results.push(sorted[i]);
    }
  }
  return results
}
