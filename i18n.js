import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const normalizeLanguageCode = (lang) => {
  if (lang.includes('_')) {
    return lang.split('_')[0];  // Split to get 'fr' from 'fr_FR'
  }
  return lang;
};

i18n
	.use(initReactI18next)
	.init({
		lng: normalizeLanguageCode('fr_FR'),  // Normalize to just 'fr' for 'fr_FR'
		fallbackLng: 'fr',  // Same for fallbackLng
		load: 'languageOnly',  // Only load the language part (e.g., fr instead of fr_FR)
		interpolation: { escapeValue: false },
		resources: {
			fr: {
				translation: {
					"link_virtual_tour": "Accéder à l'exploration virtuelle",
					"professions": "Les métiers de l'historien",
					"magicNotebooks": "Cahiers magiques",
					"description_magicNotebooks": "Pour prendre des notes, Gilbert Trausch a, dès ses études universitaires, adopté une méthode bien à lui : il utilise des feuilles volantes classées dans des classeurs à anneaux de format A5 qu’il appelle ses Zauberhefte ou ses «cahiers magiques».",
					"biography": "Biographie",
					"house": "La maison-bibliothèque",
					"resources": "Ressources",
					"no_resources": "Aucune ressource ne correspond à votre recherche",
					"media_types": "Types de média",
					"period": "Période",
					"search": "Rechercher",
					"tour": "Visite virtuelle",
					"about":"A propos",
					"conditions": "Conditions d'utilisation",
					"close": "Fermer"
				}
			},
			de: {
				translation: {
					"link_virtual_tour": "Zugang zur virtuellen Erkundung",
					"professions": "Die Berufe des Historikers",
					"magicNotebooks": "Zauberhefte",
					"description_magicNotebooks": "Um Notizen zu machen, hat Gilbert Trausch seit seinem Universitätsstudium eine ganz eigene Methode: Er verwendet lose Blätter, die in A5-Ringordnern abgeheftet sind, die er seine Zauberhefte oder „magischen Hefte“ nennt.",
					"biography": "Biografie",
					"house": "Das Bibliothekshaus",
					"resources": "Ressourcen",
					"no_resources": "Keine Ressource entspricht Ihrer Suche",
					"media_types": "Medientypen",
					"period": "Zeitraum",
					"search": "Suche",
					"tour": "Virtuelle Tour",
					"about":"Über",
					"conditions": "Bedingungen für die Nutzung",
					"close": "Schließen"





				}
			}
		}
	})

export default i18n