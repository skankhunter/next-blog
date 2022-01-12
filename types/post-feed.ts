export type PostData = {
   title: string;
   slug: string;
   uid: string;
   nickname: string;
   published: boolean;
   content: string;
   createdAt: number;
   updatedAt: number;
   heartCount: number;
};

export type Posts = PostData[];
