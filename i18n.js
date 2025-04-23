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
					"close": "Fermer",
					'start': "Débuter",
					'change_chapter': "Changer de chapitre",
					"filters": "Filtres",
					"bio_description": "<p>L’historien Gilbert Trausch (1931-2018) est encore largement connu du public luxembourgeois. Pendant des décennies, ses incontournables interventions dans les médias ont contribué à faire découvrir l’histoire du Luxembourg à toute une génération.</p><p>Ce n’est pourtant là qu’une des nombreuses facettes d’un historien prolifique de la seconde moitié du XXe siècle qui, en plus d’avoir renouvelé le paysage historiographique luxembourgeois, bénéficiait aussi d’une renommée solide en dehors des frontières du Grand-Duché.</p><p>Formateur de toute une génération d’historiens, tour à tour directeur de la Bibliothèque nationale, du Centre Universitaire de Luxembourg (CUL – ancêtre de l’Université du Luxembourg) et du Centre d'études et de recherches européennes Robert Schuman (CERE), fréquentant les cercles ministériels et diplomatiques, Gilbert Trausch était une personnalité omniprésente de la société luxembourgeoise.</p>",
					"load_more": "Charger plus",
					"tablet_message": "Veuillez tourner votre tablette en mode paysage pour continuer."
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
					"close": "Schließen",
					"start": "Starten",
					'change_chapter': "Kapitel wechseln",
					"filters": "Filter",
					"bio_description": "<p>Der Historiker Gilbert Trausch (1931-2018) ist der luxemburgischen Öffentlichkeit noch weitgehend bekannt. Jahrzehntelang trugen seine wichtigen Auftritte in den Medien dazu bei, dass eine ganze Generation die Geschichte Luxemburgs kennenlernte.</p><p>Dies ist nur eine der vielen Facetten eines fruchtbaren Historikers der zweiten Hälfte des 20. Jahrhunderts, der nicht nur die historiografische Landschaft Luxemburgs erneuerte, sondern auch außerhalb der Grenzen des Großherzogtums einen soliden Ruf genoss.</p><p>Als Ausbilder einer ganzen Generation von Historikern, Direktor der Nationalbibliothek, des Centre Universitaire de Luxembourg (CUL - Vorläufer der Universität Luxemburg) und des Centre d'Études et de Recherches Européennes Robert Schuman (CERE), der in ministeriellen und diplomatischen Kreisen verkehrte, war Gilbert Trausch eine allgegenwärtige Persönlichkeit in der luxemburgischen Gesellschaft.</p>",
					"load_more": "Mehr laden",
					"tablet_message": "Bitte drehen Sie Ihr Tablet in den Querformatmodus, um fortzufahren."
				}
			}
		}
	})

export default i18n