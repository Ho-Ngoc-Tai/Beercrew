"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { formatCurrencyVND, formatDateTime } from "@commons/utils/format";
import { Ticket, TicketStatus } from "@interfaces/tickets";
import { MapPin, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@components/ui/button";

interface DataTableProps {
  items: Ticket[];
  isLoading?: boolean;
  onSelectTicket?: (ticket: Ticket) => void;
}

export function DataTable({ items, isLoading = false, onSelectTicket }: DataTableProps) {
  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return <Badge variant="open">⏳ Đang mở vote</Badge>;
      case "locked":
        return <Badge variant="locked">🔒 Đã chốt kèo</Badge>;
      case "paid":
        return <Badge variant="paid">✅ Đã ting-ting</Badge>;
      case "cancelled":
        return <Badge variant="cancelled">❌ Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-neutral-400 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#ff8c42] border-t-transparent" />
        <span className="text-sm font-medium">Đang tải danh sách kèo...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-[#f0ede6] dark:border-[#2a2a2a]">
        <div className="h-16 w-16 rounded-3xl bg-[#fff4ed] dark:bg-[#2e1e14] flex items-center justify-center text-2xl mb-4">
          🍻
        </div>
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Chưa có kèo nào được tạo
        </h4>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">
          Hãy bấm "Chốt Kèo Mới" để lên lịch tụ tập, chọn quán ngon và mời bạn bè tham gia!
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Mã Kèo</TableHead>
          <TableHead>Tên Kèo & Địa Điểm</TableHead>
          <TableHead>Thời Gian</TableHead>
          <TableHead>Thành Viên</TableHead>
          <TableHead>Tổng Bill (Dự Kiến)</TableHead>
          <TableHead>Trạng Thái</TableHead>
          <TableHead className="text-right">Chi Tiết</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((ticket) => (
          <TableRow
            key={ticket.id}
            className="cursor-pointer group"
            onClick={() => onSelectTicket?.(ticket)}
          >
            <TableCell className="font-bold text-xs text-neutral-400">
              {ticket.id}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-[#ff8c42] transition-colors">
                  {ticket.title}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                  {ticket.venue} ({ticket.address})
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                {formatDateTime(ticket.scheduledTime)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center -space-x-2">
                {ticket.members?.slice(0, 4).map((member) => (
                  <Avatar key={member.id} className="h-7 w-7 border-2 border-white dark:border-[#1e1e1e]">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {ticket.members?.length > 4 && (
                  <div className="h-7 w-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-white dark:border-[#1e1e1e] flex items-center justify-center text-[10px] font-bold text-neutral-500">
                    +{ticket.members.length - 4}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                  {formatCurrencyVND(ticket.totalBill)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  ~{formatCurrencyVND(ticket.perPersonBill)} / người
                </span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(ticket.status)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="group-hover:bg-[#ff8c42] group-hover:text-white transition-all rounded-xl"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
