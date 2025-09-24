#!/usr/bin/env python3
"""
Performance benchmark for the optimized Pashto Bible search.

This script tests the search performance with various types of queries
to demonstrate the improvements from the optimization work.
"""

import requests
import json
import time
from typing import List, Dict, Any

# Test queries representing different scenarios
TEST_QUERIES = [
    # Simple common words (should use cache after first run)
    {"query": "خدا", "description": "Common word - should be fast with cache"},
    {"query": "عیسی", "description": "Common religious term"},
    {"query": "لیدل", "description": "Verb - should use optimized variant generation"},
    {"query": "کتاب", "description": "Noun - should use optimized inflection"},
    {"query": "محبت", "description": "Religious concept - should be fast"},

    # More complex queries
    {"query": "خداوند", "description": "Compound word"},
    {"query": "مسیح", "description": "Key religious term"},
    {"query": "نماز", "description": "Religious practice"},

    # Edge cases
    {"query": "ز", "description": "Single letter (should be very fast)"},
    {"query": "چې", "description": "Common particle"},
]

def benchmark_search(query: str, description: str, scope: str = "all", include_related: bool = False) -> Dict[str, Any]:
    """Benchmark a single search query."""
    url = "http://localhost:3000/api/search_phrase"

    payload = {
        "query": query,
        "scope": scope,
        "includeRelated": include_related
    }

    start_time = time.time()
    try:
        response = requests.post(url, json=payload, timeout=10)
        end_time = time.time()

        if response.status_code == 200:
            data = response.json()
            return {
                "query": query,
                "description": description,
                "success": True,
                "duration_ms": round((end_time - start_time) * 1000, 2),
                "results_count": len(data.get("results", [])),
                "search_type": data.get("processed", {}).get("searchType", "unknown"),
                "variants_count": len(data.get("processed", {}).get("variants", [])),
            }
        else:
            return {
                "query": query,
                "description": description,
                "success": False,
                "duration_ms": round((end_time - start_time) * 1000, 2),
                "error": f"HTTP {response.status_code}",
            }
    except requests.RequestException as e:
        end_time = time.time()
        return {
            "query": query,
            "description": description,
            "success": False,
            "duration_ms": round((end_time - start_time) * 1000, 2),
            "error": str(e),
        }

def run_benchmark(test_queries: List[Dict], rounds: int = 3) -> None:
    """Run performance benchmark with multiple rounds."""
    print("🚀 Pashto Bible Search Performance Benchmark")
    print("=" * 60)
    print(f"Testing {len(test_queries)} queries with {rounds} rounds each")
    print()

    all_results = []

    for round_num in range(1, rounds + 1):
        print(f"🔄 Round {round_num}/{rounds}")
        print("-" * 30)

        round_results = []

        for i, test_case in enumerate(test_queries, 1):
            print(f"[{i}/{len(test_queries)}] Testing: {test_case['description']}...")

            result = benchmark_search(test_case["query"], test_case["description"])
            round_results.append(result)

            if result["success"]:
                print(f"  ✅ {result['duration_ms']}ms, {result['results_count']} results, type: {result['search_type']}")
            else:
                print(f"  ❌ Failed: {result.get('error', 'Unknown error')}")

        all_results.append(round_results)
        print()

    # Analyze results
    print("📊 Performance Summary")
    print("=" * 60)

    successful_results = []
    for round_results in all_results:
        for result in round_results:
            if result["success"]:
                successful_results.append(result)

    if successful_results:
        avg_duration = sum(r["duration_ms"] for r in successful_results) / len(successful_results)
        max_duration = max(r["duration_ms"] for r in successful_results)
        min_duration = min(r["duration_ms"] for r in successful_results)

        print(f"✅ Average response time: {avg_duration".2f"}ms")
        print(f"🚀 Fastest response: {min_duration".2f"}ms")
        print(f"🐌 Slowest response: {max_duration".2f"}ms")
        print(f"📈 Success rate: {len(successful_results)}/{len([r for round_results in all_results for r in round_results])}")

        # Show breakdown by search type
        print()
        print("🔍 Search Type Breakdown:")
        search_types = {}
        for result in successful_results:
            search_type = result["search_type"]
            search_types[search_type] = search_types.get(search_type, 0) + 1

        for search_type, count in search_types.items():
            percentage = (count / len(successful_results)) * 100
            print(f"  • {search_type}: {count} searches ({percentage".1f"}%)")

    # Show individual results
    print()
    print("📋 Detailed Results:")
    print("-" * 80)
    for i, result in enumerate(successful_results, 1):
        print(f"{i"2d"}. {result['description']"<30"} {result['duration_ms']"6.2f"}ms {result['results_count']"4d"} results ({result['search_type']})")

if __name__ == "__main__":
    run_benchmark(TEST_QUERIES, rounds=2)


