"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ResultPayload } from "@/app/types/chat";
import { ChartPayload } from "@/app/types/displays";
import { Separator } from "@/components/ui/separator";

interface ChartDisplayProps {
  result: ResultPayload;
}

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background_alt border  border-foreground_alt rounded-lg  p-3">
        <p className="text-sm text-primary">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Generate a set of beautiful colors for the lines
const getLineColor = (index: number) => {
  const colors = [
    "#f2f2f2", // White
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange
    "#6366F1", // Indigo
  ];
  return colors[index % colors.length];
};

const ChartDisplay: React.FC<ChartDisplayProps> = ({ result }) => {
  // Transform the chart data for Recharts
  const transformChartData = (chartItem: ChartPayload) => {
    const { values } = chartItem;

    // Find the x-axis series (usually keyed as 'x' or containing 'time', 'date', etc.)
    const xAxisKey =
      Object.keys(values).find((key) => key.toLowerCase() === "x") ||
      Object.keys(values)[0]; // fallback to first key

    const xAxisData = values[xAxisKey];

    // Get all other series as y-axis data (excluding the x-axis series)
    const yAxisSeries = Object.entries(values).filter(
      ([key]) => key !== xAxisKey,
    );

    // Create data points for the chart
    const transformedData = [];
    const dataLength = xAxisData.data.length;

    for (let i = 0; i < dataLength; i++) {
      const dataPoint: any = {
        [xAxisData.label]: xAxisData.data[i], // Use x-axis label as the key
      };

      // Add all y-axis series data
      yAxisSeries.forEach(([key, chartValue]) => {
        dataPoint[chartValue.label] = chartValue.data[i] || null;
      });

      transformedData.push(dataPoint);
    }

    return {
      data: transformedData,
      xAxisKey: xAxisData.label,
      yAxisKeys: yAxisSeries.map(([_, chartValue]) => chartValue.label),
    };
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      {(result.objects as ChartPayload[])
        .filter((chartItem) => chartItem.type === "line") // Only render line charts
        .map((chartItem, chartIndex) => {
          const {
            data: transformedData,
            xAxisKey,
            yAxisKeys,
          } = transformChartData(chartItem);

          return (
            <div
              key={chartItem._REF_ID || chartIndex}
              className="w-full flex flex-col gap-4 bg-background rounded-lg p-4"
            >
              <div className="w-full flex flex-col gap-1">
                <p className="text-lg text-primary">
                  {result.metadata?.title || "Chart"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-highlight rounded-full"></div>
                    Data Points: {transformedData.length}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Chart Container */}
              <div className="w-full h-[30vh]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transformedData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid
                      horizontal={true}
                      vertical={false}
                      stroke="#E5E7EB"
                      strokeOpacity={0.3}
                    />
                    <XAxis
                      dataKey={xAxisKey}
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: "#6B7280" }}
                      axisLine={{ stroke: "#D1D5DB" }}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: "#6B7280" }}
                      axisLine={{ stroke: "#D1D5DB" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "10px",
                        fontSize: "14px",
                      }}
                    />
                    {yAxisKeys.map((lineKey, index) => (
                      <Line
                        key={lineKey}
                        type="monotone"
                        dataKey={lineKey}
                        stroke={getLineColor(index)}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 6,
                          stroke: getLineColor(index),
                          strokeWidth: 2,
                          fill: "#FFFFFF",
                        }}
                        connectNulls={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ChartDisplay;
