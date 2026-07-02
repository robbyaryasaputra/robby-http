import { supabase } from "./supabase";

// Membership Tiers defined in database/application
export const MEMBERSHIP_TIERS = [
  {
    id: 1,
    name: "Bronze",
    min_points: 0,
    points_multiplier: 1.0,
    discount_percent: 0.0,
    badge_color: "#CD7F32",
  },
  {
    id: 2,
    name: "Silver",
    min_points: 500,
    points_multiplier: 1.5,
    discount_percent: 5.0,
    badge_color: "#C0C0C0",
  },
  {
    id: 3,
    name: "Gold",
    min_points: 2000,
    points_multiplier: 2.0,
    discount_percent: 10.0,
    badge_color: "#FFD700",
  },
  {
    id: 4,
    name: "Platinum",
    min_points: 5000,
    points_multiplier: 3.0,
    discount_percent: 15.0,
    badge_color: "#E5E4E2",
  },
];

const mapPaymentMethod = (method) => {
  const m = String(method).toLowerCase().trim();
  if (m === "member_balance" || m === "member" || m === "member balance")
    return "e_wallet";
  if (["cash", "card", "e_wallet", "qris"].includes(m)) return m;
  return "cash";
};

// 1. Get menu items joining with categories
export async function getMenuItems({ limit } = {}) {
  try {
    let query = supabase
      .from("menu_items")
      .select("*, categories(name)")
      .eq("is_available", true)
      .order("display_order", { ascending: true });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    const mapped = (data || []).map((item) => ({
      ...item,
      category: item.categories?.name || "Uncategorized",
      image: item.image_url || item.image,
      reviews: item.review_count || 0,
      price: Number(item.price || 0),
      rating: Number(item.rating || 0),
    }));

    return { data: mapped, error: null };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return { data: null, error };
  }
}

// 2. Get list of categories
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: null, error };
  }
}

// 3. Toggle favorite for a user and menu item
export async function toggleFavorite(userId, menuItemId) {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("customer_id", userId)
      .eq("menu_item_id", menuItemId)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      // Exists: delete
      const { error: delError } = await supabase
        .from("favorites")
        .delete()
        .eq("customer_id", userId)
        .eq("menu_item_id", menuItemId);
      if (delError) throw delError;
      return { success: true, action: "removed" };
    } else {
      // Doesn't exist: insert
      const { error: insError } = await supabase.from("favorites").insert({
        customer_id: userId,
        menu_item_id: menuItemId,
      });
      if (insError) throw insError;
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error };
  }
}

// 4. Create an order with items and payment details
export async function createOrder(orderPayload, itemsPayload, paymentPayload) {
  try {
    // 1. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) throw orderError;

    const orderId = orderData.id;

    // 2. Prepare and insert order items
    const mappedItems = itemsPayload.map((item) => ({
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      notes: item.notes || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(mappedItems);

    if (itemsError) throw itemsError;

    // 3. Prepare and insert payment
    const mappedPayment = {
      order_id: orderId,
      payment_method: mapPaymentMethod(paymentPayload.payment_method),
      amount: paymentPayload.amount,
      status: paymentPayload.status || "pending",
      paid_at:
        paymentPayload.status === "paid" ? new Date().toISOString() : null,
    };

    const { error: paymentError } = await supabase
      .from("payments")
      .insert(mappedPayment);

    if (paymentError) throw paymentError;

    return { data: orderData, error: null };
  } catch (error) {
    console.error("Error creating order:", error);
    return { data: null, error };
  }
}

// 5. Create a point transaction and update the user's membership points
export async function createPointTransaction({
  membership_id,
  type,
  points,
  description,
}) {
  try {
    // Fetch the member's current profile
    const { data: member, error: fetchError } = await supabase
      .from("members")
      .select("*")
      .eq("id", membership_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let currentPoints = member ? member.current_points : 0;
    let totalPoints = member ? member.total_points : 0;

    let delta = Math.abs(points);
    if (type === "redeem") {
      currentPoints = Math.max(0, currentPoints - delta);
    } else {
      // earn or bonus
      currentPoints = currentPoints + delta;
      totalPoints = totalPoints + delta;
    }

    // Update the members table
    if (member) {
      const { error: updateError } = await supabase
        .from("members")
        .update({
          current_points: currentPoints,
          total_points: totalPoints,
          updated_at: new Date().toISOString(),
        })
        .eq("id", membership_id);

      if (updateError) throw updateError;
    } else {
      // Auto-create a bronze profile if not present
      const { error: insertError } = await supabase.from("members").insert({
        id: membership_id,
        tier: "Bronze",
        total_points: totalPoints,
        current_points: currentPoints,
        status: "active",
      });

      if (insertError) throw insertError;
    }

    // Insert log into activity_logs
    const { error: logError } = await supabase.from("activity_logs").insert({
      user_id: membership_id,
      action:
        type === "earn"
          ? "POINTS_EARN"
          : type === "bonus"
            ? "POINTS_BONUS"
            : "POINTS_REDEEM",
      entity_type: "members",
      entity_id: membership_id,
      new_data: {
        delta: type === "redeem" ? -delta : delta,
        points: currentPoints,
        total: totalPoints,
        description: description,
      },
    });

    if (logError) throw logError;

    return {
      data: { current_points: currentPoints, total_points: totalPoints },
      error: null,
    };
  } catch (error) {
    console.error("Error creating point transaction:", error);
    return { data: null, error };
  }
}

// 6. Get member membership by customer ID
export async function getMemberMembershipByCustomer(customerId) {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", customerId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching membership by customer:", error);
    return { data: null, error };
  }
}

// 7. Get available member rewards
export async function getMemberRewards() {
  const rewards = [
    {
      id: "r-1",
      name: "Free Americano",
      points_required: 50,
      min_tier_id: 1,
      min_tier_name: "Bronze",
      description: "Tukar poin untuk 1 Americano gratis",
      type: "free_item",
    },
    {
      id: "r-2",
      name: "Free Pastry",
      points_required: 75,
      min_tier_id: 1,
      min_tier_name: "Bronze",
      description: "Tukar poin untuk 1 Butter Croissant gratis",
      type: "free_item",
    },
    {
      id: "r-3",
      name: "Free Caramel Macchiato",
      points_required: 150,
      min_tier_id: 2,
      min_tier_name: "Silver",
      description: "Tukar poin untuk 1 Caramel Macchiato gratis",
      type: "free_item",
    },
    {
      id: "r-4",
      name: "Free Merchandise Mug",
      points_required: 300,
      min_tier_id: 3,
      min_tier_name: "Gold",
      description: "Tukar poin untuk 1 Official Coffee Mug gratis",
      type: "merchandise",
    },
    {
      id: "r-5",
      name: "VIP Tasting Session Voucher",
      points_required: 500,
      min_tier_id: 4,
      min_tier_name: "Platinum",
      description:
        "Tukar poin untuk 1 tiket VIP Cupping & Tasting Session gratis",
      type: "voucher",
    },
  ];
  return { data: rewards, error: null };
}

// 8. Get membership tiers list
export async function getMembershipTiers() {
  return { data: MEMBERSHIP_TIERS, error: null };
}

// --- Additional helpers for admin panels and missing tables ---
export async function getUsers({ limit, offset } = {}) {
  try {
    let q = supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    if (offset) q = q.range(offset, (offset || 0) + (limit || 100) - 1);
    const { data, error } = await q;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: null, error };
  }
}

export async function createUser(payload) {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating user:", error);
    return { data: null, error };
  }
}

