const generateYearRange = () => {
  const endDate = new Date().getFullYear() + 1;
  const startDate = new Date().getFullYear() - 60;
  const yearsRange = new Array(endDate - startDate)
    .fill()
    .map((d, i) => i + startDate);
  return yearsRange.reverse().map((year) => ({
    label: year,
    value: year,
  }));
};

export default generateYearRange;