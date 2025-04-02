import parse from 'html-react-parser';

function customParser(domNode) {
  // Gérer les liens
  if (domNode.type === 'tag' && domNode.name === 'a') {
    console.log(domNode.attribs.href.indexOf('https://gilberttrausch.uni.lu'))
    if (domNode.attribs.href.indexOf('https://gilberttrausch.uni.lu') === 0) {
      domNode.attribs.class = 'custom-link-class'; // Ajoute une classe personnalisée aux liens
      domNode.attribs.target = '_blank'; // Ouvre les liens dans un nouvel onglet
    }
  }

  // Gérer les titres h2 et h3
  if (domNode.type === 'tag' && (domNode.name === 'h2' || domNode.name === 'h3')) {
    domNode.attribs.class = `custom-${domNode.name}-class`; // Ajoute une classe personnalisée aux h2 et h3
  }

  // Gérer les éléments de texte en gras (b), italique (i) et souligné (u)
  if (domNode.type === 'tag' && ['b', 'i', 'u'].includes(domNode.name)) {
    domNode.attribs.class = `custom-${domNode.name}-class`; // Applique une classe personnalisée selon le style
  }

  // Gérer les citations (blockquote)
  if (domNode.type === 'tag' && domNode.name === 'blockquote') {
    domNode.attribs.class = 'custom-blockquote-class'; // Classe personnalisée pour blockquote
  }

  // Gérer les listes (ordonnées et non ordonnées)
  if (domNode.type === 'tag' && ['ul', 'ol'].includes(domNode.name)) {
    domNode.attribs.class = 'custom-list-class'; // Classe personnalisée pour les listes
  }

  // Gérer les éléments de liste (li)
  if (domNode.type === 'tag' && domNode.name === 'li') {
    domNode.attribs.class = 'custom-li-class'; // Classe personnalisée pour les éléments de liste
  }

  if (domNode.type === 'text') {
    const regex = /\[\[(.*?)\]\]/g;
    if (regex.test(domNode.data)) {
      // Remplacer les occurrences de [[ texte ]] par un <span> avec le logo et le texte en tooltip
      const newText = domNode.data.replace(regex, function(match, p1) {
        // Remplacer [[ texte ]] par un logo avec texte au survol
        return `<span class="tooltip-logo" title="${p1}">
                  <img src="path/to/logo.png" alt="logo" />
                </span>`;
      });

      // Retourner le texte avec les tooltips transformés
      return parse(newText);  // Rendu du HTML transformé
    }
  }


  return domNode; // Retourne les nœuds non modifiés
}

export function formatRichText(htmlContent) {
    if (!htmlContent) return null;

    // Utilisation de html-react-parser avec la fonction personnalisée
    return parse(htmlContent, { replace: customParser });
}

export function formatTypeName(type, locale) {
    if (locale === 'fr') {
        switch (type) {
            case "video":
                return "Vidéo";
            case "image":
                return "Image";    
            case "audio":
                return "Audio";
            case "book":
                return "Livre";
            case "scientific":
                return "Article scientifique";
            case "press":
                return "Presse";
            case "notebook":
                return "Cahier magique";
            case "correspondence":
                return "Correspondance";
            case "handwritten":
                return "Notes manuscrites"
            case "text":
                return "Texte";
            case "other":
                    return "Autre";    
            default:
            return type;
        }
    } else {
        switch (type) {
            case "book":
                return "Buch";
            case "scientific":
                return "Wissenschaftlicher Artikel";
            case "press":
                return "Presse";
            case "notebook":
                return "Magisches Notizbuch";
            case "correspondence":
                return "Korrespondenz";
            case "handwritten":
                return "Handschriftliche Notizen";
            case "other":
                return "Andere";
            default:
                return type;
        }
    }
}

export function formatDate(date, locale = 'fr') {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: '2-digit'
    };

    const locales = {
        fr: 'fr-FR',
        de: 'de-DE'
    };

    return new Date(date).toLocaleDateString(locales[locale] || locales.fr, options);
}

export function formatDateYear(date, locale = 'fr') {
    const options = { 
        year: 'numeric', 
    };

    const locales = {
        fr: 'fr-FR',
        de: 'de-DE'
    };

    return new Date(date).toLocaleDateString(locales[locale] || locales.fr, options);
}

export function getYear(date) {
    const match = date.match(/(\d{4})/g);
    return match ? match.join(" - ") : null;
}

export function romanize(index) {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[index];
};