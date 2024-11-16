export interface Company{
    isPopular? : boolean;
    corporateNumber: string;
    name: string;
    location: string;
    businessSummary: string;
    businessSummaryAi : string;
    keyMessageAi : string;
    companyUrl : string;
    employeeNumber? : number;         
    employeeNumberAi? : number;
    dateOfEstablishment? : string;
    averageContinuousServiceYearsAi? : number;
    averageAgeAi? : number;
    averageSalaryAi? : string;
    updateDate?: string;
    
    interestedCount: number;
    internCount: number;
    eventJoinCount: number;
    userInterest: boolean;
    userIntern: boolean;
    userEventJoin: boolean;

    reactions?: {
        isInterested: boolean;
        isInterned: boolean;
        isEventJoined: boolean;
    };
}

export interface Tag {
    id: number;
    name: string;
}
  
export interface Post {
    id: number;
    title: string;
    content: string;
    userId: string;
    companyId: string;
    likeCount: number;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
    company: {
      id: string;
      name: string;
    };
    tags: Tag[];
    isLiked: boolean;
}
  
export interface Comment {
    id: number; 
    postId: number; // 対象PostのID
    userId: string; // コメントしたユーザーのID
    content: string; // コメントの内容
    parentId?: number; // 親コメントのID（返信の場合）
    createdAt: string; // 作成日時
    updatedAt: string; // 更新日時
}