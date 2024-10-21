import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CompanyCardProps {
  userId: string;
  image: string;
  name: string;
  details: string;
  companyId: string;
  interestCount: number;
  internCount: number;
  eventJoinCount: number;
  userInterest: boolean;
  userIntern: boolean;
  userEventJoin: boolean;

}

const CompanyCard: React.FC<CompanyCardProps> = ({ userId, image, name, details, companyId, interestCount, internCount, eventJoinCount }) => {
  const router = useRouter();
  const [currentInterestCount, setCurrentInterestCount] = useState(interestCount);
  const [currentInternCount, setCurrentInternCount] = useState(internCount);
  const [currentEventJoinCount, setCurrentEventJoinCount] = useState(eventJoinCount);
  const [isInterested, setIsInterested] = useState(false);
  const [isInterned, setIsInterned] = useState(false);
  const [isEventJoined, setIsEventJoined] = useState(false);

  useEffect(() => {
    const fetchUserReactions = async () => {
      try {
        const response = await fetch('/api/fetchUserReactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId:userId, companyId:companyId }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsInterested(data.isInterested);
          setIsInterned(data.isInterned);
          setIsEventJoined(data.isEventJoined);
        } else {
          console.error('Failed to fetch user reactions');
        }
      } catch (error) {
        console.error('Error fetching user reactions:', error);
      }
    };

    if (userId && companyId) {
      fetchUserReactions();
    }
  }, [userId, companyId]);

  const handleCardClick = () => {
    router.push(`/companies/${companyId}`);
  };

  const handleReactionClick = async (actionType: string) => {
    try {
      const response = await fetch('/api/companyReaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionType:actionType, companyId:companyId, userId:userId }),
      });
  
      if (response.ok) {
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
      sx={{
        display: 'flex',
        marginBottom: 2,
        cursor: 'pointer',
        transition: 'transform 0.3s',
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={2} sx={{ justifyContent: 'center' }}>
          <CardMedia
            component="img"
            image={image}
            alt={name}
          />
        </Grid>
        <Grid item xs={10}>
          <CardContent sx={{ flex: '1 0 auto' }} onClick={handleCardClick}>
            <Typography component="div" variant="h5" sx={{ marginBottom: 2 }}>
              {name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ marginBottom: 2 }}>
              {details}
            </Typography>
          </CardContent>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <CardActions sx={{ marginLeft: 5, alignItems: 'center' }}>
                <Button size="medium" variant="outlined" onClick={handleCardClick}>
                  詳しく見る
                </Button>
              </CardActions>
            </Grid>
            <Grid item xs={9}>
              <CardActions sx={{ marginLeft: 5, alignItems: 'center' }}>
                <Button
                  startIcon={<FavoriteIcon />}
                  size="medium"
                  variant={isInterested ? 'contained' : 'outlined'}
                  onClick={() => handleReactionClick('interest')}
                >
                  気になる ({currentInterestCount})
                </Button>
                <Button
                  size="medium"
                  variant={isInterned ? 'contained' : 'outlined'}
                  onClick={() => handleReactionClick('intern')}
                >
                  インターン参加 ({currentInternCount})
                </Button>
                <Button
                  size="medium"
                  variant={isEventJoined ? 'contained' : 'outlined'}
                  onClick={() => handleReactionClick('eventJoin')}
                >
                  イベント参加 ({currentEventJoinCount})
                </Button>
              </CardActions>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CompanyCard;
