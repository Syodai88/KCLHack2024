import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState} from 'react';
import { Company } from '@/interface/interface';
import { FaHeart, FaUserGraduate, FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import styles from './Companycard.module.css'; 
import axios from 'axios';

interface CompanyCardProps {
  company : Company,
  userId : string,
  image : string,
}

const CompanyCard: React.FC<CompanyCardProps> = ({ userId, image, company }) => {
  const router = useRouter();
  const [currentInterestCount, setCurrentInterestCount] = useState(company.interestedCount);
  const [currentInternCount, setCurrentInternCount] = useState(company.internCount);
  const [currentEventJoinCount, setCurrentEventJoinCount] = useState(company.eventJoinCount);
  const [isInterested, setIsInterested] = useState(company.reactions?.isInterested ?? false);
  const [isInterned, setIsInterned] = useState(company.reactions?.isInterned ?? false);
  const [isEventJoined, setIsEventJoined] = useState(company.reactions?.isEventJoined ?? false);

  const handleCardClick = () => {
    router.push(`/companies/${company.corporateNumber}`);
  };

  const handleReactionClick = async (actionType: string) => {
    try {
      const response = await axios.post('/api/companyReaction', {
        actionType,
        companyId: company.corporateNumber,
        userId,
      });
  
      if (response.status === 200) {
        if (actionType === 'interest') {
          setCurrentInterestCount((prevCount) => (isInterested ? prevCount - 1 : prevCount + 1));
          setIsInterested((prev) => !prev);
        } else if (actionType === 'intern') {
          setCurrentInternCount((prevCount) => (isInterned ? prevCount - 1 : prevCount + 1));
          setIsInterned((prev) => !prev);
        } else if (actionType === 'eventJoin') {
          setCurrentEventJoinCount((prevCount) => (isEventJoined ? prevCount - 1 : prevCount + 1));
          setIsEventJoined((prev) => !prev);
        }
      } else {
        console.error('Failed to update reaction');
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        fontFamily: "'Roboto', 'sans-serif'",
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 3,
        padding: 2,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            image={image}
            alt={company.name}
            sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <CardContent onClick={(e) => e.stopPropagation()} sx={{ paddingBottom: '16px' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', marginBottom: 1, cursor: 'pointer' }} onClick={handleCardClick}>
              {company.name}
            </Typography>
            <Typography variant="subtitle1" color="text.primary" sx={{ marginBottom: 2, cursor: 'pointer' }} onClick={handleCardClick}>
              {company.keyMessageAi}
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ fontSize: 20, marginRight: 1 }} /> 所在地: {company.location || '情報がありません'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupIcon sx={{ fontSize: 20, marginRight: 1 }} /> 従業員数: {company.employeeNumberAi || company.employeeNumber || '情報がありません'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <MonetizationOnIcon sx={{ fontSize: 20, marginRight: 1 }} /> 新卒平均: {company.averageSalaryAi || '情報がありません'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ fontSize: 20, marginRight: 1 }} /> 設立日: {company.dateOfEstablishment || '情報がありません'}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
              <BusinessIcon sx={{ fontSize: 20, marginRight: 1 }} /> 業務概要:
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ marginLeft: 3, marginTop: 1 }}>
              {company.businessSummaryAi || '情報がありません'}
            </Typography>
          </CardContent>
          <div className={styles.actionButtons}>
            <div className={styles.reactionButtons}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleReactionClick('interest');
                }}
                className={`${styles.button} ${isInterested ? styles.interested : ''}`}
              >
                <FaHeart />
                興味 ({currentInterestCount})
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleReactionClick('intern');
                }}
                className={`${styles.button} ${isInterned ? styles.interned : ''}`}
              >
                <FaUserGraduate />
                インターン ({currentInternCount})
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleReactionClick('eventJoin');
                }}
                className={`${styles.button} ${isEventJoined ? styles.attendedEvent : ''}`}
              >
                <FaCalendarCheck />
                イベント ({currentEventJoinCount})
              </button>
              <button 
                onClick={handleCardClick} 
                className={styles.detailButton}
              >
                <FaInfoCircle />
                詳細
              </button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CompanyCard;
