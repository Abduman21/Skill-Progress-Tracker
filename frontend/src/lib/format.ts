export function duration(minutes: number) { const total = Math.round(minutes); return total >= 60 ? Math.floor(total / 60) + 'h' + (total % 60 ? ' ' + total % 60 + 'm' : '') : total + 'm'; }
export function dateLabel(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
