export const getColor = (index: number) => {
  const colors = [
    "#54ff5a", // Green
    "#54cfff", // Blue
    "#ff5454", // Red
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange
    "#6366F1", // Indigo
    "#f2f2f2", // White
  ];
  return colors[index % colors.length];
};
