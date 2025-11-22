import { TextField } from "@mui/material";

export default function StyledDateField({
  label,
  value,
  onChange,
  ...props
}) {
  return (
    <TextField
      type="date"
      label={label}
      value={value}
      onChange={onChange}
      size="small"
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      sx={{
        width: { xs: "150px", sm: "180px", md: "200px" },
        background: "rgba(255,255,255,0.9)",
        borderRadius: 3,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          fontFamily: "Fjalla One",
          "& fieldset": {
            borderColor: "rgba(0,0,0,0.3)",
          },
          "&:hover fieldset": {
            borderColor: "#009688",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#009688",
            borderWidth: 2,
          },
          "& input": {
            fontFamily: "Fjalla One",
          },
        },
        "& .MuiInputLabel-root": {
          fontFamily: "Fjalla One",
        }
      }}
      {...props}
    />
  );
}
