"""Writes assets/github-stats.js from Vimal's public GitHub contribution calendars."""
import datetime as dt
import json
import pathlib
import re
import urllib.request

USER = "Lamiv"
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "github-stats.js"


def fetch(query=""):
    url = f"https://github.com/users/{USER}/contributions{query}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")


def total(html):
    return int(re.search(r"([\d,]+)\s+contributions?\s+in", html).group(1).replace(",", ""))


def main():
    this_year = dt.date.today().year
    years = [
        [y, total(fetch(f"?from={y}-01-01&to={y}-12-31"))]
        for y in (this_year - 1, this_year)
    ]
    stats = {
        "updated": dt.date.today().isoformat(),
        "lastYear": total(fetch()),
        "years": years,
    }
    OUT.write_text("window.GH_STATS=" + json.dumps(stats, separators=(",", ":")) + ";\n", encoding="utf-8")


if __name__ == "__main__":
    main()
