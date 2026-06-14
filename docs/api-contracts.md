# CoDNA AI API Contracts

This document serves as the source of truth for the CoDNA AI backend APIs. These contracts ensure the frontend and backend are perfectly aligned as the product scales.

## 1. Analyze Endpoint

**Endpoint:** `GET /analyze/:handle`
**Description:** Fetches a unified JSON payload representing a single user's total intelligence analysis.

```json
{
  "profile": {
    "handle": "tourist",
    "rating": 3428,
    "maxRating": 4009,
    "rank": "legendary grandmaster"
  },
  "summary": {
    "strengthCount": 14,
    "weaknessCount": 12,
    "dominantTopic": "Greedy",
    "solvedProblems": 2500,
    "contestExperience": "Elite"
  },
  "topics": {
    "raw": {
      "dp": 710,
      "graphs": 512
    },
    "top": [
      {
        "name": "Greedy",
        "count": 937
      }
    ]
  },
  "strengths": {
    "elite": [ { "tag": "Greedy", "count": 937 } ],
    "strong": [],
    "developing": [],
    "weak": []
  },
  "dna": {
    "primaryArchetype": "The Algorithmist",
    "secondaryArchetypes": [
      "The Marathon Grinder"
    ],
    "traits": [
      "Sniper",
      "Giant Slayer"
    ]
  },
  "recommendations": [
    {
      "id": "2229I",
      "name": "The Endians",
      "rating": 3400,
      "tags": ["DP", "Trees"],
      "url": "https://codeforces.com/problemset/problem/2229/I"
    }
  ]
}
```

---

## 2. Compare Endpoint

**Endpoint:** `GET /compare/:user1/:user2`
**Description:** Head-to-head comparison between two users determining who dominates each topic.

```json
{
  "winner": "tourist",
  "confidence": 82,
  "score": {
    "tourist": 33,
    "benq": 4
  },
  "categories": {
    "dp": "tourist",
    "graphs": "benq",
    "geometry": "tie"
  },
  "edge": {
    "tourist": [
      "DP",
      "Math",
      "Combinatorics"
    ],
    "benq": [
      "Graphs",
      "Geometry"
    ]
  }
}
```

---

## 3. Benchmark Endpoint (Pending Phase 2.2)

**Endpoint:** `GET /benchmark/:handle`
**Description:** Compares a user's topic counts against the statistical average of their rating bucket (percentile-driven).

```json
{
  "graphs": {
    "user": 358,
    "bucketAverage": 220,
    "median": 190,
    "p90": 340,
    "percentile": 91,
    "status": "Exceptional"
  },
  "dp": {
    "user": 150,
    "bucketAverage": 180,
    "median": 170,
    "p90": 290,
    "percentile": 42,
    "status": "Below Average"
  }
}
```
