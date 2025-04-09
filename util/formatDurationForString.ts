//dùng cho string dạng 1.5h -> 1 giờ 30 phút
const formatDurationForString = (durationDisplay: string) => {
  const hours = parseInt(durationDisplay.split(".")[0]) || 0;
  const minutes = parseFloat(`0.${durationDisplay.split(".")[1]}`) * 60; // Lấy phần thập phân, nhân với 60

  let result = "";
  if (hours > 0) {
    result += `${hours} giờ `;
  }

  // Làm tròn số phút và thêm vào kết quả
  const roundedMinutes = Math.ceil(minutes);
  if (roundedMinutes > 0 || result === "") {
    result += `${roundedMinutes} phút`;
  }

  return result;
};

export default formatDurationForString;
