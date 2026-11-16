import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ITrashItem } from "@/interfaces/admin.interface";
import {
  Briefcase,
  Building2,
  FolderTree,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import React from "react";

export interface TrashItemRowProps {
  item: ITrashItem;
  isBusy: boolean;
  onRestore: (item: ITrashItem) => void;
  onPurgeRequest: (item: ITrashItem) => void;
}

export function TrashItemRow({
  item,
  isBusy,
  onRestore,
  onPurgeRequest,
}: TrashItemRowProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "candidate":
        return (
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold gap-1">
            <User className="h-3 w-3" />
            Candidate
          </Badge>
        );
      case "recruiter":
        return (
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-semibold gap-1">
            <Building2 className="h-3 w-3" />
            Recruiter
          </Badge>
        );
      case "job":
        return (
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 text-xs font-semibold gap-1">
            <Briefcase className="h-3 w-3" />
            Job Post
          </Badge>
        );
      case "category":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold gap-1">
            <FolderTree className="h-3 w-3" />
            Category
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      {/* Type Badge */}
      <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(item.type)}</td>

      {/* Title */}
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="font-bold text-slate-900">{item.title}</p>
      </td>

      {/* Subtitle */}
      <td className="px-6 py-4">
        <span className="text-xs text-slate-500 font-mono">
          {item.subtitle}
        </span>
      </td>

      {/* Deleted At */}
      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : "Archived"}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            disabled={isBusy}
            onClick={() => onRestore(item)}
            className="gap-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-xs font-bold shadow-xs"
          >
            {isBusy ? <Spinner size="sm" /> : <RotateCcw className="h-3.5 w-3.5" />}
            Restore Record
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => onPurgeRequest(item)}
            className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200"
            title="Permanently Purge"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
