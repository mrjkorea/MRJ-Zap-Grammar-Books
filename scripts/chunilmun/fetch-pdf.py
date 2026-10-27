#!/usr/bin/env python3
"""Fetch 천일문 scan PDF from Google Drive (Jay's copy) into .local/chunilmun.pdf.

Requires Cursor Cloud Agent unix socket (OIDC) + Drive MCP OAuth on the host.
If direct Google API returns 401, place the PDF manually at the output path.
"""
from __future__ import annotations

import json
import os
import socket
import sys
import urllib.error
import urllib.request

DRIVE_FILE_ID = "1J6WQyi-EIdciqEnd-8vYstd4_E5Wt4qO"
OUT = os.path.join(os.path.dirname(__file__), "../../.local/chunilmun.pdf")
SOCKET = os.environ.get("CURSOR_AGENT_SOCKET", "/run/cursor/api.sock")


def oidc_token(aud: str) -> str:
    body = json.dumps({"aud": aud}).encode()
    req = (
        b"POST /v1/tokens/oidc HTTP/1.1\r\nHost: localhost\r\n"
        b"Content-Type: application/json\r\nContent-Length: "
        + str(len(body)).encode()
        + b"\r\n\r\n"
        + body
    )
    s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    s.connect(SOCKET)
    s.sendall(req)
    data = b""
    while True:
        chunk = s.recv(65536)
        if not chunk:
            break
        data += chunk
    s.close()
    payload = json.loads(data.split(b"\r\n\r\n", 1)[1])
    return payload["token"]


def main() -> int:
    os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
    if os.path.isfile(OUT) and os.path.getsize(OUT) > 50_000_000:
        print("Already have PDF at", OUT, os.path.getsize(OUT))
        return 0

    token = oidc_token("https://www.googleapis.com/auth/drive.readonly")
    url = f"https://www.googleapis.com/drive/v3/files/{DRIVE_FILE_ID}?alt=media&supportsAllDrives=true"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=900) as resp:
            total = int(resp.headers.get("Content-Length") or 0)
            done = 0
            with open(OUT, "wb") as f:
                while True:
                    chunk = resp.read(1024 * 1024)
                    if not chunk:
                        break
                    f.write(chunk)
                    done += len(chunk)
                    if total and done % (20 * 1024 * 1024) == 0:
                        print(f"  {done}/{total}")
    except urllib.error.HTTPError as e:
        print(
            "Drive download failed:",
            e.code,
            e.read()[:300].decode("utf-8", "replace"),
            file=sys.stderr,
        )
        print(
            "Place the scan manually at",
            OUT,
            "or use Google Drive MCP download (10MB cap).",
            file=sys.stderr,
        )
        return 1

    print("Saved", OUT, os.path.getsize(OUT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
