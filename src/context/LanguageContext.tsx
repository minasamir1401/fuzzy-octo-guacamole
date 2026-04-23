"use client";
import { API_URL } from "@/config/api";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ru" | "de";

interface Translations {
  [key: string]: {
    en: string;
    ru: string;
    de: string;
  };
}

export const translations: Translations = {
  // Navbar
  "nav.home": { en: "Home", ru: "Главная", de: "Startseite" },
  "nav.diving": { en: "Diving", ru: "Дайвинг", de: "Tauchen" },
  "nav.packages": { en: "Packages", ru: "Пакеты", de: "Pakete" },
  "nav.gallery": { en: "Gallery", ru: "Галерея", de: "Galerie" },
  "nav.about": { en: "About", ru: "О нас", de: "Über uns" },
  "nav.contact": { en: "Contact", ru: "Контакты", de: "Kontakt" },
  "nav.bookNow": { en: "Book Now", ru: "Забронировать", de: "Jetzt buchen" },

  // Hero
  "hero.badge": { en: "Elite Private Instruction in Hurghada", ru: "Элитное обучение дайвингу в Хургаде", de: "Elite-Privatunterricht in Hurghada" },
  "hero.title1": { en: "Master the Deep with", ru: "Покоряйте глубины с", de: "Meistern Sie die Tiefe mit" },
  "hero.title2": { en: "Professional Guidance", ru: "профессионалом", de: "profi-führung" },
  "hero.desc": { en: "Unlock the secrets of the Red Sea with personalized, professional diving expeditions in Hurghada.", ru: "Раскройте секреты Красного моря с помощью персональных профессиональных дайвинг-экспедиций в Хургаде.", de: "Entdecken Sie die Geheimnisse des Roten Meeres bei persönlichen, professionellen Tauchexpeditionen in Hurghada." },
  "hero.cta1": { en: "Book Your Instructor", ru: "Записаться к инструктору", de: "Instruktor buchen" },
  "hero.cta2": { en: "View Dive Sites", ru: "Места для дайвинга", de: "Tauchplätze ansehen" },

  // Homepage
  "featured.title": { en: "Professional Hurghada Expeditions", ru: "Профессиональные экспедиции в Хургаде", de: "Professionelle Hurghada-Expeditionen" },
  "featured.desc": { en: "Tailored diving experiences in the heart of Hurghada.", ru: "Индивидуальный дайвинг в самом сердце Хургады.", de: "Maßgeschneiderte Taucherlebnisse im Herzen von Hurghada." },
  "why.badge": { en: "Why Choose Our Instruction", ru: "Почему выбирают наше обучение", de: "Warum unseren Unterricht wählen" },
  "why.title1": { en: "Personalized", ru: "Персонализированное", de: "Personalisiertes" },
  "why.title2": { en: "Mastery", ru: "Мастерство", de: "Können" },
  "why.desc": { en: "We specialize in high-end, private diving instruction in Hurghada.", ru: "Мы специализируемся на высококлассном частном обучении дайвингу в Хургаде.", de: "Wir sind auf hochwertige, private Tauchausbildung in Hurghada spezialisiert." },
  "cta.title": { en: "Ready to Dive into the Extraordinary?", ru: "Готовы погрузиться в необычайное?", de: "Bereit, in das Außergewöhnliche einzutauchen?" },
  "cta.desc": { en: "Spaces are limited for our exclusive luxury expeditions.", ru: "Количество мест ограничено для наших эксклюзивных роскошных экспедиций.", de: "Die Plätze für unsere exklusiven Luxusexpeditionen sind begrenzt." },
  "cta.btn1": { en: "Book My Experience", ru: "Забронировать", de: "Mein Erlebnis buchen" },
  "cta.btn2": { en: "Contact Concierge", ru: "Связаться с нами", de: "Concierge kontaktieren" },

  // Diving Page
  "diving.hero.badge": { en: "Professional Instructor in Hurghada", ru: "Профессиональный инструктор в Хургаде", de: "Professioneller Instruktor in Hurghada" },
  "diving.hero.title1": { en: "Elite Diving", ru: "Элитный", de: "Elite" },
  "diving.hero.title2": { en: "Experiences", ru: "Дайвинг", de: "Taucherlebnisse" },
  "diving.hero.desc": { en: "Join Hurghada's top professional instructor for personalized diving sessions.", ru: "Присоединяйтесь к лучшему профессиональному инструктору Хургады для индивидуальных занятий дайвингом.", de: "Begleiten Sie Hurghadas besten professionellen Tauchlehrer für persönliche Tauchstunden." },
  "diving.filter": { en: "Filter By Level", ru: "Фильтр по уровню", de: "Nach Level filtern" },
  "diving.book": { en: "Book Now", ru: "Забронировать", de: "Jetzt buchen" },

  // About Page
  "about.story.badge": { en: "Hurghada's Elite Instructor", ru: "Элитный инструктор Хургады", de: "Hurghadas Elite-Instruktor" },
  "about.story.title1": { en: "Mastering the", ru: "Покорение", de: "Meisterung des" },
  "about.story.title2": { en: "Red Sea", ru: "Красного моря", de: "Roten Meeres" },
  "about.story.p1": { en: "Founded by Capt. Omar, a PADI Platinum Course Director.", ru: "Основано капитаном Омаром, платиновым директором курсов PADI.", de: "Gegründet von Capt. Omar, einem PADI Platinum Course Director." },
  "about.stats.exp": { en: "Years Exp", ru: "Лет опыта", de: "Jahre Erf." },
  "about.stats.students": { en: "Students", ru: "Студентов", de: "Schüler" },
  "about.stats.safety": { en: "Safety Rate", ru: "Безопасность", de: "Sicherheitsrate" },

  // Packages Page
  "packages.hero.badge": { en: "Exclusive Tiers", ru: "Эксклюзивные уровни", de: "Exklusive Stufen" },
  "packages.hero.title1": { en: "Tailored", ru: "Индивидуальное", de: "Maßgeschneiderte" },
  "packages.hero.title2": { en: "Excellence", ru: "Совершенство", de: "Exzellenz" },
  "packages.hero.desc": { en: "Choose the level of immersion and luxury that suits your journey.", ru: "Выберите уровень погружения и роскоши, который подходит именно вам.", de: "Wählen Sie das Niveau an Immersion und Luxus, das zu Ihrer Reise passt." },

  // Gallery Page
  "gallery.hero.badge": { en: "Visual Journey", ru: "Визуальное путешествие", de: "Visuelle Reise" },
  "gallery.hero.title1": { en: "Captured", ru: "Запечатленные", de: "Eingefangene" },
  "gallery.hero.title2": { en: "Moments", ru: "Моменты", de: "Momente" },
  "gallery.hero.desc": { en: "A curated collection of life beneath the surface in Hurghada.", ru: "Кураторская коллекция жизни под водой в Хургаде.", de: "Eine kuratierte Sammlung des Lebens unter der Oberfläche in Hurghada." },

  // Contact Page
  "contact.hero.badge": { en: "Get In Touch", ru: "Связаться с нами", de: "Kontakt aufnehmen" },
  "contact.hero.title1": { en: "Connect With Your", ru: "Свяжитесь с вашим", de: "Verbinden Sie sich mit Ihrem" },
  "contact.hero.title2": { en: "Instructor", ru: "Инструктором", de: "Instruktor" },
  "contact.form.name": { en: "Full Name", ru: "Полное имя", de: "Vollständiger Name" },
  "contact.form.email": { en: "Email Address", ru: "Email адрес", de: "E-Mail-Adresse" },
  "contact.form.message": { en: "Message", ru: "Сообщение", de: "Nachricht" },
  "contact.form.send": { en: "Send Inquiry", ru: "Отправить запрос", de: "Anfrage senden" },

  // Footer
  "footer.desc": { en: "Professional diving instruction in the heart of Hurghada. Join Capt. Omar for an elite underwater journey.", ru: "Профессиональное обучение дайвингу в самом сердце Хургады. Присоединяйтесь к капитану Омару.", de: "Professionelle Tauchausbildung im Herzen von Hurghada. Begleiten Sie Capt. Omar auf einer Elite-Unterwasserreise." },
  "footer.links": { en: "Quick Links", ru: "Быстрые ссылки", de: "Schnelllinks" },
  "footer.newsletter": { en: "Newsletter", ru: "Рассылка", de: "Newsletter" },
  "footer.subscribe": { en: "Subscribe", ru: "Подписаться", de: "Abonnieren" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
