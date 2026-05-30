import { LuCoffee, LuShoppingCart, LuUsers, LuTrendingUp } from "react-icons/lu";
import { PageHeader, StatsSection } from "../components/6-section";
import { Table, List, StatCard, Tooltip } from "../components/3-data-display";
import { StatusBadge } from "../components/12-status";
import { BarChart, DonutChart, TrendLine, ProgressBar, MiniChart } from "../components/9-chart";
import { Heading, Caption } from "../components/14-typography";
import { Container, Stack } from "../components/2-layout";
import { SlideUp } from "../components/15-animation";

const stats = [
  {
    label: "Total Revenue",
    value: "$12,450",
    change: "+12.5%",
    trend: "up",
    icon: LuTrendingUp,
    color: "from-amber-500 to-amber-700",
    bgLight: "bg-amber-50",
    sparkline: [35, 42, 38, 55, 62, 58, 72],
  },
  {
    label: "Total Orders",
    value: "1,245",
    change: "+8.2%",
    trend: "up",
    icon: LuShoppingCart,
    color: "from-emerald-500 to-emerald-700",
    bgLight: "bg-emerald-50",
    sparkline: [20, 28, 32, 30, 45, 50, 48],
  },
  {
    label: "Customers",
    value: "856",
    change: "+5.1%",
    trend: "up",
    icon: LuUsers,
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    sparkline: [10, 15, 18, 20, 22, 25, 28],
  },
  {
    label: "Menu Items",
    value: "48",
    change: "-2.3%",
    trend: "down",
    icon: LuCoffee,
    color: "from-purple-500 to-purple-700",
    bgLight: "bg-purple-50",
    sparkline: [50, 48, 52, 49, 47, 48, 46],
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Budi Santoso", item: "Americano x2", total: 7.50, status: "Completed" },
  { id: "ORD-002", customer: "Siti Rahayu", item: "Vanilla Latte", total: 4.75, status: "Processing" },
  { id: "ORD-003", customer: "Ahmad Hidayat", item: "Caramel Macchiato x3", total: 15.75, status: "Completed" },
  { id: "ORD-004", customer: "Dewi Lestari", item: "Iced Cappuccino x2", total: 9.00, status: "Pending" },
  { id: "ORD-005", customer: "Rizky Pratama", item: "Flat White", total: 4.25, status: "Completed" },
];

const topProducts = [
  { name: "Caramel Macchiato", sold: 245, revenue: "$1,286" },
  { name: "Vanilla Latte", sold: 198, revenue: "$940" },
  { name: "Americano", sold: 187, revenue: "$701" },
  { name: "Mocha Delight", sold: 156, revenue: "$780" },
  { name: "Iced Cappuccino", sold: 134, revenue: "$603" },
];

const weeklyData = [
  { label: "Mon", value: 45 },
  { label: "Tue", value: 65 },
  { label: "Wed", value: 50 },
  { label: "Thu", value: 85 },
  { label: "Fri", value: 70 },
  { label: "Sat", value: 95 },
  { label: "Sun", value: 60 },
];

const donutData = [
  { label: "Espresso-Based", value: 55, color: "#8B5F3C" },
  { label: "Non-Coffee", value: 30, color: "#BF834F" },
  { label: "Pastries & Food", value: 15, color: "#E7D4B0" },
];

const salesTrend = [35, 45, 38, 62, 55, 78, 92];
const trendLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Dashboard() {
  return (
    <Container maxWidth="full" padding={false}>
      <Stack direction="vertical" spacing="lg">
        {/* Page Title */}
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Here's your coffee shop overview."
        />

        {/* Stats Cards with StatCard + MiniChart */}
        <SlideUp duration={0.5}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                label={stat.label}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
                gradientColor={stat.color}
              >
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <MiniChart
                    data={stat.sparkline}
                    trend={stat.trend}
                    width={120}
                    height={32}
                  />
                </div>
              </StatCard>
            ))}
          </div>
        </SlideUp>

        {/* Progress Bar */}
        <SlideUp duration={0.5} delay={0.1}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <Heading level={3} className="!text-base mb-4">Monthly Sales Target</Heading>
            <ProgressBar
              label="Revenue Target"
              value={78}
              target="$16,000"
              color="bg-gradient-to-r from-amber-500 to-amber-600"
            />
          </div>
        </SlideUp>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <TrendLine
              title="Weekly Sales Trend ($)"
              data={salesTrend}
              labels={trendLabels}
              height={200}
            />
          </div>
          <div>
            <DonutChart
              title="Category Share"
              data={donutData}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Recent Orders */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-between">
            <div className="flex-1">
              <Heading level={3} className="!text-lg mb-4">Recent Orders</Heading>
              <Table
                columns={[
                  { label: "Order ID" },
                  { label: "Customer" },
                  { label: "Item" },
                  { label: "Total" },
                  { label: "Status" }
                ]}
                data={recentOrders}
                renderRow={(order) => (
                  <tr key={order.id} className="hover:bg-amber-50/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-700">
                      <Tooltip content={`View details for ${order.id}`}>
                        <span className="cursor-pointer hover:text-[#8B5F3C] transition-colors">{order.id}</span>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.item}</td>
                    <td className="px-6 py-4 font-bold text-[#2C1A0E]">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                )}
              />
            </div>
          </div>

          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <Heading level={3} className="!text-lg mb-4">Top Products</Heading>
            <List
              items={topProducts}
              numbered
              renderItem={(product) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">{product.name}</p>
                    <Caption>{product.sold} sold</Caption>
                  </div>
                  <span className="text-sm font-bold text-[#8B5F3C]">{product.revenue}</span>
                </div>
              )}
            />
          </div>
        </div>
      </Stack>
    </Container>
  );
}
