// Any ts doc including subfolders can do "import minecraft from 'minecraft'" now

declare module 'minecraft' {
    export function on(event: string, callback: (event: any) => any): void
}