import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

export type Shipment = {
  id: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  address: string;
  deliveryAddress: string;
  createdAt: string;
  status: "In Transit" | "Processing" | "Delivered" | "Pending" | "Cancelled";
};

const statusType = ({
  status,
}: { status?: Shipment["status"] } = {}): string => {
  switch (status) {
    case "In Transit":
      return "bg-blue-500 text-white"; // Blue for movement/transport
    case "Delivered":
      return "bg-green-500 text-white"; // Green for success/completion
    case "Pending":
      return "bg-gray-500 text-white"; // Gray for neutral/awaiting action
    case "Processing":
      return "bg-amber-500 text-amber-900"; // Amber/yellow for active processing
    case "Cancelled":
      return "bg-rose-500 text-white"; // Amber/yellow for active processing
    default:
      return "bg-gray-500 text-white"; // Fallback
  }
};

export const columns: ColumnDef<Shipment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "trackingNumber",
    header: "Tracking Number",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("trackingNumber")}</div>
    ),
  },
  {
    accessorKey: "receiverName",
    header: "Reciever Name",
    cell: ({ row }) => (
      <div className="text-sm capitalize">{row.getValue("receiverName")}</div>
    ),
  },
  {
    accessorKey: "receiverAddress",
    header: "Delivery Address",
    cell: ({ row }) => (
      <div className="text-sm capitalize">
        {row.getValue("receiverAddress")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div
          className={`rounded-full px-3 py-1 text-center text-xs ${statusType({
            status: row.getValue("status"),
          })}`}
        >
          {row.getValue("status")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {format(new Date(row.getValue("createdAt")), "MMMMMM do yyyy")}
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">
                <Ellipsis />
              </span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {}}>View details</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
