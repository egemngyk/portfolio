function scriptYukle(src, isModule = false) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    if (isModule) {
      script.type = "module";
    }
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

scriptYukle("/shared/api.js", true)
  .then(() => scriptYukle("/shared/main.js", true))
  .then(() => window.portfolioPromise)
  .then(() => scriptYukle("/shared/stats.js", true))
  .then(() => scriptYukle("../js/main/render.js", true))
  .then(() => {
    if (!window.API) throw new Error("API Missing");
  });
