'use client'
import { Button } from './button'
import { ArrowRight, Mail, Menu, SendHorizonal, X, Activity } from 'lucide-react'
import { useState } from 'react'
import { cn } from './utils'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
]

export function HeroSection({ onSignupClick, onNavigate }: { onSignupClick?: () => void, onNavigate?: (page: string) => void }) {
    const [menuState, setMenuState] = useState(false)
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="group fixed z-50 w-full border-b border-dashed border-gray-200 dark:border-zinc-800 bg-white/80 backdrop-blur-md md:relative dark:bg-zinc-950/50">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate?.('')}>
                                    <Logo />
                                </div>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 dark:text-white" />
                                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 dark:text-white" />
                                </button>
                            </div>

                            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent dark:border-zinc-800">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <button
                                                    onClick={() => { setMenuState(false); }}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150 text-sm font-medium">
                                                    <span>{item.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6 lg:border-gray-200 dark:lg:border-zinc-800">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onNavigate?.('login')}
                                        className="dark:text-white"
                                    >
                                        <span>Login</span>
                                    </Button>

                                    <Button
                                        size="sm"
                                        onClick={onSignupClick}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                                    >
                                        <span>Get Started</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <section className="overflow-hidden">
                    <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-20">
                        <div className="lg:flex lg:items-center lg:gap-12">
                            <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <div className="rounded-full mx-auto flex w-fit items-center gap-2 border border-gray-200 dark:border-zinc-800 p-1 pr-3 lg:ml-0 bg-gray-50/50 dark:bg-zinc-900/50">
                                    <span className="bg-indigo-600 text-white rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">New</span>
                                    <span className="text-xs font-medium dark:text-zinc-400">Análisis DEMA Inteligente</span>
                                    <span className="bg-gray-200 dark:bg-zinc-800 block h-4 w-px"></span>
                                    <ArrowRight className="size-3 text-zinc-400" />
                                </div>

                                <h1 className="mt-10 text-balance text-4xl font-extrabold md:text-5xl xl:text-6xl text-zinc-900 dark:text-white tracking-tight">
                                    Nunca más estarás <span className="text-indigo-600 dark:text-indigo-400">solo en tu transformación.</span>
                                </h1>
                                <p className="mt-8 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Kcaliper AI te explica cada cambio de peso, te dice si realmente estás progresando, y te acompaña como un coach objetivo 24/7. Sin pánico. Sin adivinar. Solo ciencia.
                                </p>

                                <div>
                                    <div className="mx-auto my-10 max-w-sm lg:my-12 lg:ml-0 lg:mr-auto">
                                        <div className="bg-white dark:bg-zinc-900 has-[input:focus]:ring-indigo-500/20 relative grid grid-cols-[1fr_auto] items-center rounded-2xl border border-gray-200 dark:border-zinc-800 pr-1.5 shadow-sm has-[input:focus]:ring-4 transition-all">
                                            <Mail className="text-zinc-400 pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                                            <input
                                                placeholder="Tu dirección de email"
                                                className="h-14 w-full bg-transparent pl-12 focus:outline-none text-zinc-900 dark:text-white text-sm"
                                                type="email"
                                            />

                                            <div className="md:pr-1.5 lg:pr-0">
                                                <Button
                                                    aria-label="submit"
                                                    onClick={onSignupClick}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-11 h font-bold shadow-lg shadow-indigo-500/20"
                                                >
                                                    <span className="hidden md:block">Unirme Ahora</span>
                                                    <SendHorizonal
                                                        className="relative mx-auto size-5 md:hidden"
                                                        strokeWidth={2}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-medium text-zinc-500 dark:text-zinc-500">
                                        <li className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-indigo-500"/> Faster Analysis
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-indigo-500"/> Modern AI Engine
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-indigo-500"/> 100% Objective
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 -mx-4 rounded-3xl p-3 lg:col-span-3 w-1/2 hidden lg:block overflow-hidden">
                            <div aria-hidden className="absolute z-[1] inset-0 bg-gradient-to-r from-white dark:from-zinc-950 from-10% to-transparent" />
                            <div className="relative h-full">
                                <img
                                    className="hidden dark:block w-full h-full object-cover rounded-3xl opacity-80"
                                    src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
                                    alt="app illustration"
                                />
                                <img
                                    className="dark:hidden w-full h-full object-cover rounded-3xl"
                                    src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
                                    alt="app illustration"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">kCaliper<span className="text-indigo-600">.ai</span></span>
        </div>
    )
}
