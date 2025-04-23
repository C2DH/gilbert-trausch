import parse, { domToReact } from 'html-react-parser';
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

    // Traitement des tooltips
    if (domNode.type === 'tag' && domNode.name === 'span' && domNode.attribs?.class === 'tooltip') {

        // Récupère le noeud tooltipText
        const tooltipTextNode = domNode.children.find(
            child => child.name === 'span' && child.attribs?.class === 'tooltipText'
        );

        // Extraire tout le texte ou le HTML du tooltipText
        const tooltipText = tooltipTextNode?.children
            ? domToReact(tooltipTextNode.children)  // Convertir les enfants en React Node
            : tooltipTextNode?.children?.[0]?.data?.trim() || '';

        // Filtrer les enfants qui NE sont PAS le tooltipText (ceux à afficher dans le Tippy)
        const triggerContentNodes = domNode.children.filter(
            child => !(child.name === 'span' && child.attribs?.class === 'tooltipText')
        );

        return (
            <Tippy content={tooltipText} trigger="click" interactive={true}>
                <span className="tooltip-trigger">{domToReact(triggerContentNodes)}</span>
            </Tippy>
        );
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