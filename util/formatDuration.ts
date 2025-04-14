const formatDuration = (durationDisplay: string) => {
  const hours = parseInt(durationDisplay.split("h")[0]) || 0;
  const minutes =
    parseInt(durationDisplay.split("h")[1]?.replace("p", "")) || 0;

  let result = "";
  if (hours > 0) {
    result += `${hours} giờ `;
  }
  if (minutes > 0 || result === "") {
    result += `${minutes} phút`;
  }
  return result;
};

export default formatDuration;

