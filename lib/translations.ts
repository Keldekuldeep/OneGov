// Translations for OneGov Portal
// Currently supporting: English and Hindi
// Other languages coming soon

export const translations = {
  en: {
    hero: {
      badge: 'Digital India Initiative',
      title: 'Welcome to OneGov Portal',
      subtitle: 'Empowering citizens through seamless digital governance and accessible public services',
      viewServices: 'View Services',
      fileComplaint: 'File Complaint',
      officerPortal: 'Officer Portal',
      adminPortal: 'Admin Portal',
    },
  },
  hi: {
    hero: {
      badge: 'डिजिटल इंडिया पहल',
      title: 'OneGov पोर्टल में आपका स्वागत है',
      subtitle: 'सहज डिजिटल शासन और सुलभ सार्वजनिक सेवाओं के माध्यम से नागरिकों को सशक्त बनाना',
      viewServices: 'सेवाएं देखें',
      fileComplaint: 'शिकायत दर्ज करें',
      officerPortal: 'अधिकारी पोर्टल',
      adminPortal: 'प्रशासक पोर्टल',
    },
  },
}

export type Language = keyof typeof translations

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}
