export interface Company{
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