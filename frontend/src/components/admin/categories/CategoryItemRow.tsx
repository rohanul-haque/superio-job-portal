import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ICategory } from "@/types/category";
import {
  Briefcase,
  CheckCircle2,
  ImageIcon,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import React from "react";

export interface CategoryItemRowProps {
  category: ICategory;
  onEdit: (category: ICategory) => void;
  onDeleteRequest: (category: ICategory) => void;
}

export function CategoryItemRow({
  category,
  onEdit,
  onDeleteRequest,
}: CategoryItemRowProps) {
  const count = category.jobCount ?? category._count?.jobs ?? 0;

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      {/* Category Name & Thumbnail */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 p-1">
            {category.icon?.url ? (
              <img
                src={category.icon.url}
                alt={category.name}
                className="h-full w-full object-contain rounded-lg"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900">{category.name}</div>
            <div className="text-[11px] text-slate-400">
              ID: {category.id.slice(-6)}
            </div>
          </div>
        </div>
      </td>

      {/* Auto-Generated Slug */}
      <td className="py-3.5 px-4 sm:px-6">
        <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-medium text-slate-700 border border-slate-200">
          {category.slug}
        </code>
      </td>

      {/* Open Jobs */}
      <td className="py-3.5 px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
          <Briefcase className="h-3 w-3 text-slate-400" />
          {count}
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 sm:px-6 text-center">
        {category.isActive ? (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] gap-1 font-semibold cursor-default select-none"
          >
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] gap-1 font-semibold cursor-default select-none"
          >
            <XCircle className="h-3 w-3" />
            Inactive
          </Badge>
        )}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 sm:px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 px-2.5 text-xs text-slate-700 hover:text-blue-600 hover:border-blue-300"
          >
            <Pencil className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteRequest(category)}
            className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </td>
    </tr>
  );
}
