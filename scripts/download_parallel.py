import subprocess
import json
import base64
import os
import time
from concurrent.futures import ThreadPoolExecutor

API_KEY = os.environ.get("STITCH_API_KEY", "")

screens = [
    {
        "id": "857196a7465c417a95afe7cba8f557b0",
        "folder": "04_settings_integrations",
        "title": "الإعدادات وتكاملات المنصة - WaSell",
        "img_url": "https://stitch.googleapis.com/v1/projects/1343490159099921483/files/screenshot_00065f5ee9afdba505f138fd281b3b5b:download"
    },
    {
        "id": "df502e18c8454563891347cca7f7ae9a",
        "folder": "05_analytics",
        "title": "التحليلات وذكاء المحادثات - WaSell",
        "img_url": "https://stitch.googleapis.com/v1/projects/1343490159099921483/files/screenshot_00065f5ed57feecc04e740a7c70cc8b3:download"
    },
    {
        "id": "a0cfc079cedd485393f1733a7ea07600",
        "folder": "06_customers_crm",
        "title": "إدارة العملاء وذكاء الجمهور - WaSell",
        "img_url": "https://stitch.googleapis.com/v1/projects/1343490159099921483/files/screenshot_00065f5ecce4a8e0044f6231992f1916:download"
    },
    {
        "id": "bd59f919a43a4d27a6eb26b8db2b5b91",
        "folder": "07_orders_sales",
        "title": "إدارة الطلبات ومبيعات واتساب - WaSell",
        "img_url": "https://stitch.googleapis.com/v1/projects/1343490159099921483/files/screenshot_00065f5eb7490f38089af6571f283239:download"
    },
    {
        "id": "dac33535b84a4bdfb83dd8f16ab761e8",
        "folder": "08_products_catalog",
        "title": "إدارة المنتجات وكتالوج واتساب الذكي - WaSell",
        "img_url": "https://stitch.googleapis.com/v1/projects/1343490159099921483/files/screenshot_00065f5ec67216130925c7b653250c77:download"
    }
]

def download_one(item):
    folder = item["folder"]
    out_dir = os.path.join("stitch-screens", folder)
    os.makedirs(out_dir, exist_ok=True)
    out_png = os.path.join(out_dir, "screenshot.png")
    
    if os.path.exists(out_png) and os.path.getsize(out_png) > 100000:
        print(f"Skipping {folder}, already downloaded ({os.path.getsize(out_png)} bytes).", flush=True)
        return True

    print(f"[{folder}] Starting parallel download for {item['title']}...", flush=True)
    t0 = time.time()
    tmp_json = f"/tmp/{folder}.json"
    cmd = [
        "curl", "-4", "-s", "-L",
        "-H", f"X-Goog-Api-Key: {API_KEY}",
        item["img_url"],
        "-o", tmp_json
    ]
    ret = subprocess.run(cmd)
    if ret.returncode != 0:
        print(f"[{folder}] Error running curl: returncode {ret.returncode}", flush=True)
        return False

    elapsed = time.time() - t0
    json_size = os.path.getsize(tmp_json)
    print(f"[{folder}] Downloaded JSON in {elapsed:.1f}s ({json_size/1024:.1f} KB). Decoding base64...", flush=True)

    try:
        with open(tmp_json, "r", encoding="utf-8") as f:
            data = json.load(f)
        b64_str = data.get("dataString", "")
        img_bytes = base64.b64decode(b64_str)
        with open(out_png, "wb") as f:
            f.write(img_bytes)
        print(f"[{folder}] Successfully saved PNG ({len(img_bytes)/1024:.1f} KB) in {out_png}", flush=True)
        if os.path.exists(tmp_json):
            os.remove(tmp_json)
        return True
    except Exception as e:
        print(f"[{folder}] Failed to decode: {e}", flush=True)
        return False

print("Launching parallel downloads for remaining 5 screens...", flush=True)
with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(download_one, screens))

print(f"Completed! Success count: {sum(1 for r in results if r)}/{len(screens)}", flush=True)
