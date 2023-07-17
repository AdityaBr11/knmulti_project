import React, { PureComponent, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class Example extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <>
          <PieChart
            style={{
              display: 'inline-block',
            }}
            width={400}
            height={400}
          >
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <PieChart
            style={{
              display: 'inline-block',
            }}
            width={400}
            height={400}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </>
      </ResponsiveContainer>
    );
  }
}

function PlotsBreakdown({ subPlots }) {
  useEffect(() => {
    if (subPlots?.length > 0) {
      const leadsInfoMap = {};
      const leadsInfoMapArea = {};
      const soldNotSoldMap = {
        Sold: 0,
        'Mot Sold': 0,
      };
      const soldNotSoldMapArea = {
        Sold: 0,
        'Mot Sold': 0,
      };
      for (let i = 0; i < subPlots.length; i++) {
        if (subPlots[i].sold) {
          soldNotSoldMap['Sold'] = (soldNotSoldMap['Sold'] || 0) + 1;
          soldNotSoldMapArea['Sold'] =
            (soldNotSoldMapArea['Sold'] || 0) + subPlots[i].area;
        } else {
          soldNotSoldMap['Not Sold'] = (soldNotSoldMap['Not Sold'] || 0) + 1;
          soldNotSoldMapArea['Not Sold'] =
            (soldNotSoldMapArea['Not Sold'] || 0) + subPlots[i].area;
        }
        if (!subPlots[i].sold)
          subPlots[i].leadsInfo.forEach((lead) => {
            if (leadsInfoMap[lead.leadType]) {
              leadsInfoMap[lead.leadType] += 1;
              leadsInfoMapArea[lead.leadType] += subPlots[i].area;
            } else {
              leadsInfoMap[lead.leadType] = 1;
              leadsInfoMapArea[lead.leadType] = subPlots[i].area;
            }
          });
      }
      console.log(leadsInfoMap, soldNotSoldMap, soldNotSoldMapArea);
    }
  }, [subPlots]);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Example />
    </div>
  );
}

export default PlotsBreakdown;
