import { type LucideIcon } from 'lucide-react'

export interface StatCard {
    title: string
    value: string
}

export interface FileItem {
    name: string
    size: string
}

export interface ActivityItem {
    type: string
    text: string
    sub: string
    time: string
    icon: LucideIcon
    color: string
}