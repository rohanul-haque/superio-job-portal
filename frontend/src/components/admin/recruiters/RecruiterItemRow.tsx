import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IAdminRecruiter } from "@/interfaces/admin.interface";
import {
  Ban,
  CheckCircle2,
  Eye,
  Globe,
  MapPin,
  ShieldCheck,
  Trash2,
  Unlock,
  Users,
  XCircle,
} from "lucide-react";
import React from "react";

interface RecruiterItemRowProps {
  recruiter: IAdminRecruiter;
  isBusy: boolean;
  onPreview: (recruiter: IAdminRecruiter) => void;
  onModerate: (
    recruiter: IAdminRecruiter,
    action: "block" | "unblock" | "delete"
  ) => void;
}

export default function RecruiterItemRow({
  recruiter: r,
  isBusy,
  onPreview,
  onModerate,
}: RecruiterItemRowProps) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      {/* Company Profile */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 rounded-xl border border-slate-200">
            <AvatarImage
              src={r.image}
              alt={r.name}
              className="rounded-xl object-cover"
            />
            <AvatarFallback className="rounded-xl bg-purple-50 text-purple-700 font-bold text-sm">
              {r.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 leading-tight">{r.name}</p>
            <p className="text-xs text-slate-500 leading-normal">{r.email}</p>
            {r.website && (
              <a
                href={
                  r.website.startsWith("http")
                    ? r.website
                    : `https://${r.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-purple-600 hover:underline mt-0.5"
              >
                <Globe className="h-3 w-3" />
                Website
              </a>
            )}
          </div>
        </div>
      </td>

      {/* Location & Size */}
      <td className="px-6 py-4">
        <p className="flex items-center gap-1 text-xs text-slate-700">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {r.location || "Remote / Unspecified"}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
          <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {r.companySize || "N/A"}
        </p>
      </td>

      {/* Status Badges */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-1 items-start">
          {r.status === "active" ? (
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold gap-1 cursor-default select-none"
            >
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-white hover:text-rose-800 hover:border-rose-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold gap-1 cursor-default select-none"
            >
              <Ban className="h-3 w-3" />
              Blocked
            </Badge>
          )}

          {r.isEmailVerified ? (
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
              <ShieldCheck className="h-3 w-3" />
              Verified Email
            </span>
          ) : (
            <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-medium">
              <XCircle className="h-3 w-3" />
              Unverified
            </span>
          )}
        </div>
      </td>

      {/* Jobs & Inflow */}
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-xs font-bold text-slate-900">
          {r.jobCount || 0} jobs posted
        </p>
        <p className="text-[11px] text-slate-500">
          {r.applicationCount || 0} applicants received
        </p>
      </td>

      {/* Registered */}
      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
        {new Date(r.createdAt).toLocaleDateString()}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(r)}
            className="h-8 px-2 text-xs text-slate-600 hover:text-purple-600"
            title="Preview Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>

          {r.status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => onModerate(r, "block")}
              className="h-8 px-2 text-xs text-amber-600 hover:bg-amber-50 hover:border-amber-200"
              title="Block Recruiter"
            >
              <Ban className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => onModerate(r, "unblock")}
              className="h-8 px-2 text-xs text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
              title="Unblock Recruiter"
            >
              <Unlock className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => onModerate(r, "delete")}
            className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200"
            title="Soft Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
