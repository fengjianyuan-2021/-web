import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import { LinearProgress } from '@mui/material';
import { UserCircleCheck, UserCircleMinus } from '@phosphor-icons/react/dist/ssr';

export interface UnevaluatedStudentCountProps {
  sx?: SxProps;
  value?: number;
  valuePercentage? : number;
  EvaluationType : string;
}

export function UnevaluatedStudentCount({ value,valuePercentage, EvaluationType,sx }: UnevaluatedStudentCountProps): React.JSX.Element {
  return (
    <Card sx={sx}>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {EvaluationType}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
            <UserCircleMinus fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
        </Stack>
        <div>
          
          <LinearProgress value={valuePercentage} variant="determinate" />
        </div>
      </Stack>
    </CardContent>
  </Card>
  );
}
