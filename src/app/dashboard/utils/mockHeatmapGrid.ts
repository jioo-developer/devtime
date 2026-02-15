export type MockHeatmapCell = {
  date: string;
  studyTimeHours: number;
  colorLevel: number; // 0~5
};

const TOTAL_WEEKS = 53;
const DAYS_PER_WEEK = 7;
const TOTAL_CELLS = TOTAL_WEEKS * DAYS_PER_WEEK;

function getGridDates(targetYear: number): string[] {
  const januaryFirst = new Date(targetYear, 0, 1);
  const dayOfWeek = januaryFirst.getDay();
  const gridStartSunday = new Date(januaryFirst);
  gridStartSunday.setDate(januaryFirst.getDate() - dayOfWeek);

  const gridDates: string[] = [];
  for (let cellIndex = 0; cellIndex < TOTAL_CELLS; cellIndex++) {
    const weekColumnIndex = cellIndex % TOTAL_WEEKS;
    const dayRowIndex = Math.floor(cellIndex / TOTAL_WEEKS);
    const cellDate = new Date(gridStartSunday);
    cellDate.setDate(
      gridStartSunday.getDate() + weekColumnIndex * DAYS_PER_WEEK + dayRowIndex,
    );
    const year = cellDate.getFullYear();
    const month = String(cellDate.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(cellDate.getDate()).padStart(2, "0");
    gridDates.push(`${year}-${month}-${dayOfMonth}`);
  }
  return gridDates;
}

/** 목업: 1~12월 전부 채움, 금·토·일 포함 모든 요일 색 있음. 7·8·10월 약간 진함, 툴팁용 시간은 level에 맞춰 0~8시간대 */
export function getMockGrid(targetYear: number): MockHeatmapCell[] {
  const gridDates = getGridDates(targetYear);
  const TOTAL_WEEKS = 53;

  return gridDates.map((dateStr, cellIndex) => {
    const weekCol = cellIndex % TOTAL_WEEKS;
    const dayRow = Math.floor(cellIndex / TOTAL_WEEKS);
    const month = parseInt(dateStr.slice(5, 7), 10);
    const seed = (cellIndex * 31 + targetYear) % 100;

    let level = (seed % 4) + 1;
    if (month === 7 || month === 8 || month === 10)
      level = Math.min(5, level + 1);
    if (month === 6) level = Math.max(0, level - 1);
    if (month === 1 && weekCol < 2) level = Math.max(0, level - 1);
    if (dayRow === 1 || dayRow === 2 || dayRow === 4)
      level = Math.min(5, level + 1);
    if (seed < 6) level = 0;

    const colorLevel = Math.min(5, Math.max(0, level));
    const studyTimeHours =
      colorLevel === 0
        ? 0
        : colorLevel * 1.2 + (seed % 18) * 0.15 + (seed % 5) * 0.05;

    return { date: dateStr, studyTimeHours, colorLevel };
  });
}
