import Button from '@mui/material/Button';

//pass paramiter
export default function Botton({  text , onClick , className  }) {
  return (
    <Button onClick={onClick} className={className} >
      {text}
    </Button>
  );
}
