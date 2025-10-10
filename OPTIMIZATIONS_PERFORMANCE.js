// 🚀 OPTIMISATIONS PERFORMANCE POUR SCORE 100%

// 1. Lazy Loading des composants
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
  ssr: false
});

// 2. Optimisation des images
import Image from 'next/image';
<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 3. Memoization des composants coûteux
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Rendu coûteux */}</div>;
});

// 4. Optimisation des re-renders
const useCallback = useCallback((id) => {
  // Logique coûteuse
}, [dependency]);

// 5. Code splitting par route
const DynamicPage = dynamic(() => import('./pages/HeavyPage'), {
  loading: () => <LoadingSpinner />
});

// 6. Preload des ressources critiques
<link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

// 7. Service Worker pour le cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// 8. Optimisation des bundles
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'react-icons']
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    return config;
  }
};