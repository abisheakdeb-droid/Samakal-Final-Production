export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    image?: string | null;
    badge?: "Verified Reader" | "Super Reader" | "Member";
    preferences: {
        categories: string[];
        notifications: boolean;
        theme: "light" | "dark" | "system";
    };
    memberSince: string;
}

export interface Bookmark {
    id: string;
    user_id: string;
    news_id: string;
    created_at: string;
}

export interface ReadingHistory {
    id: string;
    user_id: string;
    news_id: string;
    read_at: string;
}

export interface Comment {
    id: string;
    content: string;
    user_id: string;
    news_id: string;
    parent_id?: string; // for nested replies
    created_at: string;
    user?: Partial<User>;
    replies?: Comment[];
}

export interface Reaction {
    id: string;
    user_id: string;
    news_id: string;
    type: "like" | "love" | "wow" | "angry";
    created_at: string;
}
