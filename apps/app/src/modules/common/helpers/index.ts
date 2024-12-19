export function formatStatisticsPercent(percent: number) {
  return percent === null ? '' : `${percent > 0 ? `+` : ``}${percent}%`;
}
