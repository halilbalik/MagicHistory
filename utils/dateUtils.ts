export function formatTurkishDate(dateString?: string, year?: string): string {
  if (!dateString) return '';
  const [month, day] = dateString.split(' ');
  const monthTranslations: { [key: string]: string } = {
    January: 'Ocak',
    February: 'Şubat',
    March: 'Mart',
    April: 'Nisan',
    May: 'Mayıs',
    June: 'Haziran',
    July: 'Temmuz',
    August: 'Ağustos',
    September: 'Eylül',
    October: 'Ekim',
    November: 'Kasım',
    December: 'Aralık',
  };
  const turkishMonth = monthTranslations[month] || month;
  if (year) {
    return `${day} ${turkishMonth} ${year}`;
  }
  return `${day} ${turkishMonth}`;
}
