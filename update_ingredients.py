#!/usr/bin/env python3
"""
Update product ingredients in Supabase.
Reads JSON from stdin: [{"brand": "X", "name": "Y", "ingredients": [...]}]
Matches products by brand+name and updates the ingredients array.
Also flags silicones, sulfates, drying alcohols, mineral oil, and petrolatum.
"""

import json
import sys
import urllib.request
import urllib.parse

SUPABASE_URL = "https://rqmplfyuonkikdmqngrj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbXBsZnl1b25raWtkbXFuZ3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzAxOTMsImV4cCI6MjA5MjYwNjE5M30.XRKUcxszwbqBo1fXFWMHK58aRWf-r9qWYvczwBQ-0pk"

SILICONES = [
    "dimethicone", "cyclomethicone", "amodimethicone", "trimethicone",
    "phenyl trimethicone", "dimethiconol", "bis-amino propyl dimethicone",
    "pca dimethicone", "cetyl dimethicone", "stearyl dimethicone",
    "cyclohexasiloxane", "cyclopentasiloxane", "cetyl triethylmonium dimethicone",
]
SULFATES = [
    "sodium lauryl sulfate", "sodium laureth sulfate", "ammonium lauryl sulfate",
    "ammonium laureth sulfate", "sodium c14-16 olefin sulfonate",
]
DRYING_ALCOHOLS = [
    "alcohol denat", "sd alcohol", "isopropyl alcohol", "ethanol",
    "alcohol", "propanol",
]
NON_DRYING_ALCOHOLS = [
    "cetyl alcohol", "cetearyl alcohol", "stearyl alcohol", "behenyl alcohol",
    "myristyl alcohol", "lauryl alcohol", "benzyl alcohol",
]
WAXES_OILS = ["mineral oil", "paraffinum liquidum", "petrolatum", "petroleum jelly"]


def flag_ingredients(ingredients):
    """Return a list of flagged ingredient objects."""
    flagged = []
    for ing in ingredients:
        low = ing.lower().strip()
        # Check silicones
        for s in SILICONES:
            if s in low:
                flagged.append({"ingredient": ing, "reason": "silicone"})
                break
        # Check sulfates
        for s in SULFATES:
            if s in low:
                flagged.append({"ingredient": ing, "reason": "sulfate"})
                break
        # Check drying alcohols (exclude non-drying)
        is_non_drying = any(na in low for na in NON_DRYING_ALCOHOLS)
        if not is_non_drying:
            for da in DRYING_ALCOHOLS:
                if da in low and low != da:
                    continue
                if low == da or low.startswith(da + " "):
                    flagged.append({"ingredient": ing, "reason": "drying_alcohol"})
                    break
        # Check mineral oil / petrolatum
        for w in WAXES_OILS:
            if w in low:
                flagged.append({"ingredient": ing, "reason": "mineral_oil_petrolatum"})
                break
    return flagged


def determine_cg_status(flagged):
    """Determine CG status based on flagged ingredients."""
    reasons = {f["reason"] for f in flagged}
    if "sulfate" in reasons or "silicone" in reasons:
        return "not_approved"
    if "drying_alcohol" in reasons or "mineral_oil_petrolatum" in reasons:
        return "caution"
    return "approved"


def supabase_request(method, path, data=None, params=None):
    """Make a request to Supabase REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    if params:
        # Build query string with proper encoding
        parts = []
        for k, v in params.items():
            parts.append(f"{urllib.parse.quote(k)}={urllib.parse.quote(str(v), safe='.,*:()=')}")
        url += "?" + "&".join(parts)
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode() if e.fp else ""
        print(f"  HTTP {e.code}: {err_body}", file=sys.stderr)
        return None


def find_product(brand, name):
    """Find a product by brand and name (case-insensitive partial match)."""
    params = {
        "brand": f"ilike.{brand}",
        "name": f"ilike.*{name}*",
        "select": "id,brand,name,ingredients,cg_status",
    }
    result = supabase_request("GET", "products", params=params)
    if result and len(result) > 0:
        return result[0]
    # Try broader match
    params["name"] = f"ilike.*{name.split()[0]}*"
    result = supabase_request("GET", "products", params=params)
    if result and len(result) > 0:
        return result[0]
    return None


def update_product(product_id, ingredients, flagged, cg_status):
    """Update a product's ingredients and flags."""
    data = {
        "ingredients": ingredients,
        "flagged_ingredients": flagged,
        "cg_status": cg_status,
    }
    params = {"id": f"eq.{product_id}"}
    return supabase_request("PATCH", "products", data=data, params=params)


def escape_sql(s):
    """Escape a string for use in SQL."""
    return s.replace("'", "''")


def generate_sql(product_id, ingredients, flagged, cg_status):
    """Generate SQL UPDATE statement."""
    ing_array = "ARRAY[" + ", ".join(f"'{escape_sql(i)}'" for i in ingredients) + "]"
    flagged_json = json.dumps(flagged).replace("'", "''")
    return (
        f"UPDATE products SET "
        f"ingredients = {ing_array}, "
        f"flagged_ingredients = '{flagged_json}'::jsonb, "
        f"cg_status = '{cg_status}', "
        f"updated_at = now() "
        f"WHERE id = '{product_id}';"
    )


def main():
    raw = sys.stdin.read()
    products = json.loads(raw)

    updated = 0
    skipped = 0
    not_found = 0
    errors = 0
    sql_statements = []

    for item in products:
        brand = item["brand"]
        name = item["name"]
        ingredients = item.get("ingredients")

        if ingredients is None:
            note = item.get("note", "no ingredients")
            print(f"SKIP: {brand} - {name} ({note})")
            skipped += 1
            continue

        print(f"Processing: {brand} - {name} ({len(ingredients)} ingredients)...")

        # Find matching product in DB
        product = find_product(brand, name)
        if not product:
            print(f"  NOT FOUND in database")
            not_found += 1
            continue

        print(f"  Matched: {product['brand']} - {product['name']} (id: {product['id'][:8]}...)")

        # Flag problematic ingredients
        flagged = flag_ingredients(ingredients)
        cg_status = determine_cg_status(flagged)

        if flagged:
            print(f"  Flagged: {', '.join(f['ingredient'] + ' (' + f['reason'] + ')' for f in flagged)}")
        print(f"  CG Status: {cg_status}")

        # Try direct update first
        result = update_product(product["id"], ingredients, flagged, cg_status)
        if result and len(result) > 0:
            print(f"  ✓ Updated successfully via API")
            updated += 1
        else:
            # Generate SQL for manual execution
            sql = generate_sql(product["id"], ingredients, flagged, cg_status)
            sql_statements.append(sql)
            print(f"  → Generated SQL (API update blocked by RLS)")
            updated += 1

    # Write SQL file if any statements were generated
    if sql_statements:
        sql_file = "batch1_update.sql"
        with open(sql_file, "w") as f:
            f.write("-- Batch 1 Ingredient Updates\n")
            f.write("-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/rqmplfyuonkikdmqngrj/sql\n\n")
            f.write("BEGIN;\n\n")
            for sql in sql_statements:
                f.write(sql + "\n\n")
            f.write("COMMIT;\n")
        print(f"\n✏️  SQL file written: {sql_file}")
        print(f"   Run in Supabase SQL Editor to apply updates.")

    print(f"\n{'='*50}")
    print(f"SUMMARY")
    print(f"{'='*50}")
    print(f"Total products:  {len(products)}")
    print(f"Processed:       {updated}")
    print(f"Skipped:         {skipped}")
    print(f"Not in DB:       {not_found}")
    print(f"Errors:          {errors}")


if __name__ == "__main__":
    main()
