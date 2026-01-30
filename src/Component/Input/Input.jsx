import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Input({ label, type, name, value, onChange }) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        name={name}
        value={value}
        label={label}
        variant="standard"
        type={type}
        onChange={onChange}
      />
    </Box>
  );
}


