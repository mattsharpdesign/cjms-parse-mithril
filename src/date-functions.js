import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export function forHtmlInput(date) {
  if (!(date instanceof Date)) {
    return ''
  }

  return format(date, 'yyyy-MM-dd')
}

export function fromHtmlInput(string) {
  const date = parseISO(string)
  return date
}