
import json, os, time
from threading import Thread

tmp_dir = "/app/tmp"

def write_files():
    os.makedirs(tmp_dir, exist_ok=True)
    for i in range(5):
        with open(f"{tmp_dir}/file{i}.json", "w") as f:
            json.dump({"index": i, "data": f"tmp-data-{i}"}, f)
        time.sleep(1)

Thread(target=write_files).start()

