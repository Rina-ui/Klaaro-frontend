export function formatRelativeDate(dateString?: string | null): string {
    if (!dateString) return "Date inconnue";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date inconnue";

    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHour < 24) return `Il y a ${diffHour}h`;
    if (diffDay === 1) return "Hier";
    if (diffDay < 7) return `Il y a ${diffDay} jours`;

    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
