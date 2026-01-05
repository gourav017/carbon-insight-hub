import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type EmissionsChartProps = {
  results: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
};

const EmissionsChart = ({ results }: EmissionsChartProps) => {
  const data = [
    { name: "Scope 1", value: results.scope1, color: "hsl(var(--chart-1))" },
    { name: "Scope 2", value: results.scope2, color: "hsl(var(--chart-2))" },
    { name: "Scope 3", value: results.scope3, color: "hsl(var(--chart-3))" },
  ];

  return (
    <Card className="shadow-[var(--shadow-card)] border-border">
      <CardHeader>
        <CardTitle>Emissions Distribution</CardTitle>
        <CardDescription>Visual breakdown by scope</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)} tCO2e`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmissionsChart;
