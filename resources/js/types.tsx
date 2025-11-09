
export type Article = {
    meta_keywords: string;
    meta_description: string;
    meta_title: string;
    tags: any[];
    id: number;
    title: string;
    slug: string;
    body: string;
    image: string | null;
    status: 'draft' | 'published';
    published_at: string;
    created_at: string;
    updated_at: string;
}

export type PaginatedLink = {
    url: string | null;
    label: string;
    active: boolean;
}

export type InertiaPaginatedResponse<T> = {
    data: T[];
    links: PaginatedLink[];
    meta: {
        links: PaginatedLink[];
        current_page: number;
        last_page: number;
        path: string;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export type ArticleSummary = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    published_at: string;
    meta_title?: string | null
}

export class User {
}