export async function updateUser(id, payload) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating user:", error);
    return { data: null, error };
  }
}

export async function deleteUser(id) {
  try {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
}

export async function getAddresses({ customerId } = {}) {
  try {
    let q = supabase
      .from("addresses")
      .select("*")
      .order("created_at", { ascending: false });
    if (customerId) q = q.eq("customer_id", customerId);
    const { data, error } = await q;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return { data: null, error };
  }
}

export async function upsertAddress(payload) {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .upsert(payload)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error upserting address:", error);
    return { data: null, error };
  }
}

export async function getNotifications({ userId, unreadOnly } = {}) {
  try {
    let q = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (userId) q = q.eq("user_id", userId);
    if (unreadOnly) q = q.eq("is_read", false);
    const { data, error } = await q;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { data: null, error };
  }
}

export async function createNotification(payload) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { data: null, error };
  }
}

export async function markNotificationsRead(ids = []) {
  try {
    if (!ids || ids.length === 0)
      return { success: false, error: new Error("No ids provided") };
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", ids);
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error marking notifications read:", error);
    return { success: false, error };
  }
}

export async function getAppSettings() {
  try {
    const { data, error } = await supabase.from("app_settings").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching app settings:", error);
    return { data: null, error };
  }
}

export async function updateAppSetting(key, value, updatedBy = null) {
  try {
    const { data, error } = await supabase
      .from("app_settings")
      .upsert({ key, value, updated_by: updatedBy })
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating app setting:", error);
    return { data: null, error };
  }
}

export async function getActivityLogs({ limit } = {}) {
  try {
    let q = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return { data: null, error };
  }
}

export async function getReviews({ approveStatus } = {}) {
  try {
    let q = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (approveStatus !== undefined) q = q.eq("is_approved", approveStatus);
    const { data, error } = await q;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { data: null, error };
  }
}

export async function moderateReview(id, approve) {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({ is_approved: approve })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error moderating review:", error);
    return { data: null, error };
  }
}

export async function getFavoritesByUser(userId) {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("customer_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return { data: null, error };
  }
}

export async function getPayments({ orderId } = {}) {
  try {
    let q = supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (orderId) q = q.eq("order_id", orderId);
    const { data, error } = await q;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { data: null, error };
  }
}

// Default export
const db = {
  getMenuItems,
  getCategories,
  toggleFavorite,
  createOrder,
  createPointTransaction,
  getMemberMembershipByCustomer,
  getMemberRewards,
  getMembershipTiers,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAddresses,
  upsertAddress,
  getNotifications,
  createNotification,
  markNotificationsRead,
  getAppSettings,
  updateAppSetting,
  getActivityLogs,
  getReviews,
  moderateReview,
  getFavoritesByUser,
  getPayments,
};

export default db;
