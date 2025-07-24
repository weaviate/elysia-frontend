"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ResultPayload } from "@/app/types/chat";
import { BarPayload } from "@/app/types/displays";
import { Separator } from "@/components/ui/separator";
import { getColor } from "./util";

interface BarDisplayProps {
  result: ResultPayload;
}

// Custom tooltip component for better styling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background_alt border  border-foreground_alt rounded-lg  p-3">
        <p className="text-sm text-primary">{`${label}`}</p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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

const BarDisplay: React.FC<BarDisplayProps> = ({ result }) => {
  // Transform the chart data for Recharts
  const transformChartData = (chartItem: BarPayload) => {
    const { data, x_axis_label } = chartItem;
    const { x_labels, y_values } = data;

    // Create data points for the chart
    const transformedData = [];

    for (let i = 0; i < x_labels.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataPoint: any = {
        [x_axis_label]: x_labels[i],
      };

      // Add all y-axis series data
      Object.entries(y_values).forEach(([seriesKey, seriesData]) => {
        dataPoint[seriesKey] = seriesData[i] || null;
      });

      transformedData.push(dataPoint);
    }

    return {
      data: transformedData,
      xAxisKey: x_axis_label,
      yAxisKeys: Object.keys(y_values),
    };
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      {(result.objects as BarPayload[]).map((chartItem, chartIndex) => {
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
                {chartItem.title || result.metadata?.title || "Bar Chart"}
              </p>
              <p className="text-sm text-secondary">{chartItem.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-highlight rounded-full"></div>
                  Data Points: {transformedData.length}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-highlight rounded-full"></div>
                  Series: {yAxisKeys.length}
                </span>
              </div>
            </div>

            <Separator />

            {/* Chart Container */}
            <div className="w-full h-[30vh]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                  {yAxisKeys.map((barKey, index) => (
                    <Bar
                      key={barKey}
                      dataKey={barKey}
                      fill={getColor(index)}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarDisplay;
