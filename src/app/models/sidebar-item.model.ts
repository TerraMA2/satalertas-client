export class SidebarItem {
    constructor(
        public label: string,
        public link?: string,
        public method?: string,
        public dataUrl?: string,
        public value?: number,
        public icon?: string,
        public separator?: boolean
    ) {
    }
}
