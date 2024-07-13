import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import { UserCheck } from '@phosphor-icons/react/dist/ssr';


export interface EvaluatedStudentCountProps {
  sx?: SxProps;
  value: number;
  valuePercentage:number;
  EvaluationType : string;
}

export function EvaluatedStudentCount({ value,valuePercentage,EvaluationType, sx }: EvaluatedStudentCountProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                已评价人数 （{EvaluationType}）
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <UserCheck fontSize="var(--icon-fontSize-lg)" />
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
