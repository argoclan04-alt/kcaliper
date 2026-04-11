"use client"

import type React from "react"
import { Warp } from "@paper-design/shaders-react"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

const features: Feature[] = [
  {
    title: "Subiste 0.5kg y entraste en pánico.",
    description:
      "Fue solo agua. Pero nadie te lo explicó y cambiaste toda tu dieta por nada.",
    icon: (
      <span className="text-4xl">😰</span>
    ),
  },
  {
    title: "Tu peso sube y baja sin sentido.",
    description: "Sin un análisis matemático real, no sabes si estás ganando grasa o solo reteniendo líquidos.",
    icon: (
      <span className="text-4xl">🤷</span>
    ),
  },
  {
    title: "Te rindes porque 'no funciona'.",
    description: "Sin retroalimentación objetiva, abandonas dietas que SÍ estaban funcionando.",
    icon: (
      <span className="text-4xl">😞</span>
    ),
  },
]

export function FeaturesCards() {
  const getShaderConfig = (index: number) => {
    const configs = [
      {
        proportion: 0.3,
        softness: 0.8,
        distortion: 0.15,
        swirl: 0.6,
        swirlIterations: 8,
        shape: "checks" as const,
        shapeScale: 0.08,
        colors: ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"],
      },
      {
        proportion: 0.4,
        softness: 1.2,
        distortion: 0.2,
        swirl: 0.9,
        swirlIterations: 12,
        shape: "dots" as const,
        shapeScale: 0.12,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
      {
        proportion: 0.35,
        softness: 0.9,
        distortion: 0.18,
        swirl: 0.7,
        swirlIterations: 10,
        shape: "checks" as const,
        shapeScale: 0.1,
        colors: ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"],
      },
    ]
    return configs[index % configs.length]
  }

  return (
    <section className="py-20 px-4 bg-black border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">¿Te ha pasado esto? No estás solo.</h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Entendemos la frustración de no saber si tu dieta funciona. Es hora de dejar atrás la incertidumbre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const shaderConfig = getShaderConfig(index)
            return (
              <div key={index} className="relative min-h-[420px] group">
                <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                  <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={shaderConfig.proportion}
                    softness={shaderConfig.softness}
                    distortion={shaderConfig.distortion}
                    swirl={shaderConfig.swirl}
                    swirlIterations={shaderConfig.swirlIterations}
                    shape={shaderConfig.shape}
                    shapeScale={shaderConfig.shapeScale}
                    scale={1}
                    rotation={0}
                    speed={0.8}
                    colors={shaderConfig.colors}
                  />
                </div>

                <div className="relative z-10 p-8 rounded-3xl h-full flex flex-col items-center text-center bg-black/60 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-colors">
                  <div className="mb-6 filter drop-shadow-lg scale-110">{feature.icon}</div>

                  <h3 className="text-2xl font-bold mb-4 text-white leading-tight">{feature.title}</h3>

                  <p className="leading-relaxed text-gray-200 font-medium">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
