import parse from 'html-react-parser';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import VirtualTourLink from '../components/content/VirtualTourLink';

function customParser(domNode) {
    // Gérer les liens
    if (domNode.type === 'tag' && domNode.name === 'a') {
        if (domNode.attribs.href.indexOf('/virtual-tour/') === 0) {
            return <VirtualTourLink domNode={domNode} />;
        }
        if (domNode.attribs.href.indexOf('https://gilberttrausch.uni.lu') === 0) {
            domNode.attribs.class = 'custom-link-class'; // Ajoute une classe personnalisée aux liens
            domNode.attribs.target = '_blank'; // Ouvre les liens dans un nouvel onglet
        }
    }

    if (domNode.type === 'text') {
        console.log(domNode.data)
        const regex = /\[\[\s?(.*?)\s?\]\]/g;
        
        if (regex.test(domNode.data)) {
            console.log('ici')
        const newText = domNode.data.replace(regex, function(match, p1) {
            return `<span class="tooltip-logo" title="${p1}">
                    <img src="/path/to/logo.png" alt="logo" />
                    </span>`;
        });
            return parse(newText);
        }
    }

  return domNode;
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
    if (date) {

        const match = date.match(/(\d{4})/g);
        return match ? match.join(" - ") : null;
    }
}

export function romanize(index) {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[index];
};