import { useState } from "react";
import customersData from "../data/customers.json";
import { PageHeader } from "../components/6-section";
import { Avatar } from "../components/11-media";
import { StatusDot } from "../components/12-status";
import { Price, Caption, Label } from "../components/14-typography";
import { Grid, Stack, Divider } from "../components/2-layout";
import { Card, Tooltip } from "../components/3-data-display";
import { Breadcrumb } from "../components/7-navigation";
import { Dropdown } from "../components/10-overlay";
import { IconButton } from "../components/13-action";
import { SlideUp } from "../components/15-animation";
import { LuPhone, LuCalendar } from "react-icons/lu";

export default function Customers() {
  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Customers" },
        ]}
      />

      <PageHeader
        title="Customers"
        subtitle="View and manage your loyal customers"
      />

      <Grid cols={4} gap="md">
        {customersData.map((c, index) => (
          <SlideUp key={c.id} duration={0.4} delay={index * 0.05}>
            <Card
              className="flex flex-col border border-gray-50 shadow-sm p-5 hover:shadow-md"
            >
              {/* Profile Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={c.name} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#2C1A0E] truncate">{c.name}</h3>
                  <Tooltip content={c.email}>
                    <p className="text-xs text-gray-400 truncate mt-0.5 cursor-help">{c.email}</p>
                  </Tooltip>
                </div>
                <StatusDot active={c.status === "Active"} label={c.status} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-gray-50">
                <div>
                  <p className="text-lg font-bold text-[#2C1A0E]">{c.totalOrders}</p>
                  <Caption>Orders</Caption>
                </div>
                <div>
                  <Price value={c.totalSpent} size="md" />
                  <Caption>Spent</Caption>
                </div>
              </div>

              {/* Contact & Meta */}
              <Divider spacing="my-3" />
              <Stack direction="vertical" spacing="sm">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <LuPhone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LuCalendar className="w-3.5 h-3.5 text-gray-400" />
                  <Label className="!mb-0">Joined {c.joinDate}</Label>
                </div>
              </Stack>
            </Card>
          </SlideUp>
        ))}
      </Grid>
    </div>
  );
}
