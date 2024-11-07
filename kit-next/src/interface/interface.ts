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
}

export interface Posts{
    id: number; 
    userId: string; // 投稿者のユーザーID
    companyId: string; // 投稿先の企業の法人番号
    title: string; // 投稿のタイトル
    content: string; // 投稿の内容
    createdAt: string; // 作成日時
    updatedAt: string; // 更新日時
    likeCount: number; // いいね数のキャッシュ
}

export interface Tag {
    id: number; // タグのID
    name: string; // タグの名前
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