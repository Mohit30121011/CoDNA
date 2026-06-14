const BenchmarkService = require('../src/services/benchmark.service');

async function test() {
    try {
        console.log("Testing Benchmark Engine...");
        
        console.log("\n--- Benchmarking raja1999 (rating ~ 1400) ---");
        const res1 = await BenchmarkService.getBenchmark("raja1999");
        console.log("Graphs stats:", res1["graphs"]);
        console.log("DP stats:", res1["dp"]);

        console.log("\n--- Benchmarking tourist (rating ~ 3400) ---");
        const res2 = await BenchmarkService.getBenchmark("tourist");
        console.log("Graphs stats:", res2["graphs"]);
        console.log("DP stats:", res2["dp"]);

    } catch (err) {
        console.error(err);
    }
}

test();
