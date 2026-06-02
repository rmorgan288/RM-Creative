import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { NeatGradient } from '@firecms/neat';
import { useSiteContent } from '../contexts/SiteContentContext';

const neatConfig = {
  colors: [
    { color: '#F50030', enabled: true },
    { color: '#F70010', enabled: true },
    { color: '#AB0006', enabled: true },
    { color: '#FF000D', enabled: true },
    { color: '#251313', enabled: true },
  ],
  speed: 6.5,
  horizontalPressure: 6,
  verticalPressure: 8,
  waveFrequencyX: 3,
  waveFrequencyY: 2,
  waveAmplitude: 6,
  shadows: 10,
  highlights: 8,
  colorBrightness: 1.05,
  colorSaturation: -5,
  wireframe: false,
  colorBlending: 10,
  backgroundColor: '#000000',
  backgroundAlpha: 1,
  grainScale: 0,
  grainSparsity: 0,
  grainIntensity: 0.325,
  grainSpeed: 5.4,
  resolution: 2,
  yOffset: 25132,
  yOffsetWaveMultiplier: 13.1,
  yOffsetColorMultiplier: 5.8,
  yOffsetFlowMultiplier: 6.5,
  flowDistortionA: 1.1,
  flowDistortionB: 5.8,
  flowScale: 2.9,
  flowEase: 0.27,
  flowEnabled: true,
  enableProceduralTexture: false,
  transparentTextureVoid: false,
  textureVoidLikelihood: 0.27,
  textureVoidWidthMin: 60,
  textureVoidWidthMax: 420,
  textureBandDensity: 1.2,
  textureColorBlending: 0.06,
  textureSeed: 333,
  textureEase: 0.22,
  proceduralBackgroundColor: '#0E0707',
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  domainWarpEnabled: true,
  domainWarpIntensity: 0.3,
  domainWarpScale: 1,
  vignetteIntensity: 1,
  vignetteRadius: 0.8,
  fresnelEnabled: true,
  fresnelPower: 1.8,
  fresnelIntensity: 0.1,
  fresnelColor: '#D22525',
  iridescenceEnabled: false,
  iridescenceIntensity: 0.5,
  iridescenceSpeed: 1,
  bloomIntensity: 0,
  bloomThreshold: 0.7,
  chromaticAberration: 3.5,
  shapeType: 'plane',
  shapeRotationX: 0.61,
  shapeRotationY: 0,
  shapeRotationZ: 0,
  shapeAutoRotateSpeedX: 0,
  shapeAutoRotateSpeedY: 0,
  sphereRadius: 15,
  torusRadius: 15,
  torusTube: 5,
  cylinderRadius: 10,
  cylinderHeight: 40,
  planeBend: 0,
  planeTwist: 0,
  silhouetteFade: 0.25,
  cylinderFade: 0.08,
  ribbonFade: 0.05,
  cameraLock: true,
  cameraX: 0,
  cameraY: 0,
  cameraZ: 0,
  cameraRotationX: -0.238,
  cameraRotationY: -0.014,
  cameraRotationZ: 0,
  cameraZoom: 1,
};

const Hero = () => {
  const { hero, brand, clientsList } = useSiteContent();
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let gradient;
    try {
      gradient = new NeatGradient({
        ref: canvasRef.current,
        ...neatConfig,
      });
      gradientRef.current = gradient;
    } catch (e) {
      console.error('NeatGradient init failed', e);
    }

    const handleScroll = () => {
      if (gradientRef.current) {
        gradientRef.current.yOffset = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (gradient && typeof gradient.destroy === 'function') {
        gradient.destroy();
      }
      gradientRef.current = null;
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      {/* Animated NeatGradient WebGL background */}
      <canvas
        ref={canvasRef}
        id="gradient"
        aria-hidden="true"
        data-testid="hero-neat-gradient"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          zIndex: 0,
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.25) 92%, rgba(0,0,0,0) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.25) 92%, rgba(0,0,0,0) 100%)',
        }}
      />
      {/* Dark overlay for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 45%, rgba(10,10,10,0.85) 100%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 2 }}>
        {/* Eyebrow row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
          <span className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#e3494e]" />
            <span className="font-sub text-[11px] text-[#8a8378]">
              {hero.eyebrow}
            </span>
          </span>
          <span className="hidden sm:inline-block w-6 h-px bg-[#3a3a3a]" />
          <span className="inline-flex items-center gap-1.5 font-sub text-[11px] text-[#e3494e]">
            <MapPin className="w-3 h-3" />
            Based in South Wales
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display-xl text-[clamp(3.2rem,10vw,10rem)] text-[#f2ece2]">
          {hero.headlineLines.map((line, i) => (
            <span key={i} className="block">
              {i === hero.headlineLines.length - 1 ? (
                <span className="text-[#e3494e]">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        {/* Sub + meta */}
        <div className="mt-14 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-6 md:col-start-6">
            <p className="text-[17px] md:text-[19px] leading-relaxed text-[#d8d2c6] max-w-xl">
              {hero.subcopy}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo('#contact')}
                className="group inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-14 px-7 text-[14px] tracking-wide transition-colors"
              >
                Book a Consultation
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('#work')}
                className="inline-flex items-center gap-3 text-[14px] tracking-wide text-[#f2ece2] border-b border-[#f2ece2]/40 pb-1 hover:border-[#e3494e] hover:text-[#e3494e] transition-colors"
              >
                See selected work
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 md:mt-32 grid grid-cols-3 gap-6 md:gap-12 border-t border-[#1f1f1f] pt-10">
          {hero.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl md:text-5xl text-[#f2ece2]">{s.value}</div>
              <div className="mt-2 text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-[#8a8378]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client marquee */}
      <div className="mt-24 md:mt-28 border-y border-[#1f1f1f] py-8 overflow-hidden relative" style={{ zIndex: 2 }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378]">
            Selected client experience
          </span>
        </div>
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...clientsList, ...clientsList].map((c, i) => (
            <span
              key={i}
              className="font-display uppercase tracking-[0.12em] text-xl md:text-2xl text-[#5c564c] font-semibold"
            >
              {c}
              <span className="mx-8 text-[#e3494e]">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
