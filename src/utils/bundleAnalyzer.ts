// Bundle analysis utilities
const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === "development") {
    const modules = (window as any).__webpack_require__?.cache;
    if (modules) {
      const moduleSizes = Object.values(modules).map((module: any) => ({
        id: module.id,
        size: module.size || 0,
        name: module.id?.split("/").pop() || "Unknown",
      }));

      const totalSize = moduleSizes.reduce(
        (sum, module) => sum + module.size,
        0
      );
      const largestModules = moduleSizes
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);

      console.group("📦 Bundle Analysis");
      console.log("Total Size:", formatBytes(totalSize));
      console.log("Module Count:", moduleSizes.length);
      console.log("Largest Modules:", largestModules);
      console.groupEnd();

      return {
        totalSize,
        moduleCount: moduleSizes.length,
        largestModules,
      };
    }
  }
  return null;
};

// Format bytes to human readable format
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Analyze chunk sizes
const analyzeChunkSizes = () => {
  if (process.env.NODE_ENV === "development") {
    const chunks = (window as any).__webpack_require__?.cache;
    if (chunks) {
      const chunkSizes = Object.entries(chunks).map(
        ([id, chunk]: [string, any]) => ({
          id,
          size: chunk.size || 0,
          name: id.split("/").pop() || "Unknown",
        })
      );

      const totalSize = chunkSizes.reduce((sum, chunk) => sum + chunk.size, 0);
      const largestChunks = chunkSizes
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);

      console.group("📦 Chunk Analysis");
      console.log("Total Size:", formatBytes(totalSize));
      console.log("Chunk Count:", chunkSizes.length);
      console.log("Largest Chunks:", largestChunks);
      console.groupEnd();

      return {
        totalSize,
        chunkCount: chunkSizes.length,
        largestChunks,
      };
    }
  }
  return null;
};

// Analyze dependencies
const analyzeDependencies = () => {
  if (process.env.NODE_ENV === "development") {
    const modules = (window as any).__webpack_require__?.cache;
    if (modules) {
      const dependencies = new Map<string, number>();

      Object.values(modules).forEach((module: any) => {
        if (module.dependencies) {
          Object.values(module.dependencies).forEach((dep: any) => {
            const depName = dep.module?.id || "Unknown";
            dependencies.set(depName, (dependencies.get(depName) || 0) + 1);
          });
        }
      });

      const sortedDeps = Array.from(dependencies.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      console.group("📦 Dependency Analysis");
      console.log("Most Used Dependencies:", sortedDeps);
      console.groupEnd();

      return sortedDeps;
    }
  }
  return null;
};

// Performance budget checker
const checkPerformanceBudget = () => {
  const budgets = {
    bundleSize: 500 * 1024, // 500KB
    chunkSize: 200 * 1024, // 200KB
    moduleCount: 1000,
  };

  const analysis = analyzeBundleSize();
  if (!analysis) return null;

  const violations = [];

  if (analysis.totalSize > budgets.bundleSize) {
    violations.push({
      type: "bundleSize",
      current: analysis.totalSize,
      budget: budgets.bundleSize,
      message: `Bundle size ${formatBytes(
        analysis.totalSize
      )} exceeds budget ${formatBytes(budgets.bundleSize)}`,
    });
  }

  if (analysis.moduleCount > budgets.moduleCount) {
    violations.push({
      type: "moduleCount",
      current: analysis.moduleCount,
      budget: budgets.moduleCount,
      message: `Module count ${analysis.moduleCount} exceeds budget ${budgets.moduleCount}`,
    });
  }

  if (violations.length > 0) {
    console.group("⚠️ Performance Budget Violations");
    violations.forEach((violation) => {
      console.warn(violation.message);
    });
    console.groupEnd();
  }

  return {
    violations,
    withinBudget: violations.length === 0,
  };
};

// Tree shaking analysis
const analyzeTreeShaking = () => {
  if (process.env.NODE_ENV === "development") {
    const modules = (window as any).__webpack_require__?.cache;
    if (modules) {
      const unusedExports = [];

      Object.values(modules).forEach((module: any) => {
        if (module.exports && typeof module.exports === "object") {
          const exports = Object.keys(module.exports);
          const usedExports = [];

          // Check if exports are used
          exports.forEach((exportName) => {
            const isUsed = Object.values(modules).some((otherModule: any) => {
              if (otherModule.dependencies) {
                return Object.values(otherModule.dependencies).some(
                  (dep: any) => {
                    return (
                      dep.module === module &&
                      dep.importedNames?.includes(exportName)
                    );
                  }
                );
              }
              return false;
            });

            if (!isUsed) {
              unusedExports.push({
                module: module.id,
                export: exportName,
              });
            }
          });
        }
      });

      if (unusedExports.length > 0) {
        console.group("🌳 Tree Shaking Analysis");
        console.log("Unused Exports:", unusedExports);
        console.groupEnd();
      }

      return unusedExports;
    }
  }
  return [];
};

// Export all utilities
export {
  analyzeBundleSize,
  analyzeChunkSizes,
  analyzeDependencies,
  analyzeTreeShaking,
  checkPerformanceBudget,
  formatBytes,
};
