import React from 'react';
import { ArrowRight, Building2, CheckCircle2, FileCheck, Lock, MapPin, ShieldCheck } from 'lucide-react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../constants';
import { ScrollReveal } from './animations/ScrollReveal';

interface WelcomeScreenProps {
  onExplore: () => void;
  onGoToPro: () => void;
  currentCountry: CountryCode;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExplore, onGoToPro, currentCountry }) => {
  const country = COUNTRIES[currentCountry];

  return (
    <div className="bg-stone-50 text-slate-900">
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-[#102a43]">
        <img
          src="/src/assets/images/lumina_hero_1780162841140.png"
          alt="Maison contemporaine"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102a43] via-[#102a43]/90 to-[#102a43]/25" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.32em] text-[#d9b77a]">
              Cabinet immobilier · {country.name}
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
              L’immobilier,<br /><span className="text-[#d9b77a]">avec justesse.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-200">
              Nous vous accompagnons dans la vente, la location et la gestion de biens sélectionnés avec exigence au Bénin et en France.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button onClick={onExplore} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-[#c49a5a] px-7 font-bold text-white transition-colors hover:bg-[#d9b77a]">
                Découvrir nos biens <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={onGoToPro} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-white/35 px-7 font-bold text-white transition-colors hover:bg-white/10">
                Espace professionnel
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-stone-200 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            { icon: ShieldCheck, title: 'Un cadre sécurisé', text: 'Des transactions suivies et documentées.' },
            { icon: FileCheck, title: 'Une expertise locale', text: 'Une connaissance précise de chaque marché.' },
            { icon: CheckCircle2, title: 'Un suivi attentif', text: 'Un interlocuteur dédié à chaque étape.' }
          ].map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal key={title} delay={index * 80} className="flex items-start gap-4 px-0 py-8 sm:px-8">
              <Icon className="mt-1 h-5 w-5 shrink-0 text-[#b48642]" />
              <div><h2 className="font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p></div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b48642]">Notre approche</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#102a43] md:text-5xl">Des décisions sereines pour des projets durables.</h2>
            <p className="mt-6 leading-relaxed text-slate-600">Lumina Immo met la clarté, la confiance et la qualité de la relation au cœur de chaque projet immobilier.</p>
            <button onClick={onExplore} className="mt-8 inline-flex items-center gap-2 font-bold text-[#102a43] hover:text-[#b48642]">Voir les opportunités <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-[#102a43] p-8 text-white sm:translate-y-8"><Building2 className="h-7 w-7 text-[#d9b77a]" /><h3 className="mt-14 text-2xl font-semibold">Résidentiel</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">Maisons, appartements et villas choisis pour leur emplacement et leur qualité.</p></div>
            <div className="border border-stone-200 bg-white p-8"><MapPin className="h-7 w-7 text-[#b48642]" /><h3 className="mt-14 text-2xl font-semibold text-[#102a43]">Deux marchés</h3><p className="mt-3 text-sm leading-relaxed text-slate-500">Une présence au Bénin et en France pour accompagner vos projets où qu’ils commencent.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};
