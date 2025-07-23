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
import { HistogramPayload } from "@/app/types/displays";
import { Separator } from "@/components/ui/separator";
import { getColor } from "./util";

interface HistogramDisplayProps {
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

const HistogramDisplay: React.FC<HistogramDisplayProps> = ({ result }) => {
  // Transform the chart data for Recharts
  const transformChartData = (chartItem: HistogramPayload) => {
    const { data } = chartItem;

    // Get all keys from the data object
    const dataKeys = Object.keys(data);
    if (dataKeys.length === 0) {
      return { data: [], series: [] };
    }

    // Extract distribution arrays from all series
    const series = dataKeys.map((key) => ({
      key,
      distribution: data[key].distribution,
    }));

    // Find the range of all values across all distributions
    const allValues: number[] = [];
    series.forEach((serie) => {
      serie.distribution.forEach((value) => {
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        if (!isNaN(numValue)) {
          allValues.push(numValue);
        }
      });
    });

    if (allValues.length === 0) {
      return { data: [], series: [] };
    }

    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Create bins (default to 10 bins)
    const numBins = 10;
    const binWidth = (maxValue - minValue) / numBins;
    const bins: { min: number; max: number; label: string }[] = [];

    for (let i = 0; i < numBins; i++) {
      const binMin = minValue + i * binWidth;
      const binMax =
        i === numBins - 1 ? maxValue : minValue + (i + 1) * binWidth;
      bins.push({
        min: binMin,
        max: binMax,
        label: `${binMin.toFixed(1)}-${binMax.toFixed(1)}`,
      });
    }

    // Count values in each bin for each series
    const transformedData = bins.map((bin) => {
      const dataPoint: any = {
        category: bin.label,
      };

      series.forEach((serie) => {
        let count = 0;
        serie.distribution.forEach((value) => {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          if (!isNaN(numValue) && numValue >= bin.min && numValue <= bin.max) {
            count++;
          }
        });
        dataPoint[serie.key] = count;
      });

      return dataPoint;
    });

    return {
      data: transformedData,
      series: series.map((s) => s.key),
      xAxisKey: "category",
    };
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      {(result.objects as HistogramPayload[]).map((chartItem, chartIndex) => {
        const {
          data: transformedData,
          series,
          xAxisKey,
        } = transformChartData(chartItem);

        return (
          <div
            key={chartItem._REF_ID || chartIndex}
            className="w-full flex flex-col gap-4 bg-background rounded-lg p-4"
          >
            <div className="w-full flex flex-col gap-1">
              <p className="text-lg text-primary">
                {chartItem.title || result.metadata?.title || "Histogram"}
              </p>
              <p className="text-sm text-secondary">{chartItem.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-highlight rounded-full"></div>
                  Data Points: {transformedData.length}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-highlight rounded-full"></div>
                  Series: {series.length}
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
                  {series.map((seriesKey, index) => (
                    <Bar
                      key={seriesKey}
                      dataKey={seriesKey}
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

export default HistogramDisplay;
