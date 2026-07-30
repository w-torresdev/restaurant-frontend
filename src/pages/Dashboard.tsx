import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Select from "react-select";
import { Users, Activity, DollarSign, TrendingUp } from "lucide-react";
import { userService } from "@/services/user.service";

const chartData = [
  { name: "Jan", total: 1200 },
  { name: "Fev", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Abr", total: 2800 },
  { name: "Mai", total: 2400 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 4100 },
];

const periodOptions = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "3m", label: "Últimos 3 meses" },
  { value: "1y", label: "Último ano" },
];

export function Dashboard() {
  const [period, setPeriod] = useState(periodOptions[1]);

  const { data, isLoading } = useQuery({
    queryKey: ["summary", period.value],
    queryFn: userService.getSummary,
  });

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: "rgba(148, 163, 184, 0.2)",
      padding: "2px",
      borderRadius: "0.75rem",
      boxShadow: "none",
      "&:hover": { borderColor: "rgba(148, 163, 184, 0.4)" },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "inherit",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "var(--tw-bg-opacity, white)",
      borderRadius: "0.75rem",
      overflow: "hidden",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: 50,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "rgb(59 130 246 / 0.1)" 
        : state.isFocused 
          ? "rgb(241 245 249)" 
          : "transparent",
      color: state.isSelected ? "rgb(37 99 235)" : "inherit",
      cursor: "pointer",
    }),
  };

  const cards = [
    { title: "Usuários Totais", value: data?.totalUsers ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Sessões Ativas", value: data?.activeSessions ?? 0, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Receita (R$)", value: data?.revenue ? `R$ ${(data.revenue / 1000).toFixed(1)}k` : "R$ 0", icon: DollarSign, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Acompanhe as métricas principais do sistema</p>
        </div>
        
        <div className="w-48">
          <Select
            value={period}
            onChange={(val: any) => setPeriod(val)}
            options={periodOptions}
            styles={customSelectStyles}
            className="text-sm text-slate-900 dark:text-white dark:bg-slate-900 rounded-xl"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-2" />
                ) : (
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</h3>
                )}
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12.5% em relação ao período anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crescimento de Acessos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Métricas acumuladas nos últimos meses</p>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
