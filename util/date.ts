export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  // 1-59 minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  }

  // 1-23 hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ`;
  }

  // 1-6 days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày`;
  }

  // 1-4 weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInDays < 30) {
    return `${diffInWeeks} tuần`;
  }

  // 1-11 months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInDays < 365) {
    return `${diffInMonths} tháng`;
  }

  // 1+ years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm`;
}
