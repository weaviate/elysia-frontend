"use client";

import React from "react";
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ResultPayload } from "@/app/types/chat";
import { ScatterOrLinePayload } from "@/app/types/displays";
import { Separator } from "@/components/ui/separator";
import { getColor } from "./util";

interface ScatterOrLineDisplayProps {
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
            {`${entry.dataKey}: ${typeof entry.value === "number" ? Number(entry.value.toFixed(2)) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ScatterOrLineDisplay: React.FC<ScatterOrLineDisplayProps> = ({
  result,
}) => {
  // Transform the chart data for Recharts
  const transformChartData = (chartItem: ScatterOrLinePayload) => {
    const { data, x_axis_label, y_axis_label } = chartItem;
    const { x_axis, y_axis, normalize_y_axis } = data;

    // Create data points for the chart
    const transformedData = [];
    const maxDataPoints = Math.max(
      x_axis.length,
      ...y_axis.map((series) => series.data_points.length)
    );

    for (let i = 0; i < maxDataPoints; i++) {
      const dataPoint: any = {
        [x_axis_label]: x_axis[i]?.value || null,
      };

      // Add all y-axis series data
      y_axis.forEach((series) => {
        dataPoint[series.label] = series.data_points[i]?.value || null;
      });

      transformedData.push(dataPoint);
    }

    // Determine if we should use LineChart or ScatterChart
    const hasLineData = y_axis.some((series) => series.kind === "line");
    const hasScatterData = y_axis.some((series) => series.kind === "scatter");
    const chartType = hasLineData ? "line" : "scatter"; // Prefer line chart if mixed

    return {
      data: transformedData,
      xAxisKey: x_axis_label,
      yAxisSeries: y_axis,
      chartType,
      normalizeYAxis: normalize_y_axis,
    };
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      {(result.objects as ScatterOrLinePayload[]).map(
        (chartItem, chartIndex) => {
          const {
            data: transformedData,
            xAxisKey,
            yAxisSeries,
            chartType,
            normalizeYAxis,
          } = transformChartData(chartItem);

          return (
            <div
              key={chartItem._REF_ID || chartIndex}
              className="w-full flex flex-col gap-4 bg-background rounded-lg p-4"
            >
              <div className="w-full flex flex-col gap-1">
                <p className="text-lg text-primary">
                  {chartItem.title ||
                    result.metadata?.title ||
                    `${chartType === "line" ? "Line" : "Scatter"} Chart`}
                </p>
                <p className="text-sm text-secondary">
                  {chartItem.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-highlight rounded-full"></div>
                    Data Points: {transformedData.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-highlight rounded-full"></div>
                    Series: {yAxisSeries.length}
                  </span>
                  {normalizeYAxis && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Normalized Y-Axis
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Chart Container */}
              <div className="w-full h-[30vh]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
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
                      {yAxisSeries.map((series, index) =>
                        series.kind === "line" ? (
                          <Line
                            key={series.label}
                            type="monotone"
                            dataKey={series.label}
                            stroke={getColor(index)}
                            strokeWidth={3}
                            dot={false}
                            activeDot={{
                              r: 6,
                              stroke: getColor(index),
                              strokeWidth: 2,
                              fill: "#FFFFFF",
                            }}
                            connectNulls={false}
                          />
                        ) : (
                          <Scatter
                            key={series.label}
                            dataKey={series.label}
                            fill={getColor(index)}
                          />
                        )
                      )}
                    </LineChart>
                  ) : (
                    <ScatterChart
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
                      {yAxisSeries.map((series, index) => (
                        <Scatter
                          key={series.label}
                          dataKey={series.label}
                          fill={getColor(index)}
                        />
                      ))}
                    </ScatterChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ScatterOrLineDisplay;
