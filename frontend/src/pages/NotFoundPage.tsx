import { Button, Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', py: 8 }}>
      <Typography variant="h2" component="h1">
        Page not found
      </Typography>
      <Typography color="text.secondary">
        The requested screen does not exist in this workspace.
      </Typography>
      <Button component={Link} to="/clients" variant="contained">
        Go to customers
      </Button>
    </Box>
  )
}