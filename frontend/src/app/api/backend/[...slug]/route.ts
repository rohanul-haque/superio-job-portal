import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

const EXCLUDED_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "transfer-encoding",
  "set-cookie",
  "connection",
  "keep-alive",
]);

interface ParsedCookie {
  name: string;
  value: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
}

function parseSetCookie(cookieStr: string): ParsedCookie | null {
  const parts = cookieStr.split(";").map((p) => p.trim());
  if (!parts[0]) return null;
  const firstEq = parts[0].indexOf("=");
  if (firstEq === -1) return null;
  const name = parts[0].slice(0, firstEq).trim();
  const value = parts[0].slice(firstEq + 1).trim();

  let maxAge: number | undefined;
  let expires: Date | undefined;
  let path = "/";

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const eqIdx = part.indexOf("=");
    const key = (eqIdx === -1 ? part : part.slice(0, eqIdx))
      .toLowerCase()
      .trim();
    const val = eqIdx === -1 ? "" : part.slice(eqIdx + 1).trim();

    if (key === "max-age") {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) maxAge = parsed;
    } else if (key === "expires") {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) expires = parsed;
    } else if (key === "path" && val) {
      path = val;
    }
  }

  return { name, value, maxAge, expires, path };
}

const getBackendBaseUrl = (): string => {
  const url =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1";
  return url.trim().replace(/\/+$/, "");
};

async function handleProxy(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { slug } = await context.params;
  const pathSegment = Array.isArray(slug) ? slug.join("/") : "";
  const backendBaseUrl = getBackendBaseUrl();
  const queryString = request.nextUrl.search || "";
  const targetUrl = `${backendBaseUrl}/${pathSegment}${queryString}`;

  // 1. Prepare request headers (exclude hop-by-hop and host headers)
  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!HOP_BY_HOP_HEADERS.has(lowerKey)) {
      forwardHeaders.set(key, value);
    }
  });

  // Ensure incoming frontend cookies are forwarded to the backend
  const incomingCookie = request.headers.get("cookie");
  if (incomingCookie) {
    forwardHeaders.set("cookie", incomingCookie);
  }

  // 2. Prepare request body for non-GET/HEAD methods
  let body: BodyInit | undefined = undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const arrayBuffer = await request.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      body = Buffer.from(arrayBuffer);
    }
  }

  // 3. Dispatch server-to-server request to Render backend
  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
      cache: "no-store",
    });

    // 4. Collect response headers (excluding hop-by-hop and set-cookie)
    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      if (!EXCLUDED_RESPONSE_HEADERS.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Explicit cache prevention for all API proxy responses
    responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate");

    const responseData = await backendResponse.arrayBuffer();

    const nextResponse = new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });

    // 5. Transfer Set-Cookie headers to the frontend domain
    let rawCookies: string[] = [];
    if (typeof backendResponse.headers.getSetCookie === "function") {
      rawCookies = backendResponse.headers.getSetCookie();
    } else {
      const single = backendResponse.headers.get("set-cookie");
      if (single) {
        rawCookies = [single];
      }
    }

    const isSecure =
      process.env.NODE_ENV === "production" ||
      request.nextUrl.protocol === "https:";

    for (const rawCookie of rawCookies) {
      const parsed = parseSetCookie(rawCookie);
      if (parsed) {
        nextResponse.cookies.set({
          name: parsed.name,
          value: parsed.value,
          httpOnly: true,
          secure: isSecure,
          sameSite: "lax",
          path: parsed.path || "/",
          maxAge: parsed.maxAge,
          expires: parsed.expires,
        });
      }
    }

    return nextResponse;
  } catch (error: unknown) {
    console.error(
      `[BFF Proxy Error] Failed to proxy request to ${targetUrl}:`,
      error,
    );
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to connect to the backend service. Please check your network or try again later.",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
