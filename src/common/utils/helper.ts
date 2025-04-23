export function truncateText(text: string, length: number) {
    console.log('text', text)
    return `${text.slice(0, length)}...`
}