
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

export type PaginatedResponse<T> = {
    data: T[];
    links: PaginatedLink[];
    current_page: number;
    last_page: number;
    total: number;
    meta?: { links: PaginatedLink[]; total: number };
}

export type ArticleSummary = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    published_at: string;
    meta_title?: string | null
}

export type User = {
    profile_photo_url: string | React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_IMG_SRC_TYPES[keyof React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_IMG_SRC_TYPES] | undefined;
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
}

export type Medicine = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export type Schedule = {
    id: number;
    doctor_name: string;
    specialist: string;
    day: string;
    time_start: string;
    time_end: string;
    is_available: boolean;
}
