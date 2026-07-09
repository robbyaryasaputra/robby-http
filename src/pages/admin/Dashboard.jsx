import { useState, useEffect } from "react";
import { LuCoffee, LuShoppingCart, LuUsers, LuTrendingUp, LuLoader } from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/section";
import { Table, List, StatCard, Tooltip } from "../../components/data-display";
import { StatusBadge } from "../../components/status";
import RatingStars from "../../components/status/RatingStars";
import { TrendLine, DonutChart, ProgressBar, MiniChart } from "../../components/chart";
import { Heading, Caption } from "../../components/typography";
import { Container, Stack } from "../../components/layout";
import { SlideUp } from "../../components/animation";

export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      label: "Total Revenue",
      value: "IDR 0",
      change: "+0%",
      trend: "up",
      icon: LuTrendingUp,
      color: "from-[#8b6f47] to-[#3d2311]",
      bgLight: "bg-amber-50",
      sparkline: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "Total Orders",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: LuShoppingCart,
      color: "from-[#1c1109] to-[#3d2311]",
      bgLight: "bg-amber-50",
      sparkline: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "Users",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: LuUsers,
      color: "from-[#5f3a27] to-[#8b6f47]",
      bgLight: "bg-amber-50",
      sparkline: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "Menu Items",
      value: "0",
      change: "0%",
      trend: "up",
      icon: LuCoffee,
      color: "from-[#2e1e12] to-[#5f3a27]",
      bgLight: "bg-amber-50",
      sparkline: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [salesTrend, setSalesTrend] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [trendLabels] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [donutData, setDonutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetPercent, setTargetPercent] = useState(0);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Users Count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // 2. Fetch Menu Items Count
      const { count: menuCount } = await supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true });

      // 3. Fetch Orders (to compute Total Orders, Total Revenue, Sparklines, Charts)
      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at, customer_name, order_number, profiles(name)")
        .order("created_at", { ascending: false });

      // Calculate daily sales from orders
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dailySales = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      const dailyOrderCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      
      const totalOrders = ordersData?.length || 0;
      const completedOrders = ordersData?.filter(o => o.status === 'completed' || o.status === 'processing') || [];
      const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      ordersData?.forEach(o => {
        const d = new Date(o.created_at);
        const dayName = dayNames[d.getDay()];
        if (o.status === 'completed' || o.status === 'processing') {
          dailySales[dayName] = (dailySales[dayName] || 0) + Number(o.total_amount || 0);
        }
        dailyOrderCounts[dayName] = (dailyOrderCounts[dayName] || 0) + 1;
      });

      const salesTrendValues = [
        dailySales.Mon,
        dailySales.Tue,
        dailySales.Wed,
        dailySales.Thu,
        dailySales.Fri,
        dailySales.Sat,
        dailySales.Sun
      ];

      const orderSparkline = [
        dailyOrderCounts.Mon,
        dailyOrderCounts.Tue,
        dailyOrderCounts.Wed,
        dailyOrderCounts.Thu,
        dailyOrderCounts.Fri,
        dailyOrderCounts.Sat,
        dailyOrderCounts.Sun
      ];

      // Target monthly revenue is 500 USD
      const targetRevenue = 500;
      const calculatedPercent = Math.min(100, Math.round((totalRevenue / targetRevenue) * 100));
      setTargetPercent(calculatedPercent);

      // Update stats cards
      setStats([
        {
          label: "Total Revenue",
          value: `$ ${totalRevenue.toFixed(2)}`,
          change: totalRevenue > 0 ? "+12.5%" : "0%",
          trend: "up",
          icon: LuTrendingUp,
          color: "from-[#8b6f47] to-[#3d2311]",
          bgLight: "bg-amber-50",
          sparkline: salesTrendValues,
        },
        {
          label: "Total Orders",
          value: totalOrders.toString(),
          change: totalOrders > 0 ? "+8.2%" : "0%",
          trend: "up",
          icon: LuShoppingCart,
          color: "from-[#1c1109] to-[#3d2311]",
          bgLight: "bg-amber-50",
          sparkline: orderSparkline,
        },
        {
          label: "Users",
          value: (usersCount || 0).toString(),
          change: usersCount > 0 ? "+5.1%" : "0%",
          trend: "up",
          icon: LuUsers,
          color: "from-[#5f3a27] to-[#8b6f47]",
          bgLight: "bg-amber-50",
          sparkline: [10, 15, 18, 20, 22, 25, 28],
        },
        {
          label: "Menu Items",
          value: (menuCount || 0).toString(),
          change: "0.0%",
          trend: "up",
          icon: LuCoffee,
          color: "from-[#2e1e12] to-[#5f3a27]",
          bgLight: "bg-amber-50",
          sparkline: [menuCount || 0, menuCount || 0, menuCount || 0, menuCount || 0, menuCount || 0, menuCount || 0, menuCount || 0],
        },
      ]);

      // 4. Recent Orders (top 5)
      const mappedRecent = (ordersData || []).slice(0, 5).map(o => ({
        id: o.order_number || `ORD-${String(o.id).padStart(3, '0')}`,
        realId: o.id,
        customer: o.profiles?.name || o.customer_name || "Guest",
        item: "Memuat...",
        total: Number(o.total_amount || 0),
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1)
      }));

      const recentIds = (ordersData || []).slice(0, 5).map(o => o.id);
      if (recentIds.length > 0) {
        const { data: recentItems } = await supabase
          .from("order_items")
          .select("order_id, item_name, quantity")
          .in("order_id", recentIds);
        
        mappedRecent.forEach(orderObj => {
          const itemsStr = (recentItems || [])
            .filter(ri => ri.order_id === orderObj.realId)
            .map(ri => `${ri.item_name} x${ri.quantity}`)
            .join(", ");
          orderObj.item = itemsStr || "Item Menu";
        });
      }
      setRecentOrders(mappedRecent);

      // 5. Top Products (aggregate from order_items)
      const { data: allOrderItems } = await supabase
        .from("order_items")
        .select("item_name, quantity, subtotal");
      
      const productMap = {};
      (allOrderItems || []).forEach(item => {
        if (!productMap[item.item_name]) {
          productMap[item.item_name] = { name: item.item_name, sold: 0, revenue: 0 };
        }
        productMap[item.item_name].sold += item.quantity;
        productMap[item.item_name].revenue += Number(item.subtotal || 0);
      });
      const sortedProducts = Object.values(productMap)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)
        .map(p => ({
          name: p.name,
          sold: p.sold,
          revenue: `IDR ${p.revenue.toLocaleString("id-ID")}`
        }));
      setTopProducts(sortedProducts);

      // 6. Customer Feedbacks (from reviews table)
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      const mappedReviews = (reviewsData || []).map(r => ({
        id: r.id.substring(0, 8).toUpperCase(),
        name: r.customer_name || "Guest",
        category: r.category || "Pelayanan",
        rating: r.rating,
        comment: r.comment || "",
        date: new Date(r.created_at).toISOString().split("T")[0]
      }));
      setFeedbacks(mappedReviews);

      // 7. Donut Chart (Category Share of menu items)
      const { data: menuWithCats } = await supabase
        .from("menu_items")
        .select("id, categories(name)");
      
      const catCount = {};
      (menuWithCats || []).forEach(m => {
        const catName = m.categories?.name || "Uncategorized";
        catCount[catName] = (catCount[catName] || 0) + 1;
      });
      const totalMenuWithCats = (menuWithCats || []).length || 1;
      const donutDataMapped = Object.keys(catCount).map((catName, index) => {
        const colors = ["#8B5F3C", "#BF834F", "#E7D4B0", "#A67B5B", "#D0B49F"];
        return {
          label: catName,
          value: Math.round((catCount[catName] / totalMenuWithCats) * 100),
          color: colors[index % colors.length]
        };
      });
      setDonutData(donutDataMapped);
      setSalesTrend(salesTrendValues);
    } catch (e) {
      console.error("Gagal memuat data dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <LuLoader className="w-10 h-10 animate-spin text-[#8B5F3C]" />
        <p className="text-sm text-slate-500 font-bold">Memuat analisis dashboard...</p>
      </div>
    );
  }

  return (
    <Container maxWidth="full" padding={false}>
      <Stack direction="vertical" spacing="lg">
        {/* Page Title */}
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Here's your coffee shop overview."
        />

        {/* Stats Cards */}
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

        {/* Monthly Target Progress */}
        <SlideUp duration={0.5} delay={0.1}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <Heading level={3} className="!text-base mb-4" style={{ fontFamily: "'Georgia', serif" }}>Monthly Sales Target</Heading>
            <ProgressBar
              label="Revenue Target"
              value={targetPercent}
              target="$ 500.00"
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

        {/* Bottom Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Recent Orders */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-between">
            <div className="flex-1">
              <Heading level={3} className="!text-lg mb-4" style={{ fontFamily: "'Georgia', serif" }}>Recent Orders</Heading>
              {recentOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">Belum ada pesanan masuk</div>
              ) : (
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
                      <td className="px-6 py-4 text-gray-600 font-medium">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm truncate max-w-[150px]">{order.item}</td>
                      <td className="px-6 py-4 font-bold text-[#2C1A0E]">IDR {order.total.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  )}
                />
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <Heading level={3} className="!text-lg mb-4" style={{ fontFamily: "'Georgia', serif" }}>Top Products</Heading>
            {topProducts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">Belum ada produk terjual</div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Customer Feedbacks */}
        <SlideUp duration={0.5} delay={0.2}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-between">
            <div>
              <Heading level={3} className="!text-lg mb-4" style={{ fontFamily: "'Georgia', serif" }}>Customer Feedbacks & Ratings</Heading>
              {feedbacks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">Belum ada ulasan dari pelanggan</div>
              ) : (
                <Table
                  columns={[
                    { label: "ID" },
                    { label: "Name" },
                    { label: "Date" },
                    { label: "Category" },
                    { label: "Rating" },
                    { label: "Comment" }
                  ]}
                  data={feedbacks}
                  renderRow={(review) => (
                    <tr key={review.id} className="hover:bg-amber-50/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-700">{review.id}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{review.name}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{review.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          review.category === "Pelayanan" ? "bg-blue-50 text-blue-800" :
                          review.category === "Rasa Menu" ? "bg-amber-50 text-amber-800" :
                          review.category === "Kebersihan" ? "bg-emerald-50 text-emerald-800" :
                          review.category === "Suasana" ? "bg-purple-50 text-purple-800" :
                          "bg-gray-50 text-gray-800"
                        }`}>
                          {review.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <RatingStars rating={review.rating} size={14} />
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate font-medium" title={review.comment}>
                        {review.comment}
                      </td>
                    </tr>
                  )}
                />
              )}
            </div>
          </div>
        </SlideUp>
      </Stack>
    </Container>
  );
}
