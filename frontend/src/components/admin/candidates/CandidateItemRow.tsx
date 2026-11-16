import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IAdminCandidate } from "@/interfaces/admin.interface";
import {
  Ban,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  ShieldCheck,
  Trash2,
  Unlock,
  XCircle,
} from "lucide-react";
import React from "react";

interface CandidateItemRowProps {
  candidate: IAdminCandidate;
  isBusy: boolean;
  onPreview: (candidate: IAdminCandidate) => void;
  onModerate: (
    candidate: IAdminCandidate,
    action: "block" | "unblock" | "delete"
  ) => void;
}

export default function CandidateItemRow({
  candidate: c,
  isBusy,
  onPreview,
  onModerate,
}: CandidateItemRowProps) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      {/* Profile */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 border border-slate-200">
            <AvatarImage src={c.profilePicture?.url} alt={c.name} />
            <AvatarFallback className="bg-purple-50 text-purple-700 font-bold text-sm">
              {c.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 leading-tight">{c.name}</p>
            <p className="text-xs text-slate-500 leading-normal">{c.email}</p>
          </div>
        </div>
      </td>

      {/* Title & Skills */}
      <td className="px-6 py-4 max-w-xs">
        <p className="font-semibold text-slate-800 text-xs truncate">
          {c.title || "Not Specified"}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {c.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
          {(c.skills?.length || 0) > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{c.skills.length - 3}
            </span>
          )}
        </div>
      </td>

      {/* Status Badges */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-1 items-start">
          {c.status === "active" ? (
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

          {c.isEmailVerified ? (
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

      {/* Resume */}
      <td className="px-6 py-4 whitespace-nowrap">
        {c.resume ? (
          <a
            href={c.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition"
          >
            <FileText className="h-3 w-3" />
            Resume
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">None</span>
        )}
      </td>

      {/* Applications Count */}
      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
        {c.applicationCount || 0} applied
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(c)}
            className="h-8 px-2 text-xs text-slate-600 hover:text-purple-600"
            title="Preview Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>

          {c.status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => onModerate(c, "block")}
              className="h-8 px-2 text-xs text-amber-600 hover:bg-amber-50 hover:border-amber-200"
              title="Block Account"
            >
              <Ban className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => onModerate(c, "unblock")}
              className="h-8 px-2 text-xs text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
              title="Unblock Account"
            >
              <Unlock className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => onModerate(c, "delete")}
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
