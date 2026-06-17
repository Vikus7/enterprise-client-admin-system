import { Button, Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', py: 8 }}>
      <Typography variant="h2" component="h1">
        Pagina no encontrada
      </Typography>
      <Typography color="text.secondary">
        La vista solicitada no existe dentro de esta aplicacion.
      </Typography>
      <Button component={Link} to="/clients" variant="contained">
        Volver al listado
      </Button>
    </Box>
  )
}
